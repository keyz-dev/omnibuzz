import { Link as RouterLink } from "react-router-dom";
import heroImg from "../assets/images/hero.jpg";
import { useAuth } from "../contexts";
import { Loader } from "../components/ui";

const features = [
  {
    icon: (
      <svg
        className="h-10 w-10 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    title: "Easy Booking",
    description:
      "Book your bus tickets in minutes with our user-friendly platform.",
  },
  {
    icon: (
      <svg
        className="h-10 w-10 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "Secure Payments",
    description:
      "Your transactions are protected with state-of-the-art security.",
  },
  {
    icon: (
      <svg
        className="h-10 w-10 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Real-time Updates",
    description: "Get instant notifications about your journey status.",
  },
  {
    icon: (
      <svg
        className="h-10 w-10 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    title: "24/7 Support",
    description: "Our customer support team is always ready to help you.",
  },
];

const LandingPage = () => {
  const { user, redirectBasedOnRole, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={20} color="blue" />
      </div>
    );
  if (user) redirectBasedOnRole(user);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                Your Journey, Our Priority
              </h1>
              <p className="mt-6 text-xl text-secondary">
                Book bus tickets effortlessly, manage your agency efficiently,
                and travel with confidence. Omnibuzz is your all-in-one solution
                for bus transportation.
              </p>
              <div className="mt-8 flex gap-4">
                <RouterLink
                  to="/register"
                  className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
                >
                  Get Started
                </RouterLink>
                <RouterLink
                  to="/agency-registration"
                  className="rounded-md border border-blue-600 px-6 py-3 text-base font-medium text-blue-600 hover:bg-blue-50"
                >
                  Register Agency
                </RouterLink>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImg}
                alt="Bus transportation"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Omnibuzz?
            </h2>
            <p className="mt-4 text-lg text-secondary">
              Experience the future of bus transportation
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
