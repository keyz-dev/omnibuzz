import { useAuth } from "../../stateManagement/contexts/AuthContext";

const PassengerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome, {user?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Search Buses
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              View Bookings
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Bookings
          </h2>
          <div className="space-y-4">
            <p className="text-secondary">No recent bookings</p>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Trips
          </h2>
          <div className="space-y-4">
            <p className="text-secondary">No upcoming trips</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
