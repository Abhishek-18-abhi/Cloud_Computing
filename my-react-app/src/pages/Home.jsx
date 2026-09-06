import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import products, { categories, formatPrice } from "../data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function Home() {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 6);
  const categoryCards = categories
    .filter((category) => category !== "All")
    .map((category) => {
      const categoryProducts = products.filter((product) => product.category === category);

      return {
        name: category,
        count: categoryProducts.length,
        image: categoryProducts[0].img,
      };
    });

  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-background" aria-hidden="true">
          <Swiper modules={[Autoplay, Pagination]} spaceBetween={20} slidesPerView={1} loop={true} autoplay={{delay: 3000, disableOnInteraction: false,}} pagination={{ clickable: true }}>
          {featuredProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <img src={product.img} alt={product.name} className="hero-slider-image"/>
          </SwiperSlide>
          ))}
          </Swiper>
          <div className="hero-background-overlay" />
        </div>
        <div className="hero-text">
          <span className="section-label">Electronic Products</span>
          <h1>Better tech choices in one practical store</h1>

          <p>
            Explore phones, laptops, tablets, audio products, and accessories with
            product categories, listed prices, stock controls, WhatsApp ordering, and bill generation.
          </p>

          <Link to="/products" className="shop-btn">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="trust-strip" aria-label="ElectroHub store benefits">
        <div><strong>30+</strong><span>handpicked products</span></div>
        <div><strong>6</strong><span>tech categories to explore</span></div>
        <div><strong>Easy</strong><span>WhatsApp ordering support</span></div>
        <div><strong>Secure</strong><span>billing for every order</span></div>
      </section>

      <section className="categories">
        <span className="section-label">Shop by category</span>
        <h2>Find the right product faster</h2>

        <div className="category-container">
          {categoryCards.map((category) => (
            <Link to="/products" className="category-card" key={category.name}>
              <img src={category.image} alt={category.name} />
              <h3>{category.name}</h3>
              <p>{category.count} products</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <span className="section-label">Featured deals</span>
        <h2>Popular products this week</h2>

        <div className="category-container">
          {featuredProducts.map((product) => (
            <article className="category-card" key={product.id}>
              <img src={product.img} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{formatPrice(product.price)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="why-us">
        <span className="section-label">Service promise</span>
        <h2>Why choose our Electronic Products?</h2>

        <div className="features">
          <div className="feature">
            <h3>WhatsApp Ordering</h3>
            <p>Send product image links, names, prices, and quantities directly on WhatsApp.</p>
          </div>

          <div className="feature">
            <h3>Printable Billing</h3>
            <p>Generate a clean bill after payment details are entered.</p>
          </div>

          <div className="feature">
            <h3>Persistent Cart</h3>
            <p>Your cart remains saved in the browser even after refreshing.</p>
          </div>
        </div>
      </section>

      <section className="shopping-guide">
        <div>
          <span className="section-label">A simple shopping journey</span>
          <h2>Choose confidently, order easily.</h2>
          <p>Browse the catalogue, compare the details that matter, add your favourites to the cart, and complete your order with a clear bill.</p>
        </div>
        <div className="guide-steps">
          <article><span>01</span><h3>Browse products</h3><p>Use categories and search to find the right device faster.</p></article>
          <article><span>02</span><h3>Review details</h3><p>Open a product to check its description, tags, and price.</p></article>
          <article><span>03</span><h3>Place your order</h3><p>Add items to your cart and select the checkout option that suits you.</p></article>
        </div>
        <Link to="/products" className="outline-link">Explore all products</Link>
      </section>

    </>
  );
}

export default Home;
