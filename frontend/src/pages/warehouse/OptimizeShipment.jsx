import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import OptimizeCard from "../../component/warehouse/OptimizeCard";
import axios from "../../utils/axios";
import gsap from "gsap";

const OptimizeShipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const optimize = async () => {
      setLoading(true);

      const res = await axios.post(`/optimize/${id}`);
      setData(res.data.data);

      setLoading(false);

      gsap.fromTo(
        ".page-title",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
    };

    optimize();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        Optimizing using latest available trucks...
      </div>
    );
  }

  return (
    <div className="pb-20">
      <h1 className="page-title text-2xl font-bold mb-8">
        Optimization Results
      </h1>

      <OptimizeCard
        shipmentId={id}
        fullOptions={data.fullTruckOptions}
        pooledOptions={data.pooledTruckOptions}
        onBooked={() => navigate("/warehouse/bookings")}
      />
    </div>
  );
};

export default OptimizeShipment;
