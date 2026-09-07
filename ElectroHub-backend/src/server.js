import "dotenv/config";
import cors from "cors";
import express from "express";
import { requireAuth } from "./auth.js";
import { isPostgres, query, transaction } from "./db.js";
import { cleanText, email } from "./validation.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

const publicUserFields = "user_id, name, email, phone, created_at";
const productFields = "product_id, product_name, product_category, product_description, product_price, product_stock, product_image";

app.get("/api/health", async (_req, res, next) => {
  try {
    await query("SELECT 1 AS ok");
    res.json({ status: "ok", database: isPostgres ? "postgres" : "mysql" });
  } catch (error) { next(error); }
});

app.get("/api/auth/me", requireAuth, async (req, res, next) => {
  try {
    const user = (await query(`SELECT ${publicUserFields} FROM users WHERE user_id = ?`, [req.auth.userId])).rows[0];
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (error) { next(error); }
});

app.get("/api/products", async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 100);
    const filters = [];
    const params = [];
    if (req.query.category) { filters.push("product_category = ?"); params.push(req.query.category); }
    if (req.query.search) {
      filters.push("(product_name LIKE ? OR product_description LIKE ?)");
      params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }
    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const count = await query(`SELECT COUNT(*) AS total FROM products ${where}`, params);
    const result = await query(
      `SELECT ${productFields} FROM products ${where} ORDER BY product_id DESC LIMIT ? OFFSET ?`,
      [...params, limit, (page - 1) * limit]
    );
    res.json({ products: result.rows, pagination: { page, limit, total: Number(count.rows[0].total) } });
  } catch (error) { next(error); }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const product = (await query(`SELECT ${productFields} FROM products WHERE product_id = ?`, [req.params.id])).rows[0];
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ product });
  } catch (error) { next(error); }
});

app.post("/api/orders", requireAuth, async (req, res, next) => {
  try {
    const customerName = cleanText(req.body.customerName, "Customer name", { max: 100 });
    const phone = cleanText(req.body.phone, "Phone", { max: 20 });
    const customerEmail = email(req.body.email, { required: false });
    const address = cleanText(req.body.address, "Address", { max: 300 });
    const paymentMethod = cleanText(req.body.paymentMethod, "Payment method", { max: 30 });
    const transactionId = cleanText(req.body.transactionId, "Transaction ID", { required: false, max: 100 });
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) throw new Error("Add at least one item to the order.");

    const normalizedItems = items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    }));
    if (normalizedItems.some((item) => !Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      throw new Error("Each order item needs a valid productId and positive quantity.");
    }
    if (new Set(normalizedItems.map((item) => item.productId)).size !== normalizedItems.length) {
      throw new Error("Each product can appear only once in an order.");
    }

    const orderId = await transaction(async (connection) => {
      const ids = normalizedItems.map((item) => item.productId);
      const placeholders = ids.map(() => "?").join(", ");
      const products = (await query(
        `SELECT ${productFields} FROM products WHERE product_id IN (${placeholders})${isPostgres ? " FOR UPDATE" : " FOR UPDATE"}`,
        ids,
        connection
      )).rows;
      if (products.length !== normalizedItems.length) throw new Error("One or more products no longer exist.");
      const byId = new Map(products.map((product) => [Number(product.product_id), product]));
      let itemTotal = 0;
      const orderItems = normalizedItems.map((item) => {
        const product = byId.get(item.productId);
        if (Number(product.product_stock) < item.quantity) throw new Error(`${product.product_name} does not have enough stock.`);
        const price = Number(product.product_price);
        const subtotal = Number((price * item.quantity).toFixed(2));
        itemTotal += subtotal;
        return { product, ...item, price, subtotal };
      });
      // Keep the backend total aligned with the storefront checkout rule.
      // Prices and the final total are calculated here, never accepted from the client.
      const delivery = itemTotal === 0 || itemTotal >= 10000 ? 0 : 299;
      const platformFee = itemTotal === 0 ? 0 : 49;
      const total = Number((itemTotal + delivery + platformFee).toFixed(2));

      const created = await query(
        `INSERT INTO orders (user_id, customer_name, phone, email, address, payment_method, transaction_id, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)${isPostgres ? " RETURNING order_id" : ""}`,
        [req.auth.userId, customerName, phone, customerEmail, address, paymentMethod, transactionId, total],
        connection
      );
      const newOrderId = isPostgres ? created.rows[0].order_id : created.insertId;
      for (const item of orderItems) {
        await query(
          "INSERT INTO order_items (order_id, product_id, product_name, product_price, product_quantity, product_image, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [newOrderId, item.productId, item.product.product_name, item.price, item.quantity, item.product.product_image, item.subtotal],
          connection
        );
        await query("UPDATE products SET product_stock = product_stock - ? WHERE product_id = ?", [item.quantity, item.productId], connection);
      }
      return newOrderId;
    });
    const order = (await query("SELECT * FROM orders WHERE order_id = ?", [orderId])).rows[0];
    res.status(201).json({ message: "Order created successfully.", order });
  } catch (error) { next(error); }
});

app.get("/api/orders/my", requireAuth, async (req, res, next) => {
  try {
    const orders = (await query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [req.auth.userId])).rows;
    res.json({ orders });
  } catch (error) { next(error); }
});

app.get("/api/orders/:id", requireAuth, async (req, res, next) => {
  try {
    const order = (await query("SELECT * FROM orders WHERE order_id = ? AND user_id = ?", [req.params.id, req.auth.userId])).rows[0];
    if (!order) return res.status(404).json({ message: "Order not found." });
    const items = (await query("SELECT * FROM order_items WHERE order_id = ? ORDER BY id", [order.order_id])).rows;
    res.json({ order: { ...order, items } });
  } catch (error) { next(error); }
});

app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === "ER_DUP_ENTRY" || error.code === "23505") {
    return res.status(409).json({ message: "This record already exists." });
  }
  if (error.message?.includes("required") || error.message?.includes("valid") || error.message?.includes("must be") || error.message?.includes("Add at least") || error.message?.includes("enough stock") || error.message?.includes("only once") || error.message?.includes("no longer exist")) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: "Internal server error." });
});

// Start the server only when running locally
if (!process.env.VERCEL) {
  app.listen(port, () =>
    console.log(`Electronics Store API listening on http://localhost:${port}`)
  );
}

// Export Express app for Vercel
export default app;
