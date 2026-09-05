import { useState } from "react";
import Navbar from "../components/Navbar";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <>
      <Navbar />

      <section className="contact">

        <h1>Contact Us</h1>

        <p className="contact-subtitle">
          We'd love to hear from you. Feel free to contact us anytime.
        </p>

        <div className="contact-container">

          {/* Contact Information */}

          <div className="contact-info">

            <h2>Get In Touch</h2>

            <p>📍 Mumbai, Maharashtra, India</p>

            <p>📞 +91 98765 43210</p>

            <p>📧 support@electrohub.com</p>

            <p>🕒 Mon - Sat : 9:00 AM - 8:00 PM</p>

          </div>

          {/* Contact Form */}

          <div className="contact-form">

            <h2>Send Message</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Full Name"
              />

              <input
                type="email"
                placeholder="Email Address"
              />

              <input
                type="text"
                placeholder="Subject"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
              ></textarea>

              <button type="submit">
                Send Support Request
              </button>

              {submitted && <p className="form-success" role="status">Thanks—your request has been noted. Our team will contact you using the details you provided.</p>}

            </form>

          </div>

        </div>

        {/* Google Map */}

        <div className="map">

          <iframe
            title="ElectroHub Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.773729327963!2d72.877655!3d19.07609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce2bdb5e3d5f%3A0x7b63c9e5e1f3d6b6!2sMumbai!5e0!3m2!1sen!2sin!4v1710000000000"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>

        </div>

        <section className="contact-help">
          <article><strong>Before you order</strong><span>Ask for help choosing the right product, feature, or category.</span></article>
          <article><strong>After you order</strong><span>Share your bill number or payment reference so we can help faster.</span></article>
          <article><strong>Business hours</strong><span>Our support team is available Monday to Saturday, 9:00 AM to 8:00 PM.</span></article>
        </section>

      </section>
    </>
  );
}

export default Contact;
