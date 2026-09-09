import { useEffect, useRef, useState } from "react";
import axios from "../../utils/axios";
import BookingCard from "../../component/warehouse/BookingCard";
import Modal from "../../component/common/Modal";
import BookingDetailModal from "../../component/warehouse/BookingDetailModal";
import gsap from "gsap";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [viewBooking, setViewBooking] = useState(null);

  const pageRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    );
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/bookings");
        setBookings(res.data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!loading && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.45,
          ease: "power2.out"
        }
      );
    }
  }, [loading, bookings]);

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b._id.toLowerCase().includes(search.toLowerCase()) ||
      b.truckId?.truckNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.dealerId?.name?.toLowerCase().includes(search.toLowerCase());

    const matchType = type === "ALL" || b.bookingType === type;
    return matchSearch && matchType;
  });

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div ref={pageRef} className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {/* FILTERS */}
      <div className="flex gap-4">
        <input
          placeholder="Search booking, dealer, truck"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="ALL">All</option>
          <option value="FULL_TRUCK">Full Truck</option>
          <option value="POOLING">Pooled</option>
        </select>
      </div>

      {/* GRID */}
      <div
        ref={gridRef}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onView={(b) => setViewBooking(b)}
          />
        ))}
      </div>

      {/* MODAL */}
      <Modal isOpen={!!viewBooking} onClose={() => setViewBooking(null)} blur>
        {viewBooking && (
          <BookingDetailModal
            booking={viewBooking}
            onClose={() => setViewBooking(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Bookings;
