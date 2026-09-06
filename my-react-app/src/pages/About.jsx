import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />

      <section className="about">
        <span className="section-label">The Electronics Store story</span>
        <h1>About Electronics Store</h1>

        <p>
          Welcome to <strong>ElectroHub</strong>, your trusted destination
          for the latest electronic gadgets and accessories.
          We provide premium-quality smartphones, laptops,
          smartwatches, headphones, and other electronic devices
          from top brands at affordable prices.
        </p>

        <div className="about-container">

          <div className="about-card">
            <h2>🎯 Our Mission</h2>

            <p>
              To make technology affordable and accessible
              by offering genuine products with the best customer
              experience.
            </p>
          </div>

          <div className="about-card">
            <h2>👁 Our Vision</h2>

            <p>
              To become India's most trusted online electronics
              store by delivering quality products with excellent
              customer service.
            </p>
          </div>

          <div className="about-card">
            <h2>💡 Why Choose Us?</h2>

            <ul>
              <li>✔ 100% Genuine Products</li>
              <li>✔ Best Prices</li>
              <li>✔ Fast Delivery</li>
              <li>✔ Secure Payment</li>
              <li>✔ Easy Returns</li>
              <li>✔ 24×7 Customer Support</li>
            </ul>
          </div>

        </div>

        <div className="team">

          <h2>Our Commitment</h2>

          <p>
            At ElectroHub, customer satisfaction is our highest priority.
            Every product listed on our platform is carefully selected
            to ensure quality, performance, and reliability.
          </p>

        </div>

        <section className="about-values">
          <div className="about-values-heading">
            <span className="section-label">What guides us</span>
            <h2>A better way to shop for everyday technology.</h2>
          </div>
          <div className="about-values-grid">
            <article><span>01</span><h3>Quality first</h3><p>We focus on useful, reliable devices and accessories that make everyday work and entertainment easier.</p></article>
            <article><span>02</span><h3>Clear information</h3><p>Simple product details, transparent prices, and straightforward billing help you decide with confidence.</p></article>
            <article><span>03</span><h3>Helpful service</h3><p>Our ordering flow is designed to be quick, friendly, and easy to follow—from product discovery to checkout.</p></article>
          </div>
        </section>

        <section className="about-cta">
          <div>
            <span className="section-label">Ready when you are</span>
            <h2>Find technology that fits your day.</h2>
            <p>Explore products across phones, laptops, audio, accessories, and more.</p>
          </div>
          <Link to="/products" className="shop-btn">Start shopping</Link>
        </section>

      </section>
    </>
  );
}

export default About;
