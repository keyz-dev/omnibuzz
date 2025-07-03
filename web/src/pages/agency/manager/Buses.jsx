import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const Buses = () => {
  const { user } = useAuth();
  const [buses, setBuses] = useState([
    {
      id: 1,
      name: "Bus 001",
      plateNumber: "NY-1234",
      capacity: 45,
      type: "Standard",
      status: "Active",
    },
    {
      id: 2,
      name: "Bus 002",
      plateNumber: "NY-5678",
      capacity: 30,
      type: "Luxury",
      status: "Maintenance",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    plateNumber: "",
    capacity: "",
    type: "Standard",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = (bus = null) => {
    if (bus) {
      setSelectedBus(bus);
      setFormData({
        name: bus.name,
        plateNumber: bus.plateNumber,
        capacity: bus.capacity,
        type: bus.type,
      });
    } else {
      setSelectedBus(null);
      setFormData({
        name: "",
        plateNumber: "",
        capacity: "",
        type: "Standard",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBus(null);
    setFormData({
      name: "",
      plateNumber: "",
      capacity: "",
      type: "Standard",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement bus creation/update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedBus) {
        setBuses((prev) =>
          prev.map((bus) =>
            bus.id === selectedBus.id
              ? {
                  ...bus,
                  ...formData,
                  capacity: Number(formData.capacity),
                }
              : bus
          )
        );
      } else {
        const newBus = {
          id: buses.length + 1,
          ...formData,
          capacity: Number(formData.capacity),
          status: "Active",
        };
        setBuses((prev) => [...prev, newBus]);
      }

      handleCloseModal();
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to save bus",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (busId) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      // TODO: Implement bus deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBuses((prev) => prev.filter((bus) => bus.id !== busId));
    } catch (error) {
      alert(error.message || "Failed to delete bus");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buses Management</h1>
        <Button onClick={() => handleOpenModal()}>Add New Bus</Button>
      </div>

      {/* Buses List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bus Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plate Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {bus.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bus.plateNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bus.capacity} seats
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bus.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bus.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {bus.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(bus)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bus.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Bus Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedBus ? "Edit Bus" : "Add New Bus"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Bus Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Input
                  label="Plate Number"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  error={errors.plateNumber}
                />
                <Input
                  label="Capacity"
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  error={errors.capacity}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              {errors.submit && (
                <div className="mt-4 text-sm text-red-600">{errors.submit}</div>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {selectedBus ? "Update Bus" : "Add Bus"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buses;
