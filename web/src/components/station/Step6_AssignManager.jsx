import React, { useState } from "react";
import { FormHeader, Input, StepNavButtons } from "../ui";
import { useNavigate } from "react-router-dom";
import { isValidCMNumber } from "../../utils/validateForm";
import { normalizeNumber } from "../../utils/normalizePhone";
import { useStation } from "../../stateManagement/contexts";
import { toast } from "react-toastify";

const Step6_AssignManager = () => {
  const { isLoading, assignManager } = useStation();
  const navigate = useNavigate();
  const [manager, setManager] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const validate = () => {
    const errors = {};
    if (!manager.fullName) errors.fullName = "Name is required";
    if (!manager.email) errors.email = "Email is required";
    // validate email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(manager.email)) errors.email = "Invalid email";
    if (!manager.phone) errors.phone = "Phone is required";
    if (!isValidCMNumber(manager.phone)) errors.phone = "Invalid phone number";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    manager.phone = normalizeNumber(manager.phone);
    const res = await assignManager(manager);
    if (res.success) {
      toast.success("The assignment request has been sent to the manager");
      setTimeout(() => {
        navigate("/agency/admin/profile-completion");
      }, 2000);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <section className="w-full md:w-lg px-4 py-10 min-h-screen md:min-h-fit mx-auto">
      <FormHeader
        title={"Assign Manager"}
        description={"Assign a manager to control this station here."}
      />

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <Input
          label="Full Name"
          name="name"
          type="text"
          placeholder="e.g John Doe"
          value={manager.fullName}
          onChangeHandler={(e) =>
            setManager({ ...manager, fullName: e.target.value })
          }
          error={errors.fullName}
          required
        />
        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="e.g john.doe@example.com"
          value={manager.email}
          onChangeHandler={(e) =>
            setManager({ ...manager, email: e.target.value })
          }
          error={errors.email}
          required
        />
        {/* Phone */}
        <Input
          label="Phone"
          name="phone"
          type="tel"
          placeholder="e.g +2376XXXXXXXX"
          value={manager.phone}
          onChangeHandler={(e) =>
            setManager({ ...manager, phone: e.target.value })
          }
          error={errors.phone}
          required={true}
        />

        <StepNavButtons
          onBack={() => navigate("/agency/admin")}
          onBackText="Later"
          onContinueText="Assign Manager"
          onContinue={handleSubmit}
          canContinue={() => validate()}
          isLoading={isLoading}
        />
      </form>
    </section>
  );
};

export default Step6_AssignManager;
