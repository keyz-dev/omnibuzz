import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Input, TextArea, ToastMessage } from ".";
import { useState } from "react";
import { Loader } from "./";

const ContactForm = () => {
  const { t } = useTranslation();
  const form = t("contact.form", { returnObjects: true });
  const { statusMessage, labels, placeholders } = form;

  const defaultFormData = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };
  const [formData, setFormData] = useState(defaultFormData);

  const defaultFormStatus = {
    type: "success",
    message: null,
  };

  const [formStatus, setFormStatus] = useState(defaultFormStatus);
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("submitting formData: ", formData);
  };

  return (
    <form
      name="contact"
      action=""
      className="default_transition flex flex-col items-center gap-5 p-5 sm:px-10"
      onSubmit={handleSubmit}
    >
      <h2 className="text-lg text-primary font-semibold">{form.title}</h2>

      {formStatus.message && (
        <ToastMessage
          message={formStatus.message}
          type={formStatus.type}
          onClose={() => setFormStatus(defaultFormStatus)}
        />
      )}

      <Input
        type={"text"}
        name={"name"}
        placeholder={placeholders.name}
        onChangeHandler={handleChange}
        value={formData.name}
        label={labels.name}
      />

      <div className="flex w-full flex-col xl:flex-row gap-3">
        <Input
          type={"email"}
          name={"email"}
          placeholder={placeholders.email}
          onChangeHandler={handleChange}
          value={formData.email}
          label={labels.email}
        />
        <Input
          type={"phone"}
          name={"phone"}
          placeholder={placeholders.phone}
          onChangeHandler={handleChange}
          value={formData.phone}
          label={labels.phone}
        />
      </div>

      <Input
        type={"text"}
        name={"subject"}
        placeholder={placeholders.subject}
        onChangeHandler={handleChange}
        value={formData.subject}
        label={labels.subject}
      />
      <TextArea
        placeholder={placeholders.message}
        name={"message"}
        onChangeHandler={handleChange}
        value={formData.message}
        label={labels.message}
        rows={6}
      />

      <div className="w-full">
        <Button
          type="submit"
          text={loader ? <Loader /> : form.submit}
          isDisabled={loader}
          additionalClasses="primarybtn"
        />
      </div>
    </form>
  );
};

export default ContactForm;
