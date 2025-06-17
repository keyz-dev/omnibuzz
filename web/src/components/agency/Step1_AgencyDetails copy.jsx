import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import {
  TownSelectorModal,
  Input,
  ContactModal,
  TextArea,
  Tag,
  FileUploader,
  Button,
} from "../ui";

const Step1_AgencyDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    headAddress: "",
    description: "",
  });

  const [occupancyTowns, setOccupancyTowns] = useState([]);
  const [contactFields, setContactFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [errors, setErrors] = useState({
    name: "",
    headAddress: "",
    description: "",
    occupancyTowns: "",
    contactFields: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const addTown = (town) => {
    if (town && !occupancyTowns.includes(town)) {
      setOccupancyTowns((prev) => [...prev, town]);
    }
  };

  const removeTown = (townToRemove) => {
    setOccupancyTowns((prev) => prev.filter((town) => town !== townToRemove));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      headAddress: "",
      description: "",
      occupancyTowns: "",
      contactFields: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Agency legal name is required";
      isValid = false;
    }

    if (!formData.headAddress.trim()) {
      newErrors.headAddress = "Headquarters address is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Agency description is required";
      isValid = false;
    }

    if (occupancyTowns.length === 0) {
      newErrors.occupancyTowns = "Please select at least one occupancy town";
      isValid = false;
    }

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

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("headAddress", formData.headAddress);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("towns", JSON.stringify(occupancyTowns));
    formDataToSubmit.append("contactInfo", JSON.stringify(contactInfo));
    if (logo) {
      formDataToSubmit.append("logo", logo);
    }

    console.log("Form Data:", Object.fromEntries(formDataToSubmit));
  };

  return (
    <>
      <div className="w-lg mx-auto">
        <form
          className="py-4"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Agency For Free
            </h1>
            <p className="text-gray-600">Tell us about your bus agency</p>
          </div>

          {/* Logo section */}
          <div className="w-[30%] mb-4">
            <FileUploader
              preview={logoPreview}
              text="logo"
              onChange={(file) => {
                setLogo(file);
                setLogoPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          <div className="space-y-6">
            {/* Agency Legal Name */}
            <Input
              label="Agency Legal Name"
              name="name"
              error={errors.name}
              value={formData.name}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your agency's legal name"
            />

            {/* Head Quarter Address */}
            <Input
              label="Head Quarter Address"
              name="headAddress"
              error={errors.headAddress}
              value={formData.headAddress}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your headquarters address"
            />

            {/* Occupancy Towns */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Occupancy Towns [separate with commas (,)]{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="w-full flex gap-2 justify-between items-center">
                <div className="flex flex-1 flex-wrap min-h-[40px] p-2 border border-line_clr rounded-xs gap-2 items-center">
                  {occupancyTowns.length > 0 ? (
                    occupancyTowns.map((town, index) => (
                      <Tag key={index} onRemove={() => removeTown(town)}>
                        {town}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm py-1">
                      No towns selected
                    </span>
                  )}
                </div>

                <Button
                  type="button"
                  additionalClasses="border border-accent min-h-[40px] min-w-[40px] rounded-full h-[42px] w-[42px]"
                  onClickHandler={() => setIsTownModalOpen(true)}
                  leadingIcon={"fas fa-plus text-accent text-xl"}
                />
              </div>
            </div>

            {/* Dynamic Contact Fields */}
            {contactFields.map((field, index) => (
              <div key={field.id} className="relative">
                <Input
                  label={field.label}
                  name={`contact-${field.id}`}
                  type={field.type}
                  value={field.value}
                  error={errors.contactFields[index]?.value}
                  onChangeHandler={(e) =>
                    handleContactFieldChange(index, e.target.value)
                  }
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
                <button
                  type="button"
                  onClick={() => removeContactField(index)}
                  className="absolute top-8 right-3 text-gray-400 hover:text-red-500 transition-colors"
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

            {/* Description Fields */}
            <div className="flex flex-col gap-4 flex-1">
              <TextArea
                label="Agency Description"
                name="description"
                value={formData.description}
                error={errors.description}
                placeholder="Enter agency description"
                onChangeHandler={handleInputChange}
                required
              />
            </div>

            <Button
              type="submit"
              id="continue-btn"
              additionalClasses="w-full mt-8 primarybtn"
              onClickHandler={handleSubmit}
              disabled={occupancyTowns.length === 0}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>

      {/* Town Selector Modal */}
      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onAdd={addTown}
        selectedTowns={occupancyTowns}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addContactField}
      />
    </>
  );
};

export default Step1_AgencyDetails;
