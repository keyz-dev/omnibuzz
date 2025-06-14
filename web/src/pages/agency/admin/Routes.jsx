import { useState } from "react";
import { useAuth } from "../../../stateManagement/contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const AgencyRoutes = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([
    {
      id: 1,
      from: "New York",
      to: "Boston",
      distance: 215,
      duration: "4h 30m",
      price: 45.0,
      status: "Active",
    },
    {
      id: 2,
      from: "Boston",
      to: "Philadelphia",
      distance: 310,
      duration: "6h 15m",
      price: 55.0,
      status: "Active",
    },
  ]);

  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    distance: "",
    duration: "",
    price: "",
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
    // TODO: Implement route addition
    setIsAddingRoute(false);
  };

  const handleDelete = async (routeId) => {
    // TODO: Implement route deletion
  };

  const handleStatusChange = async (routeId, newStatus) => {
    // TODO: Implement status change
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Routes Management</h1>
        <Button onClick={() => setIsAddingRoute(true)}>Add New Route</Button>
      </div>

      {/* Add Route Form */}
      {isAddingRoute && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Route
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="From"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  error={errors.from}
                />
                <Input
                  label="To"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  error={errors.to}
                />
                <Input
                  label="Distance (miles)"
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  error={errors.distance}
                />
                <Input
                  label="Duration (e.g., 4h 30m)"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  error={errors.duration}
                />
                <Input
                  label="Price ($)"
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingRoute(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Route</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
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
            {routes.map((route) => (
              <tr key={route.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {route.from}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.to}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.distance} miles
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${route.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      route.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {route.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        route.id,
                        route.status === "Active" ? "Inactive" : "Active"
                      )
                    }
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    {route.status === "Active" ? "Set Inactive" : "Set Active"}
                  </button>
                  <button
                    onClick={() => handleDelete(route.id)}
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

export default AgencyRoutes;
