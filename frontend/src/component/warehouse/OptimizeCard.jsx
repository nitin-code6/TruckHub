import { useEffect, useRef, useState } from "react";
import axios from "../../utils/axios";
import {
  Truck,
  Leaf,
  IndianRupee,
  Gauge,
  CheckCircle,
  MapPin,
  Clock
} from "lucide-react";
import gsap from "gsap";

const OptimizeCard = ({
  shipmentId,
  fullOptions = [],
  pooledOptions = [],
  onBooked
}) => {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false); // ✅ NEW
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );
  }, []);

  const book = async (type, id) => {
    if (requested) return;

    try {
      setLoading(true);
      await axios.post(`/bookings/${shipmentId}`, {
        optionType: type,
        ...(type === "FULL_TRUCK"
          ? { truckId: id }
          : { bookingId: id })
      });

      setRequested(true); // ✅ mark as requested
      onBooked && onBooked();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const JobStyleCard = ({
    best,
    title,
    badge,
    rate,
    distanceKm,
    totalCost,
    btnText,
    onClick,
    children
  }) => (
    <div
      className={`relative bg-white rounded-2xl p-5 border shadow-sm
      ${best ? "border-green-500" : "border-gray-200"}`}
      ref={(el) => cardsRef.current.push(el)}
    >
      {badge && (
        <span className="absolute top-4 right-4 text-xs bg-gray-100 px-2 py-0.5 rounded">
          {badge}
        </span>
      )}

      {best && (
        <span className="absolute top-4 left-4 flex items-center gap-1 text-xs font-semibold text-green-600">
          <CheckCircle className="w-4 h-4" />
          Best Option
        </span>
      )}

      <h3 className="mt-6 text-sm font-semibold">{title}</h3>

      <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
        <MapPin className="w-3 h-3" />
        Distance: {distanceKm} km
      </p>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4" />
          Rate: ₹{rate} / km
        </p>
        {children}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-base font-bold flex items-center gap-1">
          <IndianRupee className="w-4 h-4" />
          {totalCost.toLocaleString()}
        </div>

        <button
          disabled={loading || requested}
          onClick={onClick}
          className={`px-4 py-1.5 text-xs rounded text-white
            ${requested
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-900"}`}
        >
          {requested ? "Requested" : btnText}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-14">

      {/* ✅ REQUEST INFO */}
      {requested && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl flex items-center gap-3">
          <Clock className="w-5 h-5" />
          <p className="text-sm font-medium">
            Booking request sent. Waiting for dealer approval.
          </p>
        </div>
      )}

      {/* ================= FULL TRUCK ================= */}
      {fullOptions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Full Truck Options
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fullOptions.map((opt, idx) => (
              <JobStyleCard
                key={opt.truckId}
                best={idx === 0}
                title={`Truck ${opt.truckNumber}`}
                badge="Full Load"
                rate={opt.costPerKm}
                distanceKm={opt.distanceKm}
                totalCost={opt.estimatedCost}
                btnText="Book Full Truck"
                onClick={() => book("FULL_TRUCK", opt.truckId)}
              >
                <p className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Utilization: <b>{opt.utilization}%</b>
                </p>

                <p className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  CO₂ Efficient
                </p>
              </JobStyleCard>
            ))}
          </div>
        </section>
      )}

      {/* ================= POOLING ================= */}
      {pooledOptions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-6">
            ♻️ Pooling Options
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pooledOptions.map((opt, idx) => (
              <JobStyleCard
                key={opt.bookingId}
                best={idx === 0}
                title={`Truck ${opt.truckNumber}`}
                badge="Pooling"
                rate={opt.costPerKm}
                distanceKm={opt.distanceKm}
                totalCost={opt.estimatedCost}
                btnText="Join Pool"
                onClick={() => book("POOLING", opt.bookingId)}
              >
                <p className="flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  After Pooling: <b>{opt.utilizationAfterPooling}%</b>
                </p>
              </JobStyleCard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default OptimizeCard;
