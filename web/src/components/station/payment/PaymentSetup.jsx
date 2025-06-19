import React, { useState } from "react";
import { PaymentMethodContainer } from "./PaymentMethodContainer";
import { StepNavButtons, Input } from "../ui";
import { Shield } from "lucide-react";

const PaymentSetup = ({
  onBack,
  onContinue,
  initialData = {},
  stationCreationData,
  setStationCreationData,
  prevStep,
  nextStep,
}) => {
  const [paymentMethods, setPaymentMethods] = useState(
    stationCreationData.paymentMethods
  );

  const [formData, setFormData] = useState({
    momoNumber: initialData.MOMO?.number || "",
    momoAccountName: initialData.MOMO?.accountName || "",
    omNumber: initialData.OM?.number || "",
    omAccountName: initialData.OM?.accountName || "",
  });

  const [errors, setErrors] = useState({});

  const togglePaymentMethod = (method) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));

    // Clear errors when toggling off
    if (!paymentMethods[method]) {
      setErrors((prev) => ({
        ...prev,
        [`${method.toLowerCase()}Number`]: "",
        [`${method.toLowerCase()}AccountName`]: "",
      }));
    }
  };

  const validatePaymentMethod = (method) => {
    const prefix = method.toLowerCase();
    const numberField = `${prefix}Number`;
    const nameField = `${prefix}AccountName`;

    const newErrors = {};

    if (!formData[numberField]?.trim()) {
      newErrors[numberField] = `${method} number is required`;
    }
    if (!formData[nameField]?.trim()) {
      newErrors[nameField] = "Account name is required";
    }

    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const canSavePaymentMethod = (method) => {
    const prefix = method.toLowerCase();
    const numberField = `${prefix}Number`;
    const nameField = `${prefix}AccountName`;

    return formData[numberField]?.trim() && formData[nameField]?.trim();
  };

  const savePaymentMethod = (method) => {
    const validationErrors = validatePaymentMethod(method);

    if (validationErrors) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    const prefix = method.toLowerCase();
    const numberField = `${prefix}Number`;
    const nameField = `${prefix}AccountName`;

    // Update station creation data
    setStationCreationData((prev) => {
      const existingContactInfo = prev.contactInfo.filter(
        (info) => info.type !== method
      );
      const newContactInfo = [
        ...existingContactInfo,
        {
          type: method,
          number: formData[numberField],
          accountName: formData[nameField],
        },
      ];

      return {
        ...prev,
        contactInfo: newContactInfo,
      };
    });

    // Clear errors
    setErrors((prev) => ({
      ...prev,
      [`${prefix}Number`]: "",
      [`${prefix}AccountName`]: "",
    }));
  };

  const handleContinue = () => {
    // Check if at least one payment method is configured
    if (stationCreationData.contactInfo.length === 0) {
      alert("Please configure at least one payment method before continuing.");
      return;
    }

    onContinue(stationCreationData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Setup
          </h1>
          <p className="text-lg text-gray-600">
            Configure how this station will receive remote payments from
            passengers
          </p>
        </div>

        {/* Payment Method Containers */}
        <div className="space-y-6 mb-8">
          {/* Orange Money */}
          <PaymentMethodContainer
            icon={
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-white font-bold text-lg">OM</div>
              </div>
            }
            title="Orange Money, OM Cameroon"
            description="Receive payments via orange money."
            isEnabled={paymentMethods.OM}
            onToggle={() => togglePaymentMethod("OM")}
            onSave={() => savePaymentMethod("OM")}
            canSave={canSavePaymentMethod("OM")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Orange Money Number"
                value={formData.omNumber}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, omNumber: value }))
                }
                placeholder="••••••"
                required
                showPasswordToggle
                error={errors.omNumber}
              />
              <Input
                label="Account Name"
                value={formData.omAccountName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, omAccountName: value }))
                }
                placeholder="Enter account holder name"
                required
                error={errors.omAccountName}
              />
            </div>
          </PaymentMethodContainer>

          {/* MTN Mobile Money */}
          <PaymentMethodContainer
            icon={
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="text-white font-bold text-sm">MoMo</div>
              </div>
            }
            title="MTN Mobile Money, MOMO"
            description="Receive payments via Momo."
            isEnabled={paymentMethods.MOMO}
            onToggle={() => togglePaymentMethod("MOMO")}
            onSave={() => savePaymentMethod("MOMO")}
            canSave={canSavePaymentMethod("MOMO")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Momo Number"
                value={formData.momoNumber}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, momoNumber: value }))
                }
                placeholder="••••••"
                required
                showPasswordToggle
                error={errors.momoNumber}
              />
              <InputField
                label="Account Name"
                value={formData.momoAccountName}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, momoAccountName: value }))
                }
                placeholder="Enter account holder name"
                required
                error={errors.momoAccountName}
              />
            </div>
          </PaymentMethodContainer>
        </div>

        {/* Navigation Buttons */}
        <StepNavButtons
          onBack={onBack}
          onContinue={handleContinue}
          prevStep={prevStep}
          nextStep={nextStep}
        />
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium shadow-lg"
          >
            Continue
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Shield className="text-blue-500 mt-1" size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Security Notice
              </h4>
              <p className="text-blue-700 leading-relaxed">
                Your payment information is encrypted and stored securely. We
                use industry-standard security measures to protect your
                financial data.
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {stationCreationData.contactInfo.length > 0 && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
            <h4 className="font-medium text-green-900 mb-2">
              Configured Payment Methods:
            </h4>
            <div className="space-y-2">
              {stationCreationData.contactInfo.map((info, index) => (
                <div key={index} className="text-sm text-green-800">
                  <span className="font-medium">{info.type}:</span>{" "}
                  {info.accountName} - {info.number.replace(/./g, "•")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSetup;
