import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TruckCard from "../../component/dealer/TruckCard";
import axios from "../../utils/axios";
import Modal from "../../component/common/Modal";
import AddTruckForm from "../../component/dealer/AddTruckForm";

const Trucks = () => {
  const [trucks, setTrucks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openAddTruck, setOpenAddTruck] = useState(false);

  const fetchTrucks = async () => {
    const res = await axios.get("/trucks/my-trucks");
    setTrucks(res.data.data);
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  const filteredTrucks = trucks.filter(truck => {
    const matchSearch =
      truck.truckNumber.toLowerCase().includes(search.toLowerCase()) ||
      truck.currentLocation.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL" || truck.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">My Trucks</h1>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-2xl p-4 mb-8 flex justify-between">
        <div className="flex gap-4">
          <input
            placeholder="Search by Truck No or Location"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="ALL">All Types</option>
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="EN_ROUTE">En Route</option>
          </select>
        </div>

        <button
          onClick={() => setOpenAddTruck(true)}
          className="px-6 py-2 bg-[#3f89f9] text-white rounded-lg"
        >
          + Add Truck
        </button>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrucks.map((truck, index) => (
          <TruckCard
            key={truck._id}
            truck={truck}
            index={index}
            refresh={fetchTrucks}
          />
        ))}
      </div>
      <Modal isOpen={openAddTruck} onClose={() => setOpenAddTruck(false)}>
        <AddTruckForm
          onClose={() => setOpenAddTruck(false)}
          onCreated={() => {
            setOpenAddTruck(false);
            fetchTrucks();
          }}
        />
      </Modal>
    </>
  );
};

export default Trucks;
