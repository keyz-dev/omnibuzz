import { useState } from "react";
import { useAuth } from "../../stateManagement/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAgencies: 25,
    totalUsers: 1500,
    totalBookings: 5000,
    totalRevenue: 250000,
  });

  const [recentAgencies, setRecentAgencies] = useState([
    {
      id: 1,
      name: "City Bus Services",
      location: "New York",
      status: "Active",
      joinedDate: "2024-03-15",
    },
    {
      id: 2,
      name: "Metro Transit",
      location: "Boston",
      status: "Active",
      joinedDate: "2024-03-14",
    },
    {
      id: 3,
      name: "Express Travel",
      location: "Philadelphia",
      status: "Pending",
      joinedDate: "2024-03-13",
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.firstName}!
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Agencies</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalAgencies}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalBookings}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            ${stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Recent Agencies */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Agencies</h2>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentAgencies.map((agency) => (
                <tr key={agency.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {agency.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agency.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        agency.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {agency.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agency.joinedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
