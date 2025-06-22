import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input, Button, FileUploader } from "../../components/ui";
import { useAuth } from "../../stateManagement/contexts/AuthContext";
import { FormHeader, Logo } from "../../components/ui";

const AcceptInvitation = () => {
  const { acceptInvitation, authError, setAuthError, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const invitationToken = searchParams.get("token");
    if (!invitationToken) {
      setAuthError("Invalid invitation link");
      return;
    }
    setToken(invitationToken);
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.password) {
      errors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const { success, user } = await acceptInvitation({
        token,
        avatar,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      if (success) {
        navigate("/verify-account", { state: { email: user.email, origin: "accept-invitation" } });
      }
    } catch (error) {
      setAuthError(
        error.response?.data?.message ||
        "An error occurred during profile completion"
      );
    }
  };

  return (
    <div className="min-h-fit flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-2 md:p-8 max-w-lg w-full mx-auto flex flex-col"
        autoComplete="off"
        encType="multipart/form-data"
      >
        <div className="flex flex-col items-center">
          <FormHeader
            title={`Complete Your Profile`}
            description={`Complete your profile to activate your account`}
          />
        </div>
        {errors.submit && (
          <div className="rounded-xs bg-error-bg-light p-4 my-4">
            <p className="text-sm text-error text-center">{errors.submit}</p>
          </div>
        )}
        {authError && (
          <div className="rounded-xs bg-error-bg-light p-4 my-4">
            <p className="text-sm text-error text-center">{authError}</p>
          </div>
        )}
        <div className="space-y-4 mb-8">
          {/* Avatar Upload */}
          <div className="w-40">
            <FileUploader
              preview={avatarPreview}
              onChange={(file) => {
                setAvatar(file);
                setAvatarPreview(URL.createObjectURL(file));
              }}
            />
          </div>
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter password"
            error={errors.password}
            onChangeHandler={handleChange}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm password"
            error={errors.confirmPassword}
            onChangeHandler={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            id="register-btn"
            additionalClasses="mt-6 primarybtn"
            isLoading={loading}
          >
            Complete Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AcceptInvitation;
