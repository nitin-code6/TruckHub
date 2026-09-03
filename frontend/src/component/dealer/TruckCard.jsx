
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TruckDetailsModal from "./TruckDetailsModal";

const statusStyles = {
  AVAILABLE: "bg-green-100 text-green-700",
  BOOKED: "bg-yellow-100 text-yellow-700",
  EN_ROUTE: "bg-blue-100 text-blue-700"
};

const TruckCard = ({ truck, index, refresh }) => {
  const cardRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: index * 0.06,
        ease: "power3.out"
      }
    );
  }, [index]);

  return (
    <>
      <div
        ref={cardRef}
        onClick={() => setOpen(true)}
        className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:shadow-md transition"
      >
        <div>
          <p className="text-xs text-gray-400">Truck No</p>
          <p className="font-semibold">{truck.truckNumber}</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400">Trips</p>
          <p className="font-medium">{truck.totalTrips ?? 0}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[truck.status]}`}
        >
          {truck.status}
        </span>
      </div>

      {open && (
        <TruckDetailsModal
          truck={truck}
          onClose={() => setOpen(false)}
          onDelete={() => {
            setOpen(false);
            refresh && refresh();
          }}
          onUpdated={() => {
            refresh && refresh();
          }}
        />
      )}
    </>
  );
};

export default TruckCard;
