import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { cartCount } = useCart();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="announcement-bar">
        <span>Free delivery on orders above ₹10,000</span>
        <span>Need help choosing? <Link to="/contact">Talk to our team</Link></span>
      </div>
      <header className={`nav ${menuOpen ? "menu-open" : ""}`}>
      <Link to="/" className="brand-link" onClick={closeMenu}>
        <img src={logo} alt="ElectroHub Logo" className="logo" />
        <span>Electronics Store</span>
      </Link>

      <button
        type="button"
        className="menu-toggle"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={menuOpen ? "nav-menu is-open" : "nav-menu"}>
        <ul>
          <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/products" onClick={closeMenu}>Products</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu}>About Us</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu}>Contact Us</NavLink></li>
          {!user ? (
            <>
              <li><NavLink to="/login" onClick={closeMenu}>Login</NavLink></li>
              <li><NavLink to="/signup" onClick={closeMenu}>Signup</NavLink></li>
            </>
          ) : (
            <li>
              <button
                type="button"
                className="nav-logout"
                onClick={async () => {
                  closeMenu();
                  await signOut();
                }}
              >
                Logout
              </button>
            </li>
          )}
          <li>
            <NavLink to="/cart" className="cart-nav-link" onClick={closeMenu}>
              Cart
              <span>{cartCount}</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      </header>
    </>
  );
}

export default Navbar;
