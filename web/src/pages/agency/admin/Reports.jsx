import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const AgencyReports = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [reportType, setReportType] = useState("bookings");
  const [reportData, setReportData] = useState({
    totalBookings: 150,
    totalRevenue: 7500.0,
    averageBookingValue: 50.0,
    topRoutes: [
      { route: "New York - Boston", bookings: 45, revenue: 2025.0 },
      { route: "Boston - Philadelphia", bookings: 35, revenue: 1925.0 },
    ],
    bookingsByStatus: [
      { status: "Confirmed", count: 120 },
      { status: "Pending", count: 20 },
      { status: "Cancelled", count: 10 },
    ],
  });

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleGenerateReport = async () => {
    // TODO: Implement report generation
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      {/* Report Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Generate Report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
            />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={handleReportTypeChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="bookings">Bookings Report</option>
                <option value="revenue">Revenue Report</option>
                <option value="routes">Routes Report</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleGenerateReport}>Generate Report</Button>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Bookings
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {reportData.totalBookings}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-green-600">
            ${reportData.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Average Booking Value
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            ${reportData.averageBookingValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Top Routes */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Routes
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.topRoutes.map((route, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {route.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${route.revenue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bookings by Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Bookings by Status
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.bookingsByStatus.map((status, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {status.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {status.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(
                        (status.count / reportData.totalBookings) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyReports;
