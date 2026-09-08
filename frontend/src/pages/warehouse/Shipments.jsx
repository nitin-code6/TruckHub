import { useEffect, useRef, useState } from "react";
import axios from "../../utils/axios";
import ShipmentCard from "../../component/warehouse/ShipmentCard";
import Modal from "../../component/common/Modal";
import AddShipmentForm from "../../component/warehouse/AddShipmentForm";
import ShipmentDetailModal from "../../component/warehouse/ShipmentDetailModal";
import gsap from "gsap";

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [openAddShipment, setOpenAddShipment] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [viewingShipmentId, setViewingShipmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const pageRef = useRef(null);
  const gridRef = useRef(null);

  const fetchShipments = async () => {
    try {
      const res = await axios.get("/shipments/my-shipments");
      setShipments(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  /* ================= PAGE FADE ================= */
  useEffect(() => {
    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    );
  }, []);

  /* ================= STAGGER CARDS ================= */
  useEffect(() => {
    if (!loading && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out"
        }
      );
    }
  }, [loading, shipments]);

  const filteredShipments = shipments.filter((s) =>
    s._id.toLowerCase().includes(search.toLowerCase()) ||
    s.destination.toLowerCase().includes(search.toLowerCase()) ||
    s.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={pageRef} className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipments</h1>
          <p className="text-sm text-gray-500">Manage shipments</p>
        </div>

        <button
          onClick={() => {
            setEditingShipment(null);
            setOpenAddShipment(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          + Add Shipment
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded-lg w-full md:w-96"
      />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div ref={gridRef} className="grid md:grid-cols-3 gap-6">
          {filteredShipments.map((shipment) => (
            <ShipmentCard
              key={shipment._id}
              shipment={shipment}
              onDeleted={(id) =>
                setShipments((prev) => prev.filter((s) => s._id !== id))
              }
              onEdit={(s) => {
                setEditingShipment(s);
                setOpenAddShipment(true);
              }}
              onView={(s) => setViewingShipmentId(s._id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={openAddShipment} onClose={() => setOpenAddShipment(false)}>
        <AddShipmentForm
          initialData={editingShipment}
          onClose={() => {
            setOpenAddShipment(false);
            setEditingShipment(null);
          }}
          onCreated={fetchShipments}
        />
      </Modal>

      <Modal isOpen={!!viewingShipmentId} onClose={() => setViewingShipmentId(null)}>
        {viewingShipmentId && (
          <ShipmentDetailModal
            shipmentId={viewingShipmentId}
            onClose={() => setViewingShipmentId(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ShipmentsPage;
