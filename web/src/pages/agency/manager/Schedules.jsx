import { useState } from "react";
import { useAuth } from "../../../stateManagement/contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const Schedules = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      route: "New York - Boston",
      bus: "Bus 001",
      departureTime: "09:00",
      arrivalTime: "13:30",
      frequency: "Daily",
      status: "Active",
    },
    {
      id: 2,
      route: "Boston - Philadelphia",
      bus: "Bus 002",
      departureTime: "10:30",
      arrivalTime: "16:45",
      frequency: "Daily",
      status: "Active",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    route: "",
    bus: "",
    departureTime: "",
    arrivalTime: "",
    frequency: "Daily",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setSelectedSchedule(schedule);
      setFormData({
        route: schedule.route,
        bus: schedule.bus,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        frequency: schedule.frequency,
      });
    } else {
      setSelectedSchedule(null);
      setFormData({
        route: "",
        bus: "",
        departureTime: "",
        arrivalTime: "",
        frequency: "Daily",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
    setFormData({
      route: "",
      bus: "",
      departureTime: "",
      arrivalTime: "",
      frequency: "Daily",
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
      // TODO: Implement schedule creation/update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedSchedule) {
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === selectedSchedule.id
              ? {
                  ...schedule,
                  ...formData,
                }
              : schedule
          )
        );
      } else {
        const newSchedule = {
          id: schedules.length + 1,
          ...formData,
          status: "Active",
        };
        setSchedules((prev) => [...prev, newSchedule]);
      }

      handleCloseModal();
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to save schedule",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?"))
      return;

    try {
      // TODO: Implement schedule deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSchedules((prev) =>
        prev.filter((schedule) => schedule.id !== scheduleId)
      );
    } catch (error) {
      alert(error.message || "Failed to delete schedule");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Schedule Management
        </h1>
        <Button onClick={() => handleOpenModal()}>Add New Schedule</Button>
      </div>

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
                Departure Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival Time
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
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {schedule.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(schedule)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
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

      {/* Add/Edit Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedSchedule ? "Edit Schedule" : "Add New Schedule"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
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
                    <option value="Bus 001">Bus 001</option>
                    <option value="Bus 002">Bus 002</option>
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
                  {selectedSchedule ? "Update Schedule" : "Add Schedule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
