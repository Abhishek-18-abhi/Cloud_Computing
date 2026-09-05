import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import { formatPrice } from "../data/products";

function Cart() {
  const {
    cart,
    subtotal,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  } = useCart();

  const delivery = subtotal === 0 || subtotal >= 10000 ? 0 : 299;
  const platformFee = subtotal === 0 ? 0 : 49;
  const grandTotal = subtotal + delivery + platformFee;

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <main className="empty-cart">
          <h1>Your cart is empty</h1>
          <p>Add products from the catalog and they will stay saved in this browser.</p>
          <Link to="/products" className="shop-btn">Browse Products</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="cart-container">
        <div className="cart-header">
          <div>
            <span className="section-label">Shopping cart</span>
            <h1>{cart.length} products selected</h1>
          </div>
          <button className="remove-btn" type="button" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <section className="cart-layout">
          <div className="cart-list">
            {delivery > 0 && (
              <div className="delivery-progress">
                Add <strong>{formatPrice(10000 - subtotal)}</strong> more to unlock free delivery.
              </div>
            )}
            {cart.map((item) => (
              <article className="cart-card" key={item.id}>
                <img src={item.img} alt={item.name} className="cart-image" />

                <div className="cart-details">
                  <span>{item.brand}</span>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>

                  <div className="qty-box">
                    <button type="button" onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => increaseQty(item.id)}>+</button>
                    <small>{item.stock} available</small>
                  </div>

                  <button
                    className="text-btn"
                    type="button"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove item
                  </button>
                </div>

                <div className="cart-price">
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <span>{formatPrice(item.price)} each</span>
                </div>
              </article>
            ))}
          </div>

          <aside className="checkout-box">
            <h2>Order Summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{delivery === 0 ? "Free" : formatPrice(delivery)}</strong>
            </div>
            <div>
              <span>Platform fee</span>
              <strong>{formatPrice(platformFee)}</strong>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </div>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
            </Link>
            <p className="checkout-reassurance">Your cart stays saved in this browser while you shop.</p>
          </aside>
        </section>
      </main>
    </>
  );
}

export default Cart;
