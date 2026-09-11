import { useEffect, useState, useCallback } from "react";
import axios from "../../utils/axios";
import BookingCard from "../../component/dealer/BookingCard";
import { Search } from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/bookings");
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* ================= SEARCH FILTER ================= */
  const filteredBookings = bookings.filter((b) => {
    const bookingId = b._id.toLowerCase();
    const truckNo = b.truckId?.truckNumber?.toLowerCase() || "";
    const warehouseName =
      b.shipments?.[0]?.warehouseId?.name?.toLowerCase() || "";

    return (
      bookingId.includes(search.toLowerCase()) ||
      truckNo.includes(search.toLowerCase()) ||
      warehouseName.includes(search.toLowerCase())
    );
  });

  /* ================= SECTIONS ================= */
  const openBookings = filteredBookings.filter(
    (b) => b.status === "OPEN"
  );

  const historyBookings = filteredBookings.filter(
    (b) => b.status !== "OPEN"
  );

  if (loading) {
    return (
      <p className="text-gray-500 text-lg">
        Loading bookings...
      </p>
    );
  }

  return (
    <div className="space-y-10 pt-20">

      {/* ================= HEADER + SEARCH ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Dealer Bookings
        </h1>

        {/* SEARCH BAR */} 
        <div className="relative w-full md:w-96 pt-15">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search booking ID, truck, warehouse"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-9 pr-4 py-2.5
              text-[15px]
              border border-gray-300 rounded-lg
              focus:outline-none
              focus:ring-2 focus:ring-[#3f89f9]
            "
          />
        </div>
      </div>

      {/* ================= OPEN BOOKINGS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Incoming Requests
        </h2>

        {openBookings.length === 0 ? (
          <p className="text-gray-500 text-base">
            No new booking requests
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {openBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                refresh={fetchBookings}
              />
            ))}
          </div>
        )}
      </section>

      {/* ================= HISTORY ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Booking History
        </h2>

        {historyBookings.length === 0 ? (
          <p className="text-gray-500 text-base">
            No previous bookings
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Bookings;
