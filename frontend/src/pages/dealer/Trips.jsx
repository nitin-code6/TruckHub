import { useEffect, useState } from "react";
import TripCard from "../../component/dealer/TripCard";
import axios from "../../utils/axios";

const Trips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/bookings");

      const activeTrips = res.data.data.filter(
        (b) => b.status === "OPEN" || b.status === "IN_TRANSIT"
      );

      setBookings(activeTrips);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-lg">Loading trips...</p>;
  }

  return (
    <div className="space-y-8 pt-20">

      <h1 className="text-3xl font-bold text-black">
        Active Trips
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-base">
          No active trips
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <TripCard
              key={booking._id}
              booking={booking}
              onUpdate={fetchTrips}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;
