import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setUser((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  async function handleSignup(event) {
    event.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (user.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: user.email.trim(),
      password: user.password,
      options: {
        data: {
          full_name: user.fullname.trim(),
          phone: user.phone.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (data.session) {
      navigate("/");
    } else {
      alert("Account created. Check your email to confirm your account, then log in.");
      navigate("/login");
    }
  }

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <div className="signup-box">
          <h1>Create Account</h1>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={user.fullname}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={user.phone}
              onChange={handleChange}
              required
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={handleChange}
              required
            />

            <label className="check-control">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((value) => !value)}
              />
              <span className="checkmark" aria-hidden="true"></span>
              <span>Show Password</span>
            </label>

            <label className="check-control signup-check">
              <input type="checkbox" required />
              <span className="checkmark" aria-hidden="true"></span>
              <span>I agree to Terms &amp; Conditions</span>
            </label>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p>
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
