import { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Settings = () => {
  const [formData, setFormData] = useState({
    siteName: 'OmniBuzz',
    siteDescription: 'Bus Booking System',
    contactEmail: 'support@omnibuzz.com',
    contactPhone: '+1 234-567-8900',
    bookingFee: '5',
    cancellationFee: '10',
    maxSeatsPerBooking: '4',
    maintenanceMode: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // TODO: Implement settings update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({
        type: 'success',
        text: 'Settings updated successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update settings',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h1>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* General Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Site Name"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  error={errors.siteName}
                />
                <Input
                  label="Site Description"
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleChange}
                  error={errors.siteDescription}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  error={errors.contactEmail}
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  error={errors.contactPhone}
                />
              </div>
            </div>

            {/* Booking Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Booking Fee (%)"
                  type="number"
                  name="bookingFee"
                  value={formData.bookingFee}
                  onChange={handleChange}
                  error={errors.bookingFee}
                />
                <Input
                  label="Cancellation Fee (%)"
                  type="number"
                  name="cancellationFee"
                  value={formData.cancellationFee}
                  onChange={handleChange}
                  error={errors.cancellationFee}
                />
                <Input
                  label="Max Seats Per Booking"
                  type="number"
                  name="maxSeatsPerBooking"
                  value={formData.maxSeatsPerBooking}
                  onChange={handleChange}
                  error={errors.maxSeatsPerBooking}
                />
              </div>
            </div>

            {/* System Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">System Settings</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                  Maintenance Mode
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                When enabled, only administrators can access the system.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 