import React, { useState } from "react";
import { PaymentMethodContainer } from "./";
import { StepNavButtons, Input, SecurityNotice, FormHeader } from "../../ui";
import { Shield } from "lucide-react";
import { toast } from "react-toastify";
import MTN from "../../../assets/icons/mtn-momo.png";
import OM from "../../../assets/icons/om.png";
import { isValidCMNumber } from "../../../utils/validateForm";
import { normalizeNumber } from "../../../utils/normalizePhone";

const PaymentSetup = ({
  onBack,
  onContinue,
  stationCreationData,
  setStationCreationData,
  prevStep,
  nextStep,
}) => {
  const [formData, setFormData] = useState({
    momoNumber: "",
    momoAccountName: "",
    omNumber: "",
    omAccountName: "",
  });
  const [errors, setErrors] = useState({});
  const [paymentMethods, setPaymentMethods] = useState({
    OM: false,
    MoMo: false,
  });

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

  const handlePaymentMethodChange = (method, value, field) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStationCreationData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((payment) =>
        payment.method === method ? { ...payment, [field]: value } : payment
      ),
    }));
  };

  const validatePaymentMethod = (method) => {
    const prefix = method.toLowerCase();
    const numberField = `${prefix}Number`;
    const nameField = `${prefix}AccountName`;

    const newErrors = {};

    if (!formData[numberField]?.trim()) {
      newErrors[numberField] = `${method} number is required`;
    }
    // ensure the number is a valid number
    if (!isValidCMNumber(formData[numberField])) {
      newErrors[numberField] = "Invalid number";
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
    // Toggle the payment method off
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));

    const prefix = method.toLowerCase();
    const numberField = `${prefix}Number`;
    const nameField = `${prefix}AccountName`;

    setStationCreationData((prev) => {
      const existingPaymentMethods = prev.paymentMethods.filter(
        (info) => info.method !== method
      );
      const newPaymentMethods = [
        ...existingPaymentMethods,
        {
          method: method,
          value: {
            accountNumber: normalizeNumber(formData[numberField]),
            accountName: formData[nameField],
          },
        },
      ];
      return {
        ...prev,
        paymentMethods: newPaymentMethods,
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
    if (stationCreationData.paymentMethods.length === 0) {
      toast.error(
        "Please configure at least one payment method before continuing."
      );
      return;
    }

    onContinue();
  };

  return (
    <div className="">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <FormHeader
          title={"Payment Setup"}
          description={
            "Configure how this station will receive remote payments from passengers"
          }
        />

        {/* Payment Method Containers */}
        <div className="space-y-6 mb-8">
          {/* Orange Money */}
          <PaymentMethodContainer
            icon={<img src={OM} alt="OM" className="w-16 h-16" />}
            title="Orange Money, OM Cameroon"
            description="Receive payments via orange money."
            isEnabled={paymentMethods["OM"]}
            onToggle={() => togglePaymentMethod("OM")}
            onSave={() => {
              savePaymentMethod("OM");
            }}
            canSave={canSavePaymentMethod("OM")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Orange Money Number"
                type="password"
                value={formData.omNumber}
                onChangeHandler={(e) =>
                  handlePaymentMethodChange("OM", e.target.value, "omNumber")
                }
                placeholder="Enter account number"
                required={true}
                error={errors.omNumber}
              />
              <Input
                label="Account Name"
                value={formData.omAccountName}
                onChangeHandler={(e) =>
                  handlePaymentMethodChange(
                    "OM",
                    e.target.value,
                    "omAccountName"
                  )
                }
                placeholder="Enter account holder name"
                required={true}
                error={errors.omAccountName}
              />
            </div>
          </PaymentMethodContainer>

          {/* MTN Mobile Money */}
          <PaymentMethodContainer
            icon={<img src={MTN} alt="MTN" className="w-16 h-16" />}
            title="MTN Mobile Money, MoMo"
            description="Receive payments via Momo."
            isEnabled={paymentMethods["MoMo"]}
            onToggle={() => togglePaymentMethod("MoMo")}
            onSave={() => savePaymentMethod("MoMo")}
            canSave={canSavePaymentMethod("MoMo")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Momo Number"
                value={formData.momoNumber}
                type="password"
                onChangeHandler={(e) =>
                  handlePaymentMethodChange(
                    "MoMo",
                    e.target.value,
                    "momoNumber"
                  )
                }
                placeholder="Enter account number"
                required={true}
                error={errors.momoNumber}
              />
              <Input
                label="Account Name"
                value={formData.momoAccountName}
                onChangeHandler={(e) =>
                  handlePaymentMethodChange(
                    "MoMo",
                    e.target.value,
                    "momoAccountName"
                  )
                }
                placeholder="Enter account holder name"
                required={true}
                error={errors.momoAccountName}
              />
            </div>
          </PaymentMethodContainer>
        </div>

        {/* Navigation Buttons */}
        <StepNavButtons
          onBack={onBack}
          onContinue={handleContinue}
          canContinue={stationCreationData.paymentMethods.length > 0}
          prevStep={prevStep}
          nextStep={nextStep}
        />

        {/* Security Notice */}
        <section className="mt-8">
          <SecurityNotice
            icon={<Shield className="text-blue-500 mt-1" size={24} />}
            title="Security Notice"
            description="Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your financial data."
          />
        </section>
      </div>
    </div>
  );
};

export default PaymentSetup;
