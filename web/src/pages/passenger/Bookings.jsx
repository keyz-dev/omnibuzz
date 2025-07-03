import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const PassengerBookings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Mock data - replace with actual API call
  const bookings = {
    upcoming: [
      {
        id: 1,
        route: "Lagos to Abuja",
        date: "2024-03-20",
        time: "08:00 AM",
        status: "confirmed",
        seatNumber: "A12",
        busNumber: "BUS001",
      },
    ],
    past: [
      {
        id: 2,
        route: "Lagos to Port Harcourt",
        date: "2024-02-15",
        time: "10:00 AM",
        status: "completed",
        seatNumber: "B15",
        busNumber: "BUS002",
      },
    ],
  };

  const renderBookingCard = (booking) => (
    <div key={booking.id} className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.route}
          </h3>
          <p className="text-secondary">
            {booking.date} at {booking.time}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            booking.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {booking.status}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-secondary">Seat Number</p>
          <p className="font-medium">{booking.seatNumber}</p>
        </div>
        <div>
          <p className="text-sm text-secondary">Bus Number</p>
          <p className="font-medium">{booking.busNumber}</p>
        </div>
      </div>
      {booking.status === "confirmed" && (
        <div className="mt-4 flex justify-end space-x-4">
          <button className="text-blue-600 hover:text-blue-800">
            View Details
          </button>
          <button className="text-red-600 hover:text-red-800">
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`${
                activeTab === "upcoming"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming Trips
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`${
                activeTab === "past"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Past Trips
            </button>
          </nav>
        </div>
      </div>

      <div className="space-y-4">
        {bookings[activeTab].length > 0 ? (
          bookings[activeTab].map(renderBookingCard)
        ) : (
          <div className="text-center py-12">
            <p className="text-secondary">No {activeTab} bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerBookings;
