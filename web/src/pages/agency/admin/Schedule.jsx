import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const AgencySchedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      route: "New York - Boston",
      bus: "Bus 1",
      departureTime: "09:00 AM",
      arrivalTime: "01:30 PM",
      frequency: "Daily",
      status: "Active",
    },
    {
      id: 2,
      route: "Boston - Philadelphia",
      bus: "Bus 2",
      departureTime: "10:30 AM",
      arrivalTime: "04:45 PM",
      frequency: "Daily",
      status: "Active",
    },
  ]);

  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [formData, setFormData] = useState({
    route: "",
    bus: "",
    departureTime: "",
    arrivalTime: "",
    frequency: "Daily",
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
    // TODO: Implement schedule addition
    setIsAddingSchedule(false);
  };

  const handleDelete = async (scheduleId) => {
    // TODO: Implement schedule deletion
  };

  const handleStatusChange = async (scheduleId, newStatus) => {
    // TODO: Implement status change
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Schedule Management
        </h1>
        <Button onClick={() => setIsAddingSchedule(true)}>
          Add New Schedule
        </Button>
      </div>

      {/* Add Schedule Form */}
      {isAddingSchedule && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Schedule
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route
                  </label>
                  <select
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Route</option>
                    <option value="New York - Boston">New York - Boston</option>
                    <option value="Boston - Philadelphia">
                      Boston - Philadelphia
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bus
                  </label>
                  <select
                    name="bus"
                    value={formData.bus}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Bus</option>
                    <option value="Bus 1">Bus 1</option>
                    <option value="Bus 2">Bus 2</option>
                  </select>
                </div>
                <Input
                  label="Departure Time"
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  error={errors.departureTime}
                />
                <Input
                  label="Arrival Time"
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  error={errors.arrivalTime}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingSchedule(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Schedule</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bus
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
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
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {schedule.route}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.bus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.departureTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.arrivalTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {schedule.frequency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      schedule.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {schedule.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() =>
                      handleStatusChange(
                        schedule.id,
                        schedule.status === "Active" ? "Inactive" : "Active"
                      )
                    }
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    {schedule.status === "Active"
                      ? "Set Inactive"
                      : "Set Active"}
                  </button>
                  <button
                    onClick={() => handleDelete(schedule.id)}
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

export default AgencySchedule;
