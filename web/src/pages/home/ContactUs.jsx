import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContactCard, ContactForm, MapComponent } from "../../components/ui";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const { t } = useTranslation();
  const contacts = t("contact", { returnObjects: true });
  const cards = contacts.cards;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 w-full">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="text-blue-200">Us</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get in touch with our team. We're here to help you transform your
              transport business.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-6">
              <span className="text-blue-200">Home</span>
              <span className="text-blue-300">/</span>
              <span className="text-white">Contact Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container py-10 flexible flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
          {cards.map((contact, index) => (
            <ContactCard
              key={index}
              icon={contact.iconClass}
              title={contact.title}
              value={contact.value}
            />
          ))}
        </div>

        {/* Map and messaging section section */}
        <div className="container flex flex-col-reverse md:grid md:grid-cols-2 mt-10 bg-white">
          {/* Map */}
          <div className="flex flex-col items-center justify-center gap-3 w-full min-h-fit">
            <MapComponent />
          </div>

          {/* Messaging */}
          <ContactForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Have Any <span className="text-blue-600">Questions?</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here are some frequently asked questions about OmniBuzz and our
              services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">
                  How quickly can we get started?
                </h4>
                <p className="text-gray-600 text-sm">
                  You can be up and running in less than 24 hours. Our team
                  provides complete onboarding support.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Do you offer 24/7 support?
                </h4>
                <p className="text-gray-600 text-sm">
                  Yes, we provide round-the-clock support for all our enterprise
                  customers and critical issues.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Can we customize the platform?
                </h4>
                <p className="text-gray-600 text-sm">
                  Absolutely! OmniBuzz offers extensive customization options to
                  match your brand and workflow.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Is there a free trial available?
                </h4>
                <p className="text-gray-600 text-sm">
                  Yes, we offer a 30-day free trial with full access to all
                  features and dedicated support.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">
                  What about data security?
                </h4>
                <p className="text-gray-600 text-sm">
                  We use bank-level encryption and are SOC 2 compliant. Your
                  data security is our top priority.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Do you integrate with existing systems?
                </h4>
                <p className="text-gray-600 text-sm">
                  Yes, we offer APIs and integrations with most popular
                  transport management systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600 w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team is standing by to help you find the perfect solution for
            your transport business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15551234567"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Us Now
            </a>
            <a
              href="mailto:contact@omnibuzz.com"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
