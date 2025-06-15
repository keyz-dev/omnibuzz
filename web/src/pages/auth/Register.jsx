import { useState, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../stateManagement/contexts/AuthContext";
import { Input, Button } from "../../components/ui";
import { UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    loading,
    user,
    handleGoogleLogin,
    authError,
    setAuthError,
  } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    if (formData.password && formData.password.length < 5)
      newErrors.password = "Password must be at least 5 characters long";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    const phone = formData.phone.replace(/\s+/g, ""); // Remove spaces
    if (!phone) {
      newErrors.phone = "Phone Number is required";
    } else if (
      !(
        phone.startsWith("6") ||
        phone.startsWith("+2376") ||
        phone.startsWith("2376")
      )
    ) {
      newErrors.phone = "Phone number must start with 6, 2376, or +2376";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrors({});
    try {
      const registrationData = { ...formData };
      delete registrationData.confirmPassword;

      // Normalize phone number
      let phone = registrationData.phone.replace(/\s+/g, ""); // Remove spaces
      if (phone.startsWith("6")) {
        phone = `+237${phone}`;
      } else if (phone.startsWith("2376")) {
        phone = `+${phone}`;
      } else if (phone.startsWith("+237 6")) {
        phone = phone.replace("+237 ", "+237");
      }
      registrationData.phone = phone;
      await register({ ...registrationData, avatar });
    } catch (error) {
      setAuthError(
        error.response?.data?.message || "An error occurred during registration"
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
          {/* <Logo />
          <span className="text-primary font-bold text-lg mt-2 mb-1">OmniBuzz</span> */}
          <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
            Create Your Account
          </h1>
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
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            placeholder="Enter your full name"
            error={errors.fullName}
            onChangeHandler={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            error={errors.email}
            onChangeHandler={handleChange}
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            placeholder="+2376XXXXXXXXX"
            error={errors.phone}
            onChangeHandler={handleChange}
            required
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row mt-4 gap-4">
          {/* Avatar Upload */}
          <div
            className="flex min-w-[35%] min-h[160px] flex-col items-center justify-center border-2 border-dashed border-pending-bg rounded-xs min-h-[140px] cursor-pointer bg-blue-50/30 relative overflow-hidden"
            onClick={() => fileInputRef.current.click()}
            onDrop={handleAvatarDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="flex flex-col items-center justify-center text-accent">
                  <UploadCloud className="w-8 h-8 mb-1" />
                  <span className="text-xs text-secondary">
                    Drop or{" "}
                    <span className="text-accent underline">Upload</span>
                  </span>
                  <span className="text-xs text-secondary">
                    profile picture
                  </span>
                </div>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          {/* Password Fields */}
          <div className="flex flex-col gap-4 flex-1">
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
        </div>

        <Button
          type="submit"
          id="register-btn"
          additionalClasses="w-full mt-6 primarybtn"
          isLoading={loading}
        >
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <RouterLink to="/login" className="text-accent hover:underline">
            Login here
          </RouterLink>
        </p>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-2 text-gray-400 text-sm">Or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <Button
          type="button"
          onClickHandler={handleGoogleLogin}
          isLoading={loading}
          id="google-signIn"
          additionalClasses="w-full flex items-center justify-center border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </Button>
      </form>
    </div>
  );
};

export default Register;
