import React, { useState } from "react";
import ContactModal from "./ContactModal";
import { validateContactForm } from "../../utils/validateContactForm";
import { Input, StepNavButtons, FormHeader } from "./index";
import { X, Plus } from "lucide-react";

const ContactInfo = ({
  contactFields,
  setContactFields,
  onSubmit,
  onBack,
  title,
  description,
  contactTypes,
  isLoading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    contactFields: "",
  });

  const handleContactFieldChange = (index, value) => {
    setContactFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, value } : field))
    );
  };

  const handleAddContactField = (contactType) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateContactForm(contactFields, setErrors)) return;
    onSubmit();
  };

  return (
    <>
      <form className="py-4" onSubmit={handleSubmit}>
        {/* Header */}
        <FormHeader title={title} description={description} />

        <div className="space-y-6">
          {/* Dynamic Contact Fields */}
          {contactFields.map((field, index) => (
            <div key={index} className="relative">
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
            onBack={onBack}
            onContinue={handleSubmit}
            canContinue={!!contactFields.length}
            isLoading={isLoading}
          />
        </div>
      </form>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddContactField}
        contactTypes={contactTypes}
      />
    </>
  );
};

export default ContactInfo;
