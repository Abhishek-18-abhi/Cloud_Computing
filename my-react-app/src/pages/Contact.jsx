import Navbar from "../components/Navbar";

function Contact() {
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

            <form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="50d24f4b-2570-4474-9a47-227421aba313" />
  <input type="text" name="name" placeholder="Enter Your Name" required />
  <input type="phone" name="phone" placeholder="Enter Your Mobile number" required />
  <input type="email" name="email" placeholder="Enter Your Email" required />
  <textarea name="message" placeholder="message" required></textarea>
  <button type="submit">Submit Form</button>
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
