import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const Reports = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [reportType, setReportType] = useState("bookings");
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement report generation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      setReportData({
        bookings: {
          total: 150,
          completed: 120,
          cancelled: 30,
          revenue: 7500,
          byRoute: [
            { route: "New York - Boston", count: 80, revenue: 4000 },
            { route: "Boston - Philadelphia", count: 70, revenue: 3500 },
          ],
        },
        revenue: {
          total: 7500,
          byMonth: [
            { month: "January", amount: 2500 },
            { month: "February", amount: 3000 },
            { month: "March", amount: 2000 },
          ],
        },
        occupancy: {
          average: 75,
          byRoute: [
            { route: "New York - Boston", rate: 80 },
            { route: "Boston - Philadelphia", rate: 70 },
          ],
        },
      });
    } catch (error) {
      alert(error.message || "Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    switch (reportType) {
      case "bookings":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Bookings
                </h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {reportData.bookings.total}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="mt-1 text-2xl font-semibold text-green-600">
                  {reportData.bookings.completed}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
                <p className="mt-1 text-2xl font-semibold text-red-600">
                  {reportData.bookings.cancelled}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Revenue
                </h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ${reportData.bookings.revenue}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Bookings by Route
                </h3>
              </div>
              <div className="p-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
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
                  <tbody className="divide-y divide-gray-200">
                    {reportData.bookings.byRoute.map((item) => (
                      <tr key={item.route}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.route}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.revenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "revenue":
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Revenue
              </h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ${reportData.revenue.total}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Revenue by Month
                </h3>
              </div>
              <div className="p-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.revenue.byMonth.map((item) => (
                      <tr key={item.month}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "occupancy":
        return (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Average Occupancy Rate
              </h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {reportData.occupancy.average}%
              </p>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Occupancy by Route
                </h3>
              </div>
              <div className="p-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Occupancy Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.occupancy.byRoute.map((item) => (
                      <tr key={item.route}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.route}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.rate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <option value="occupancy">Occupancy Report</option>
            </select>
          </div>
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
          />
          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="mt-6">
          <Button onClick={generateReport} isLoading={isLoading}>
            Generate Report
          </Button>
        </div>
      </div>

      {reportData && renderReportContent()}
    </div>
  );
};

export default Reports;
