import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts";
import { Loader } from "../../components/ui";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import {
  ArrowRight,
  Bus,
  Shield,
  Zap,
  Users,
  BarChart3,
  Smartphone,
  Star,
  Download,
  MapPin,
  CreditCard,
  Clock,
  TrendingUp,
  DollarSign,
  Settings,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

const heroImage =
  "https://thumbs.dreamstime.com/b/sleek-modern-white-bus-large-windows-stylish-design-passenger-transport-urban-mobility-travel-luxury-public-city-service-387027153.jpg";
const mobileAppMockup =
  "https://png.pngtree.com/png-clipart/20250222/original/pngtree-a-hand-holding-modern-smartphone-with-blank-transparent-screen-mockup-for-png-image_20496022.png";

const agencyFeatures = [
  {
    icon: <Bus className="h-8 w-8 text-accent" />,
    title: "Effortless Fleet & Route Management",
    description:
      "Manage your entire fleet and optimize routes with our intuitive dashboard and real-time tracking.",
    stats: "95% efficiency increase",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-accent" />,
    title: "Powerful Analytics & Reporting",
    description:
      "Get detailed insights into your business performance with comprehensive analytics and custom reports.",
    stats: "300+ metrics tracked",
  },
  {
    icon: <Users className="h-8 w-8 text-accent" />,
    title: "Streamlined Booking & Ticketing",
    description:
      "Automated booking system that handles reservations, seat management, and digital ticketing seamlessly.",
    stats: "10x faster booking",
  },
  {
    icon: <Shield className="h-8 w-8 text-accent" />,
    title: "Customizable Branding",
    description:
      "White-label solution that allows you to maintain your brand identity across all customer touchpoints.",
    stats: "100% brand control",
  },
];

const passengerFeatures = [
  {
    icon: <Smartphone className="h-8 w-8 text-accent" />,
    title: "Simple Ticket Booking",
    description:
      "Book tickets in seconds with our user-friendly mobile app and website interface.",
  },
  {
    icon: <MapPin className="h-8 w-8 text-accent" />,
    title: "Real-Time Bus Tracking",
    description:
      "Track your bus location live and get accurate arrival times with GPS tracking.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-accent" />,
    title: "Secure Digital Payments",
    description:
      "Multiple payment options with bank-level security for worry-free transactions.",
  },
];

const howItWorksSteps = [
  {
    number: "01",
    title: "Register Your Agency",
    description:
      "Sign up in minutes and get access to your personalized agency dashboard with all the tools you need.",
    icon: <Settings className="h-8 w-8" />,
  },
  {
    number: "02",
    title: "Configure Routes & Fleet",
    description:
      "Set up your bus routes, schedules, and fleet information. Our system makes it simple and intuitive.",
    icon: <Bus className="h-8 w-8" />,
  },
  {
    number: "03",
    title: "Start Selling Tickets",
    description:
      "Go live immediately and start accepting bookings through our platform and your branded channels.",
    icon: <TrendingUp className="h-8 w-8" />,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    agency: "Metro Express Lines",
    role: "Operations Manager",
    quote:
      "OmniBuzz transformed our booking system completely. We've seen a 40% increase in online bookings and our customer satisfaction has never been higher.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Michael Chen",
    agency: "Coastal Transport Co.",
    role: "General Manager",
    quote:
      "The analytics dashboard gives us insights we never had before. We've optimized our routes and increased efficiency by 25% in just 3 months.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "Elena Rodriguez",
    agency: "City Connect Buses",
    role: "CEO",
    quote:
      "Implementation was seamless and the support team is outstanding. Our passengers love the real-time tracking and easy booking process.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "David Thompson",
    agency: "Regional Transit Authority",
    role: "Technology Director",
    quote:
      "OmniBuzz has revolutionized how we manage our operations. The platform is intuitive, powerful, and our revenue has increased by 35%.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  },
];

const stats = [
  {
    number: "500+",
    label: "Agencies",
    icon: <Bus className="h-6 w-6" />,
  },
  {
    number: "2M+",
    label: "Tickets Booked",
    icon: <Users className="h-6 w-6" />,
  },
  { number: "99.9%", label: "Uptime", icon: <Shield className="h-6 w-6" /> },
  { number: "24/7", label: "Support", icon: <Phone className="h-6 w-6" /> },
];

const LandingPage = () => {
  const { user, redirectBasedOnRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={32} color="blue" />
      </div>
    );
  }

  if (user) {
    redirectBasedOnRole(user);
    return null;
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-20 pt-4 lg:py-32 lg:pt-4 w-full">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-flex items-center bg-blue-100 text-accent px-4 py-2 rounded-full text-sm font-medium w-fit">
                <Zap className="h-4 w-4 mr-2" />
                Trusted by 500+ Transport Agencies
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                The All-in-One Platform to{" "}
                <span className="text-accent relative">
                  Grow Your Transport Agency
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-blue-200 opacity-30 rounded-lg transform -rotate-1" />
                </span>
              </h1>

              <p className="text-xl text-secondary leading-relaxed max-w-2xl">
                Streamline bookings, manage your fleet, and boost revenue with
                our powerful, easy-to-use software. Join thousands of agencies
                already using OmniBuzz.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <RouterLink
                  to="/agency-registration"
                  className="group inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-accent px-8 py-4 text-lg font-semibold text-accent hover:bg-blue-50 transition-colors duration-200"
                >
                  Looking to book a ticket?
                </RouterLink>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                      <div className="text-accent">{stat.icon}</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.number}
                    </div>
                    <div className="text-sm text-secondary">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-indigo-500 rounded-2xl transform rotate-3 opacity-20" />
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Modern white luxury bus"
                  className="rounded-2xl shadow-2xl w-full h-auto transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Live tracking active
                    </span>
                  </div>
                  <div className="text-xs text-secondary mt-1">
                    250+ buses monitored
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Promotion */}
      <section className="bg-accent py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Download the OmniBuzz Mobile App
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Book tickets, track buses, and manage your journey on the go
                with our award-winning mobile application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="https://apps.apple.com/app/omnibuzz"
                  className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download for iOS
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.omnibuzz"
                  className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download for Android
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src={mobileAppMockup}
                  alt="OmniBuzz Mobile App"
                  className="h-96 w-auto object-contain"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-72 bg-blue-900 rounded-3xl shadow-inner">
                  <div className="p-4 text-white text-center">
                    <div className="text-xs mb-2">OmniBuzz</div>
                    <div className="space-y-2">
                      <div className="bg-blue-800 rounded p-2 text-xs">
                        Book Tickets
                      </div>
                      <div className="bg-blue-800 rounded p-2 text-xs">
                        Track Bus
                      </div>
                      <div className="bg-blue-800 rounded p-2 text-xs">
                        My Trips
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Powerful features designed for modern transport agencies and their
              passengers
            </p>
          </div>

          {/* Agency Features */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
              For Transport Agencies
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {agencyFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-indigo-600 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-secondary leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="text-sm font-medium text-accent bg-blue-50 px-3 py-1 rounded-full w-fit">
                    {feature.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Passenger Features */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
              For Passengers
            </h3>
            <div className="grid gap-8 md:grid-cols-3">
              {passengerFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-xl hover:from-blue-50 hover:to-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-secondary">
              Launch your digital transformation in minutes, not months
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-blue-200 transform -translate-y-1/2" />

            {howItWorksSteps.map((step, index) => (
              <div key={step.number} className="relative text-center group">
                <div className="relative z-10 bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="mb-8 mx-auto w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:bg-blue-700 transition-colors relative">
                    {step.number}
                    <div className="absolute inset-0 rounded-full bg-blue-200 animate-ping opacity-25" />
                  </div>
                  <div className="mb-6 flex justify-center text-accent">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <RouterLink
              to="/agency-registration"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </RouterLink>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Transport Leaders
            </h2>
            <p className="text-xl text-secondary">
              See how agencies are growing with OmniBuzz
            </p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={`star-${testimonial.name}-${i}`}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-secondary">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-accent font-medium">
                        {testimonial.agency}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent to-indigo-700 w-full">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Agency?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of agencies already using OmniBuzz to grow their
              business. Start your free trial today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <RouterLink
                to="/agency-registration"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-accent hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </RouterLink>
              <RouterLink
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-accent transition-colors"
              >
                Contact Sales
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-accent rounded-lg p-2">
                  <Bus className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">OmniBuzz</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The leading platform for transport agencies to manage bookings,
                track fleets, and grow their business digitally.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/omnibuzz"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/omnibuzz"
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/demo"
                    className="hover:text-white transition-colors"
                  >
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OmniBuzz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
