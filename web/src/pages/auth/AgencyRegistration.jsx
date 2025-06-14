import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AgencyRegistration = () => {
  const [formData, setFormData] = useState({
    agencyName: '',
    businessEmail: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    taxId: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic here
    console.log('Agency registration form submitted:', formData);
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Register Your Agency</h1>
        <p className="mt-2 text-gray-600">
          Start managing your bus transportation business with Omnibuzz
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Agency Information</h2>
          
          <Input
            label="Agency Name"
            name="agencyName"
            value={formData.agencyName}
            onChange={handleChange}
            error={errors.agencyName}
            placeholder="Enter your agency name"
            required
          />

          <Input
            label="Business Email"
            type="email"
            name="businessEmail"
            value={formData.businessEmail}
            onChange={handleChange}
            error={errors.businessEmail}
            placeholder="Enter your business email"
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            placeholder="Enter your phone number"
            required
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="Enter your business address"
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              placeholder="City"
              required
            />
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              placeholder="State"
              required
            />
            <Input
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              error={errors.zipCode}
              placeholder="ZIP"
              required
            />
          </div>

          <Input
            label="Tax ID / Business Registration Number"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            error={errors.taxId}
            placeholder="Enter your tax ID or business registration number"
            required
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Owner Information</h2>
          
          <Input
            label="Owner Name"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            error={errors.ownerName}
            placeholder="Enter owner's full name"
            required
          />

          <Input
            label="Owner Email"
            type="email"
            name="ownerEmail"
            value={formData.ownerEmail}
            onChange={handleChange}
            error={errors.ownerEmail}
            placeholder="Enter owner's email"
            required
          />

          <Input
            label="Owner Phone"
            type="tel"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleChange}
            error={errors.ownerPhone}
            placeholder="Enter owner's phone number"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I confirm that all the information provided is accurate and I agree to the{' '}
            <RouterLink to="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </RouterLink>
          </label>
        </div>

        <Button type="submit" className="w-full">
          Register Agency
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <RouterLink to="/login" className="text-blue-600 hover:text-blue-500">
            Sign in here
          </RouterLink>
        </p>
      </form>
    </div>
  );
};

export default AgencyRegistration; 