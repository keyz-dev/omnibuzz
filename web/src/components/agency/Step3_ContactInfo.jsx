import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { Input, ContactModal } from "../ui";
import { useAgencyCreation } from "../../stateManagement/contexts";
import { StepNavButtons } from "./index";

const Step3_ContactInfo = () => {
  const { nextStep, agencyCreationData, updateFormData, prevStep } =
    useAgencyCreation();

  const [contactFields, setContactFields] = useState(
    agencyCreationData?.contactInfo || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    contactFields: "",
  });

  const handleContactFieldChange = (index, value) => {
    setContactFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const addContactField = (contactType) => {
    setContactFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: contactType.label,
        type: contactType.type,
        value: "",
      },
    ]);
  };

  const removeContactField = (index) => {
    setContactFields((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {
      contactFields: "",
    };

    let isValid = true;

    if (contactFields.length === 0) {
      newErrors.contactFields = "Please add at least one contact information";
      isValid = false;
    }

    // Validate each contact field
    const contactErrors = contactFields.map((field) => {
      const error = { value: "" };

      if (!field.value.trim()) {
        error.value = `${field.label} is required`;
        isValid = false;
        return error;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s-]{10,}$/;

      switch (field.type) {
        case "email":
          if (!emailRegex.test(field.value)) {
            error.value = "Please enter a valid email address";
            isValid = false;
          }
          break;

        case "tel":
          if (!phoneRegex.test(field.value)) {
            error.value = "Please enter a valid phone number";
            isValid = false;
          }
          break;

        case "url":
          try {
            new URL(field.value);
          } catch {
            error.value = "Please enter a valid URL";
            isValid = false;
          }
          break;
      }

      return error;
    });

    setErrors({
      ...newErrors,
      contactFields: contactErrors,
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const contactInfo = contactFields.map(({ label: type, value }) => ({
      type,
      value,
    }));

    const formDataToSubmit = {
      contactInfo: contactInfo,
    };

    updateFormData(formDataToSubmit);
    nextStep();
  };

  return (
    <div className="w-lg mx-auto">
      <form className="py-4" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contact Information
          </h1>
          <p className="text-secondary">How can people reach your agency?</p>
        </div>

        <div className="space-y-6">
          {/* Dynamic Contact Fields */}
          {contactFields.map((field, index) => (
            <div key={field.id} className="relative">
              <Input
                key={index}
                label={field.label}
                name={`contact-${field.id}`}
                type={field.type}
                value={field.value}
                error={errors.contactFields[index]?.value}
                onChangeHandler={(e) =>
                  handleContactFieldChange(index, e.target.value)
                }
                placeholder={`Enter your ${
                  field?.label?.toLowerCase() || "contact information"
                }`}
              />
              <button
                type="button"
                onClick={() => removeContactField(index)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {/* Add Contact Information Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors mb-6"
          >
            <Plus size={16} className="mr-1" />
            Add Contact Information
          </button>

          <StepNavButtons
            onBack={() => prevStep()}
            onContinue={handleSubmit}
            canContinue={!!contactFields.length}
          />
        </div>
      </form>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addContactField}
      />
    </div>
  );
};

export default Step3_ContactInfo;
