import { Chrome } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import gsap from "gsap";

import axios from "../utils/axios";
import { loginSuccess } from "../component/context/authSlice.js";

import leftImage from "../assets/hero-truck.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cardRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= GSAP ANIMATION ================= */
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out"
      }
    );

    gsap.fromTo(
      formRef.current.children,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out"
      }
    );
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/user/login", {
        email: formData.email,
        password: formData.password
      });

      const user = res.data.data.user;

      dispatch(loginSuccess(user));

      if (user.role === "WAREHOUSE") {
        navigate("/warehouse/dashboard");
      } else if (user.role === "DEALER") {
        navigate("/dealer/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb] px-4">
      {/* CARD */}
      <div
        ref={cardRef}
        className="
          w-full max-w-5xl
          bg-white
          rounded-3xl
          shadow-xl
          overflow-hidden
          grid grid-cols-1 lg:grid-cols-2
        "
      >
        {/* LEFT IMAGE */}
        <div
          className="hidden lg:flex relative bg-cover bg-center"
          style={{ backgroundImage: `url(${leftImage})` }}
        >
          <div className="absolute inset-0 bg-gray-100/60" />

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-10 text-black w-full">
            <h2 className="text-4xl font-bold leading-tight">
              WELCOME TO <br />
              <span className="text-[#6EA8FE]">TruckHub</span>
            </h2>

            <p className="mt-4 text-black/80 max-w-sm">
              Intelligent logistics that optimizes shipments, reduces cost,
              and lowers emissions.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Welcome back
          </h2>

          <p className="mt-2 text-sm text-gray-500 text-center">
            Login to your TruckHub account
          </p>

          {/* ERROR */}
          {error && (
            <p className="mt-4 text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {/* FORM */}
          <div ref={formRef} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="
                  w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                "
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="
                  w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                "
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="
                w-full bg-black text-white
                py-3 rounded-xl
                text-sm font-medium
                hover:bg-gray-900 transition
                disabled:opacity-60
              "
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-3 text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* GOOGLE */}
          <button
            className="
              w-full flex items-center justify-center gap-2
              border rounded-xl py-3
              text-sm font-medium
              hover:bg-gray-50 transition
            "
          >
            <Chrome size={16} />
            Sign in with Google
          </button>

          <p className="mt-6 text-xs text-center text-gray-500">
            New to SHIPMENT?{" "}
            <Link to="/register" className="text-black font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
