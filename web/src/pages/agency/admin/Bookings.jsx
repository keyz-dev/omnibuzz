import { useState } from "react";
import { useAuth } from "../../../stateManagement/contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const AgencyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([
    {
      id: 1,
      bookingNumber: "BK001",
      passengerName: "John Doe",
      route: "New York - Boston",
      date: "2024-03-20",
      time: "09:00 AM",
      seats: 2,
      totalAmount: 90.0,
      status: "Confirmed",
    },
    {
      id: 2,
      bookingNumber: "BK002",
      passengerName: "Jane Smith",
      route: "Boston - Philadelphia",
      date: "2024-03-21",
      time: "10:30 AM",
      seats: 1,
      totalAmount: 55.0,
      status: "Pending",
    },
  ]);

  const [filters, setFilters] = useState({
    date: "",
    status: "",
    bookingNumber: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    // TODO: Implement status change
  };

  const handleCancel = async (bookingId) => {
    // TODO: Implement booking cancellation
  };

  const filteredBookings = bookings.filter((booking) => {
    return (
      (!filters.date || booking.date === filters.date) &&
      (!filters.status || booking.status === filters.status) &&
      (!filters.bookingNumber ||
        booking.bookingNumber.includes(filters.bookingNumber))
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bookings Management
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Date"
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <Input
              label="Booking Number"
              name="bookingNumber"
              value={filters.bookingNumber}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Passenger
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
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
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.bookingNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.passengerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.route}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.date} {booking.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.seats}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${booking.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {booking.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "Confirmed")
                        }
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "Cancelled")
                        }
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === "Confirmed" && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgencyBookings;
