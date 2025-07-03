import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    // Only validate password fields if any of them are filled
    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // TODO: Implement profile update
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });
      // Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Profile Settings
      </h1>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Change Password
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
              />
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
