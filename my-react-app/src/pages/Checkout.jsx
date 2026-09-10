import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import { formatPrice } from "../data/products";
import api from "../lib/api";

const WHATSAPP_NUMBER = "";

const initialCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

function calculateOrder(cart, subtotal) {
  const delivery = subtotal === 0 || subtotal >= 10000 ? 0 : 299;
  const platformFee = subtotal === 0 ? 0 : 49;

  return {
    delivery,
    platformFee,
    grandTotal: subtotal + delivery + platformFee,
  };
}

function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const [customer, setCustomer] = useState(initialCustomer);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentReference, setPaymentReference] = useState("");
  const [bill, setBill] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const order = useMemo(
    () => calculateOrder(cart, subtotal),
    [cart, subtotal]
  );

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }
  function printBill() {
  window.print();
} 

  function openWhatsAppOrder() {
    const lines = cart.map((item, index) => (
      `${index + 1}. ${item.name}\n` +
      `Brand: ${item.brand}\n` +
      `Price: ${formatPrice(item.price)}\n` +
      `Quantity: ${item.quantity}\n` +
      `Total: ${formatPrice(item.price * item.quantity)}`
    ));

    const message = [
      "I Want To Order",
      "",
      customer.name ? `Customer: ${customer.name}` : "",
      customer.phone ? `Phone: ${customer.phone}` : "",
      customer.address ? `Address: ${customer.address}` : "",
      "",
      "Products:",
      lines.join("\n\n"),
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      `Delivery: ${order.delivery === 0 ? "Free" : formatPrice(order.delivery)}`,
      `Platform Fee: ${formatPrice(order.platformFee)}`,
      `Grand Total: ${formatPrice(order.grandTotal)}`,
    ].filter(Boolean).join("\n");

    const baseUrl = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}`
      : "https://wa.me/8655414524";

    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  async function generateBill(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post("/orders", {
        customerName: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        paymentMethod,
        transactionId: paymentReference,
        items: cart.map((item) => ({
          productId: Number(item.id),
          quantity: Number(item.quantity),
        })),
      });

      const savedOrder = response.data.order;

      setBill({
        id: `EH-${savedOrder.order_id}`,
        date: new Date(savedOrder.created_at).toLocaleString("en-IN"),
        customer,
        paymentMethod,
        paymentReference: paymentReference || "Paid online",
        items: cart,
        subtotal,
        ...order,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Could not save the order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.length === 0 && !bill) {
    return (
      <>
        <Navbar />
        <main className="empty-cart">
          <h1>No products for checkout</h1>
          <p>Add products to cart before generating a bill.</p>
          <Link to="/products" className="shop-btn">Browse Products</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <section className="checkout-title">
          <div>
            <span className="section-label">Checkout</span>
            <h1>Choose how to place the order</h1>
            <p>Send order details on WhatsApp or complete payment details and generate a bill.</p>
          </div>
        </section>

        {!bill ? (
          <section className="checkout-layout">
            <div className="checkout-options">
              <article className="checkout-option-card">
                <span className="option-number">Option 1</span>
                <h2>Order on WhatsApp</h2>
                <p>
                  Opens WhatsApp with product image links, names, prices,
                  quantities, customer details, and total amount.
                </p>

                <div className="checkout-preview-list">
                  {cart.map((item) => (
                    <div className="checkout-preview-item" key={item.id}>
                      <img src={item.img} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{formatPrice(item.price)} x {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="whatsapp-btn" type="button" onClick={openWhatsAppOrder}>
                  Order on WhatsApp
                </button>
              </article>

              <article className="checkout-option-card">
                <span className="option-number">Option 2</span>
                <h2>Billing after payment</h2>
                <p>Enter customer and payment details, then generate a printable bill.</p>

                <form className="billing-form" onSubmit={generateBill}>
                  <label>
                    Customer name
                    <input
                      value={customer.name}
                      onChange={(event) => updateCustomer("name", event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Phone number
                    <input
                      value={customer.phone}
                      onChange={(event) => updateCustomer("phone", event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(event) => updateCustomer("email", event.target.value)}
                    />
                  </label>

                  <label>
                    Payment method
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    >
                      <option>UPI</option>
                      <option>Card</option>
                      <option>Net Banking</option>
                      <option>Cash on Delivery</option>
                    </select>
                  </label>

                  <label className="wide-field">
                    Delivery address
                    <textarea
                      value={customer.address}
                      onChange={(event) => updateCustomer("address", event.target.value)}
                      required
                    />
                  </label>

                  <label className="wide-field">
                    Payment reference / transaction id
                    <input
                      value={paymentReference}
                      onChange={(event) => setPaymentReference(event.target.value)}
                      placeholder="Example: UPI123456789"
                    />
                  </label>

                  <button className="checkout-btn wide-field" type="submit">
                    {submitting ? "Saving Order..." : "Payment Done - Generate Bill"}
                  </button>
                </form>
              </article>
            </div>

            <aside className="checkout-box">
              <h2>Order Summary</h2>
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</strong>
              </div>
              <div>
                <span>Platform fee</span>
                <strong>{formatPrice(order.platformFee)}</strong>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <strong>{formatPrice(order.grandTotal)}</strong>
              </div>
            </aside>
          </section>
        ) : (
          <section className="bill-page">
            <div className="bill-actions">
              <button className="outline-btn" type="button" onClick={printBill}>
                Print Bill
              </button>
              <button className="remove-btn" type="button" onClick={clearCart}>
                Clear Cart
              </button>
            </div>

            <article className="bill-card">
              <header className="bill-header">
                <div>
                  <span className="section-label">Electronics Store Invoice</span>
                  <h2>Bill #{bill.id}</h2>
                  <p>{bill.date}</p>
                </div>
                <div>
                  <strong>Payment Paid</strong>
                  <span>{bill.paymentMethod}</span>
                </div>
              </header>

              <section className="bill-customer">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> {bill.customer.name}</p>
                <p><strong>Phone:</strong> {bill.customer.phone}</p>
                {bill.customer.email && <p><strong>Email:</strong> {bill.customer.email}</p>}
                <p><strong>Address:</strong> {bill.customer.address}</p>
                <p><strong>Payment Ref:</strong> {bill.paymentReference}</p>
              </section>

              <div className="bill-table">
                <div className="bill-row bill-row-head">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Qty</span>
                  <span>Total</span>
                </div>

                {bill.items.map((item) => (
                  <div className="bill-row" key={item.id}>
                    <span className="bill-product">
                      <img src={item.img} alt={item.name} />
                      <strong>{item.name}</strong>
                    </span>
                    <span>{formatPrice(item.price)}</span>
                    <span>{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <section className="bill-total-box">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatPrice(bill.subtotal)}</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>{bill.delivery === 0 ? "Free" : formatPrice(bill.delivery)}</strong>
                </div>
                <div>
                  <span>Platform fee</span>
                  <strong>{formatPrice(bill.platformFee)}</strong>
                </div>
                <div className="summary-total">
                  <span>Grand Total</span>
                  <strong>{formatPrice(bill.grandTotal)}</strong>
                </div>
              </section>
            </article>
          </section>
        )}
      </main>
    </>
  );
}

export default Checkout;
