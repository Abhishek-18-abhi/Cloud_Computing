import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import StoreFooter from "./components/StoreFooter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
      <StoreFooter />
    </BrowserRouter>
  );
}

export default App;
