import { useState } from "react";
import { useAuth } from "../../../stateManagement/contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const AgencyBuses = () => {
  const { user } = useAuth();
  const [buses, setBuses] = useState([
    {
      id: 1,
      name: "Bus 1",
      plateNumber: "ABC123",
      capacity: 45,
      type: "Standard",
      status: "Active",
    },
    {
      id: 2,
      name: "Bus 2",
      plateNumber: "XYZ789",
      capacity: 30,
      type: "Luxury",
      status: "Maintenance",
    },
  ]);

  const [isAddingBus, setIsAddingBus] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    plateNumber: "",
    capacity: "",
    type: "Standard",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement bus addition
    setIsAddingBus(false);
  };

  const handleDelete = async (busId) => {
    // TODO: Implement bus deletion
  };

  const handleStatusChange = async (busId, newStatus) => {
    // TODO: Implement status change
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buses Management</h1>
        <Button onClick={() => setIsAddingBus(true)}>Add New Bus</Button>
      </div>

      {/* Add Bus Form */}
      {isAddingBus && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Bus
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingBus(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Bus</Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  {bus.capacity}
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
                    onClick={() =>
                      handleStatusChange(
                        bus.id,
                        bus.status === "Active" ? "Maintenance" : "Active"
                      )
                    }
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    {bus.status === "Active" ? "Set Maintenance" : "Set Active"}
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
    </div>
  );
};

export default AgencyBuses;
