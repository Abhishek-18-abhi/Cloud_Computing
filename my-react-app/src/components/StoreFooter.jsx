import { Link } from "react-router-dom";

function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-footer-grid">
        <section>
          <p className="footer-kicker">Electronics Store</p>
          <h2>Technology made easy to choose.</h2>
          <p>Browse useful electronics, review the details, and place your order through a simple checkout flow.</p>
        </section>

        <section>
          <h3>Shop</h3>
          <Link to="/products">All products</Link>
          <Link to="/products">Featured picks</Link>
          <Link to="/cart">Your cart</Link>
        </section>

        <section>
          <h3>Help</h3>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact support</Link>
          <Link to="/login">Your account</Link>
        </section>

        <section>
          <h3>Shop with confidence</h3>
          <p>Clear prices, secure checkout options, and a printable bill for completed purchases.</p>
          <Link className="footer-contact" to="/contact">abhishekthakkar027@gmail.com</Link>
        </section>
      </div>
      <div className="store-footer-bottom">
        <span>© 2026 Electronics Store. All rights reserved.</span>
        <span>Prices are listed in INR.</span>
      </div>
    </footer>
  );
}

export default StoreFooter;
