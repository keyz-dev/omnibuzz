export const validateRegisterForm = (formData, setErrors) => {
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
