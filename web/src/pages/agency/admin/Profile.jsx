import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const AgencyProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    agencyName: user?.agencyName || "",
    businessEmail: user?.businessEmail || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    taxId: user?.taxId || "",
    ownerName: user?.ownerName || "",
    ownerEmail: user?.ownerEmail || "",
    ownerPhone: user?.ownerPhone || "",
  });

  const [isEditing, setIsEditing] = useState(false);
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
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Agency Profile
        </h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Agency Information */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Agency Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Agency Name"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    error={errors.agencyName}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Business Email"
                    type="email"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    error={errors.businessEmail}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={errors.phoneNumber}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Tax ID"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    error={errors.taxId}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Address Information
                </h2>
                <div className="space-y-6">
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    disabled={!isEditing}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      disabled={!isEditing}
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      error={errors.state}
                      disabled={!isEditing}
                    />
                    <Input
                      label="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      error={errors.zipCode}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Owner Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Owner Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    error={errors.ownerName}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Owner Email"
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    error={errors.ownerEmail}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Owner Phone"
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    error={errors.ownerPhone}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyProfile;
