import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import api from "../utils/axios";

import leftImage from "../assets/hero-truck.jpeg";

const TRUCK_OPTIONS = [
  "MINI_TRUCK",
  "14FT_TRUCK",
  "20FT_TRUCK",
  "32FT_TRUCK",
  "CONTAINER_TRUCK",
  "REFRIGERATED_TRUCK",
  "TANKER",
  "TRAILER"
];

const SERVICE_AREA_OPTIONS = [
  "DELHI",
  "MUMBAI",
  "BENGALURU",
  "CHENNAI",
  "KOLKATA",
  "HYDERABAD",
  "PUNE",
  "AHMEDABAD"
];

const Register = () => {
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const formRef = useRef(null);

  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [warehouseDetails, setWarehouseDetails] = useState({
    companyName: "",
    managerName: "",
    location: ""
  });

  const [dealerDetails, setDealerDetails] = useState({
    truckTypes: [],
    serviceAreas: []
  });

  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  /* ================= GSAP ================= */
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
    );

    gsap.fromTo(
      formRef.current.children,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.25,
        ease: "power2.out"
      }
    );
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !role) {
      return setError("Please fill all required fields");
    }

    if (!phone) return setError("Please provide a phone number");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    // Client-side role-specific validation to avoid server 400
    if (role === "WAREHOUSE") {
      if (!warehouseDetails.companyName || !warehouseDetails.managerName || !warehouseDetails.location) {
        return setError("Please complete warehouse details");
      }
    }

    if (role === "DEALER") {
      if (!dealerDetails.truckTypes?.length || !dealerDetails.serviceAreas?.length) {
        return setError("Please select at least one truck type and one service area");
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("role", role);

      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      if (role === "WAREHOUSE") {
        formData.append("warehouseDetails", JSON.stringify(warehouseDetails));
      }

      if (role === "DEALER") {
        formData.append("dealerDetails", JSON.stringify(dealerDetails));
      }

      await api.post("/user/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-6">
      {/* CARD */}
      <div
        ref={cardRef}
        className="
          w-full max-w-6xl
          bg-white
          rounded-3xl
          shadow-2xl
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

          <div className="relative z-10 flex flex-col justify-center items-center text-center px-14 text-black">
            <h2 className="text-5xl font-bold leading-tight">
              CREATE YOUR <br />
              <span className="text-[#6EA8FE]">TruckHub</span> ACCOUNT
            </h2>

            <p className="mt-6 text-lg text-white/90 max-w-md">
              Register as a warehouse or dealer and optimize logistics with
              intelligent truck matching.
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-gray-900 text-center">
            Create Account
          </h2>

          <p className="mt-3 text-base text-gray-500 text-center">
            Register as Warehouse or Dealer
          </p>

          {error && (
            <p className="mt-5 text-sm text-red-500 text-center">{error}</p>
          )}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
            {/* NAME + EMAIL + PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
              <input
                placeholder="Full Name"
                className="input-lg
                 w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                "
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <input
                placeholder="Email Address"
                className="input-lg
                 w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                "
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                placeholder="Phone (10 digits)"
                className="input-lg
                 w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                "
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>

            {/* ROLE */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-lg 
               w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
              "
            >
              <option value="">Select Role</option>
              <option value="WAREHOUSE">Warehouse</option>
              <option value="DEALER">Dealer</option>
            </select>

            {/* WAREHOUSE */}
            {role === "WAREHOUSE" && (
              <div className="space-y-5">
                <input
                  placeholder="Company Name"
                  className="input-lg
                   w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                  "
                  onChange={(e) =>
                    setWarehouseDetails({
                      ...warehouseDetails,
                      companyName: e.target.value
                    })
                  }
                />
                <input
                  placeholder="Manager Name"
                  className="input-lg
                   w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                  "
                  onChange={(e) =>
                    setWarehouseDetails({
                      ...warehouseDetails,
                      managerName: e.target.value
                    })
                  }
                />
                <input
                  placeholder="Warehouse Location"
                  className="input-lg
                   w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                  "
                  onChange={(e) =>
                    setWarehouseDetails({
                      ...warehouseDetails,
                      location: e.target.value
                    })
                  }
                />
              </div>
            )}

            {/* DEALER */}
            {role === "DEALER" && (
              <>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {TRUCK_OPTIONS.map((truck) => (
                    <label key={truck} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dealerDetails.truckTypes.includes(truck)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setDealerDetails((prev) => ({
                            ...prev,
                            truckTypes: checked
                              ? [...prev.truckTypes, truck]
                              : prev.truckTypes.filter(t => t !== truck)
                          }));
                        }}
                      />
                      {truck.replace("_", " ")}
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                  className="input-lg text-left"
                >
                  {dealerDetails.serviceAreas.length
                    ? dealerDetails.serviceAreas.join(", ")
                    : "Select Service Areas"}
                </button>

                {showServiceDropdown && (
                  <div className="border rounded-2xl p-4 max-h-44 overflow-y-auto">
                    {SERVICE_AREA_OPTIONS.map((area) => (
                      <label key={area} className="flex gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={dealerDetails.serviceAreas.includes(area)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setDealerDetails((prev) => ({
                              ...prev,
                              serviceAreas: checked
                                ? [...prev.serviceAreas, area]
                                : prev.serviceAreas.filter(a => a !== area)
                            }));
                          }}
                        />
                        {area}
                      </label>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* PASSWORDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="password"
                placeholder="Password"
                className="input-lg
                 w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                "
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input-lg
                 w-full mt-1 px-4 py-3
                  rounded-xl border
                  text-sm
                  focus:outline-none
                  focus:ring-2 focus:ring-[#6EA8FE]
                "
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <input
              type="file"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              className="text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl text-base font-semibold hover:bg-gray-900 transition disabled:opacity-60"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-black font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
