import {
  Users,
  Award,
  Globe,
  TrendingUp,
  Target,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";

const About = () => {
  const stats = [
    {
      number: "500+",
      label: "Transport Agencies",
      icon: <Users className="h-8 w-8" />,
    },
    {
      number: "2M+",
      label: "Tickets Processed",
      icon: <TrendingUp className="h-8 w-8" />,
    },
    {
      number: "50+",
      label: "Countries Served",
      icon: <Globe className="h-8 w-8" />,
    },
    {
      number: "99.9%",
      label: "Uptime Guaranteed",
      icon: <Shield className="h-8 w-8" />,
    },
  ];

  const values = [
    {
      icon: <Target className="h-12 w-12 text-blue-600" />,
      title: "Innovation First",
      description:
        "We constantly push the boundaries of what's possible in transport technology, delivering cutting-edge solutions that keep our clients ahead of the curve.",
    },
    {
      icon: <Heart className="h-12 w-12 text-red-500" />,
      title: "Customer Success",
      description:
        "Our success is measured by our customers' success. We're committed to providing exceptional support and ensuring every client achieves their goals.",
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: "Trust & Security",
      description:
        "We handle sensitive data with the highest security standards, ensuring our platform is reliable, secure, and compliant with global regulations.",
    },
    {
      icon: <Zap className="h-12 w-12 text-yellow-500" />,
      title: "Simplicity",
      description:
        "Complex problems deserve simple solutions. We design intuitive interfaces that make powerful technology accessible to everyone.",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      bio: "Former VP of Engineering at Uber, passionate about transforming transportation.",
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "20+ years in tech, previously led platform engineering at Lyft.",
    },
    {
      name: "Emily Watson",
      role: "VP of Product",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Product strategist with deep expertise in B2B SaaS and mobility solutions.",
    },
    {
      name: "David Kim",
      role: "VP of Sales",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "15+ years building partnerships in the transportation and logistics sector.",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "Company Founded",
      description:
        "OmniBuzz was born from a vision to digitize transport operations globally.",
    },
    {
      year: "2020",
      title: "First 100 Agencies",
      description:
        "Reached our first major milestone serving transport agencies across 5 countries.",
    },
    {
      year: "2021",
      title: "Series A Funding",
      description:
        "Raised $15M to accelerate product development and international expansion.",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description:
        "Expanded to 25 countries with localized solutions for different markets.",
    },
    {
      year: "2023",
      title: "AI Integration",
      description:
        "Launched AI-powered analytics and predictive routing capabilities.",
    },
    {
      year: "2024",
      title: "Industry Leadership",
      description:
        "Became the leading platform with 500+ agencies and 2M+ tickets processed monthly.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-20 lg:py-32 w-full">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4 mr-2" />
              Leading Transport Technology Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">OmniBuzz</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We're on a mission to revolutionize the transportation industry by
              providing innovative, scalable solutions that empower transport
              agencies worldwide to grow their business and serve their
              customers better.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 rounded-lg p-6 mb-4 mx-auto w-fit">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2019, OmniBuzz began with a simple observation: the
                  transportation industry was being left behind by the digital
                  revolution. While other sectors embraced technology, transport
                  agencies were struggling with outdated systems and manual
                  processes.
                </p>
                <p>
                  Our founders, veterans from companies like Uber and Lyft, saw
                  an opportunity to bridge this gap. They envisioned a platform
                  that would democratize access to world-class transport
                  technology, enabling agencies of all sizes to compete in the
                  digital age.
                </p>
                <p>
                  Today, OmniBuzz serves over 500 transport agencies across 50
                  countries, processing millions of tickets and helping our
                  clients grow their revenue by an average of 40% within the
                  first year.
                </p>
              </div>
              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Join our mission
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=400&fit=crop"
                  alt="Team collaboration"
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop"
                  alt="Office environment"
                  className="rounded-lg shadow-lg w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=300&fit=crop"
                  alt="Technology innovation"
                  className="rounded-lg shadow-lg w-full h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=400&fit=crop"
                  alt="Global reach"
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at OmniBuzz
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                  <div className="mb-6 flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to transform transportation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform md:-translate-x-1/2" />

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2 md:translate-x-0" />

                  {/* Content */}
                  <div
                    className={`bg-white rounded-lg shadow-sm p-6 ml-12 md:ml-0 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    } md:w-5/12`}
                  >
                    <div className="text-blue-600 font-bold text-lg mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals driving innovation in transportation
              technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover"
                    />
                    <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-blue-600 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Recognition & Awards
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Industry recognition for our innovation and impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="bg-blue-500 rounded-lg p-6 mb-4 mx-auto w-fit">
                <Award className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                TechCrunch Disruptor
              </h3>
              <p className="text-blue-100">
                Best Transportation Technology 2023
              </p>
            </div>
            <div className="text-center text-white">
              <div className="bg-blue-500 rounded-lg p-6 mb-4 mx-auto w-fit">
                <Star className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">G2 Leader</h3>
              <p className="text-blue-100">
                Highest Customer Satisfaction 2024
              </p>
            </div>
            <div className="text-center text-white">
              <div className="bg-blue-500 rounded-lg p-6 mb-4 mx-auto w-fit">
                <TrendingUp className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Company</h3>
              <p className="text-blue-100">Most Innovative Company 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Join Our Success Story?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Become part of the transportation revolution. Join hundreds of
              agencies already transforming their business with OmniBuzz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/agency-registration"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-blue-600 px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
