import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate(location.state?.from || "/", { replace: true });
  }

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-box">
          <h1>Login</h1>
          <p>Welcome Back to ElectroHub</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-options">
              <label className="check-control">
                <input type="checkbox" />
                <span className="checkmark" aria-hidden="true"></span>
                <span>Remember Me</span>
              </label>
              <Link to="#">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="show-password">
            <label className="check-control">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((value) => !value)}
              />
              <span className="checkmark" aria-hidden="true"></span>
              <span>Show Password</span>
            </label>
          </div>

          <p className="signup-text">
            Don't have an account?
            <Link to="/signup"> Create Account</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
