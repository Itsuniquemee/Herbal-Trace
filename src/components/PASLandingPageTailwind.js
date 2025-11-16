import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const navLinks = [
  { id: 'solution', label: 'Our Solution' },
  { id: 'consumers', label: 'For Consumers' },
  { id: 'producers', label: 'For Producers' },
  { id: 'technology', label: 'Technology' },
];

const features = [
  {
    title: 'Geo-Tagged Provenance',
    description:
      'Verify the exact origin of every herb with immutable GPS and timestamped data recorded on the blockchain at the point of collection.',
    icon: (
      <svg className="mx-auto h-12 w-12 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    link: 'Learn About Collection',
  },
  {
    title: 'Automated Compliance',
    description:
      'Smart contracts automatically enforce sustainability guidelines, quality gates, and regulatory standards, ensuring every batch meets requirements.',
    icon: (
      <svg className="mx-auto h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.333 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751A11.954 11.954 0 0112 2.714z" />
      </svg>
    ),
    link: 'Learn About Smart Contracts',
  },
  {
    title: 'Consumer Trust',
    description:
      'Empower consumers with a simple QR code scan to reveal the complete journey of their product, building unparalleled brand trust.',
    icon: (
      <svg className="mx-auto h-12 w-12 text-rose-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A.75.75 0 014.5 3.75h3.75a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75V4.5zM3.75 15.75A.75.75 0 014.5 15h3.75a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75V15.75zM15.75 4.5a.75.75 0 01.75-.75h3.75a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75H16.5a.75.75 0 01-.75-.75V4.5zM15 15.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM15.75 18a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM18 15.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM18 18a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM19.5 15.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM19.5 18a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM10.5 15.75a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zM10.5 4.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3z" />
      </svg>
    ),
    link: 'Learn About Consumer Scans',
  },
];

const journeySteps = [
  { title: '1. Geo-Tagged Harvest', image: 'https://placehold.co/400x400/588157/ffffff?text=Harvest' },
  { title: '2. Collector Aggregation', image: 'https://placehold.co/400x400/3a5a40/ffffff?text=Aggregation' },
  { title: '3. Processing & Drying', image: 'https://placehold.co/400x400/344e41/ffffff?text=Processing' },
  { title: '4. DNA & Quality Testing', image: 'https://placehold.co/400x400/a3b18a/ffffff?text=Lab+Testing' },
  { title: '5. Formulation & Bottling', image: 'https://placehold.co/400x400/dad7cd/ffffff?text=Formulation' },
  { title: '6. On the Shelf', image: 'https://placehold.co/400x400/588157/ffffff?text=Retail' },
];

const testimonials = [
  {
    quote: 'Herbal Trace ensures we get recognized for our sustainable practices. It connects us directly to the brands that value our quality.',
    name: 'Farmer Cooperative Leader',
  },
  {
    quote: 'Managing compliance and provenance was a nightmare. Now, Herbal Trace gives us a single source of truth. Our audits are simple.',
    name: 'Head of Quality, Ayurvedic Brand',
  },
  {
    quote: 'I scanned the QR code and saw a map of where my Ashwagandha came from and its lab results. I finally trust what I\'m buying.',
    name: 'End Consumer',
  },
  {
    quote: 'The platform\'s smart contracts for geo-fencing and sustainability rules are a game-changer for regulatory compliance and conservation.',
    name: 'Regulatory Body Partner',
  },
];

const blogUpdates = [
  {
    category: 'Blockchain',
    title: 'Why Hyperledger Fabric is Right for Supply Chains',
    image: 'https://placehold.co/600x400/a3b18a/ffffff?text=Blockchain',
  },
  {
    category: 'Sustainability',
    title: 'Protecting Vulnerable Species with Geo-Fencing',
    image: 'https://placehold.co/600x400/3a5a40/ffffff?text=Sustainability',
  },
  {
    category: 'Consumer Tech',
    title: 'The Power of a Simple QR Code',
    image: 'https://placehold.co/600x400/588157/ffffff?text=Consumer+Tech',
  },
  {
    category: 'Regulation',
    title: 'Meeting AYUSH Ministry Export Requirements',
    image: 'https://placehold.co/600x400/344e41/ffffff?text=Regulation',
  },
];

const faqGroups = [
  {
    title: 'About the Platform',
    items: [
      {
        question: 'What is Herbal Trace?',
        answer: 'Herbal Trace is a blockchain-based traceability system designed for the Ayurvedic herbal supply chain. It uses geo-tagging, smart contracts, and QR codes to create an immutable, transparent record of an herb\'s journey from collection to the final product, ensuring authenticity, quality, and sustainability.',
      },
      {
        question: 'Who is this platform for?',
        answer: 'It\'s for the entire supply chain! We provide tools for farmers and wild collectors to certify their harvest, for processors and labs to validate quality, and for brands to prove provenance to their customers. Ultimately, it also serves regulators and end consumers who want assurance of quality and sustainability.',
      },
    ],
  },
  {
    title: 'Technology & Consumers',
    items: [
      {
        question: 'How does the QR code work?',
        answer: 'Manufacturers affix a unique, secure QR code to each product package. When you scan it with your phone\'s camera, our lightweight web portal retrieves that product\'s specific history from the blockchain. You can see a map of its origin, lab certificates, and sustainability proofs—no app required.',
      },
      {
        question: 'What technology does Herbal Trace use?',
        answer: 'Our core is a permissioned blockchain ledger (e.g., Hyperledger Fabric) for security and immutability. We combine this with GPS/IoT devices for on-site data capture (even in low-bandwidth areas via SMS gateways), smart contracts for automated rule enforcement, and standardized FHIR-style metadata for interoperability.',
      },
    ],
  },
];

const footerNavGroups = [
  {
    title: 'Platform',
    links: ['Traceability', 'Smart Contracts', 'Data Capture', 'Consumer Portal'],
  },
  {
    title: 'Solutions',
    links: ['For Brands', 'For Farmers', 'For Regulators', 'Sustainability'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Blog', 'Careers', 'Contact Us'],
  },
  {
    title: 'Connect',
    links: ['LinkedIn', 'Twitter (X)'],
  },
];

const StarIcon = () => (
  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.135-.662 1.456 0l1.86 3.842a1.13 1.13 0 00.858.623l4.239.616c.72.105 1.008.97 1.48 1.45a1.13 1.13 0 010 1.999l-3.067 2.99a1.13 1.13 0 00-.326 1.003l.724 4.22c.123.715-.626 1.26-1.28.941l-3.79-1.992a1.13 1.13 0 00-1.054 0l-3.79 1.992c-.654.319-1.403-.226-1.28-.941l.724-4.22a1.13 1.13 0 00-.326-1.003L.504 9.412a1.13 1.13 0 010-1.999l4.239-.616a1.13 1.13 0 00.858-.623l1.86-3.842z" clipRule="evenodd" />
  </svg>
);

function PASLandingPageTailwind() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState({});

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleFaq = (groupTitle, question) => {
    const key = `${groupTitle}-${question}`;
    setOpenFaqIndex(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="font-sans antialiased text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <nav className="container mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-2xl font-bold text-brand-dark">Herbal Trace</button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex md:gap-x-8 lg:gap-x-12">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-sm font-semibold leading-6 text-gray-700 hover:text-brand-primary"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Utility & CTA (Desktop) */}
          <div className="hidden md:flex md:items-center md:gap-x-6">
            <button className="text-sm font-semibold leading-6 text-gray-700 hover:text-brand-primary">Dashboard</button>
            <button onClick={() => navigate('/login')} className="text-sm font-semibold leading-6 text-gray-700 hover:text-brand-primary">Log In</button>
            <button onClick={() => navigate('/signup')} className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
              Request a Demo
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-700 hover:bg-gray-50 hover:text-brand-primary"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="border-t border-gray-200 py-6 px-2">
              <button className="block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-700 hover:bg-gray-50 hover:text-brand-primary">Dashboard</button>
              <button onClick={() => navigate('/login')} className="block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-700 hover:bg-gray-50 hover:text-brand-primary">Log In</button>
              <button onClick={() => navigate('/signup')} className="mt-2 block w-full rounded-full bg-brand-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-primary-hover">
                Request a Demo
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="w-full">
        {/* Hero Section */}
        <section className="relative flex h-[70vh] min-h-[500px] w-full items-center justify-center overflow-hidden md:h-[90vh]">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80"
            alt="Serene mountain landscape"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: 'center 40%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-white/40"></div>

          <div className="relative z-10 text-center px-4 max-w-5xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg">
              Authentic Ayurveda. Verified from Source to Shelf.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white drop-shadow-md">
              Our blockchain platform ensures the quality, authenticity, and sustainability of every herb.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:gap-x-6 sm:gap-y-0">
              <button onClick={() => navigate('/signup')} className="rounded-full bg-brand-primary px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-all">
                Request a Demo
              </button>
              <button className="text-lg font-semibold leading-6 text-white hover:underline drop-shadow">
                Track Your Product
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="solution" className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              A Transparent, Immutable Supply Chain
            </h2>
            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  {feature.icon}
                  <h3 className="mt-6 text-xl font-semibold text-brand-dark">{feature.title}</h3>
                  <p className="mt-4 text-base text-gray-600">{feature.description}</p>
                  <button className="mt-6 inline-block font-semibold text-brand-primary hover:text-brand-primary-hover">
                    {feature.link} &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section id="producers" className="py-16 sm:py-24 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Tracking Every Step of the Journey
            </h2>
            <div className="mt-12 flex space-x-6 overflow-x-auto pb-4 no-scrollbar">
              {journeySteps.map((step) => (
                <div key={step.title} className="w-64 flex-shrink-0 md:w-80">
                  <img
                    className="w-full h-64 md:h-80 rounded-lg object-cover"
                    src={step.image}
                    alt={step.title}
                  />
                  <h3 className="mt-4 text-lg font-semibold text-brand-dark">{step.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-brand-secondary py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Trusted by Leaders Across the Supply Chain
            </h2>
            <div className="mt-16 flex space-x-6 overflow-x-auto pb-4 no-scrollbar">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="w-80 flex-shrink-0 rounded-lg bg-white p-8 shadow-lg md:w-96">
                  <span className="text-6xl font-bold text-brand-primary">"</span>
                  <blockquote className="mt-2 text-base text-gray-700">
                    {testimonial.quote}
                  </blockquote>
                  <div className="mt-6 flex items-center space-x-1">
                    {[...new Array(5)].map((_, i) => (
                      <StarIcon key={`star-${testimonial.name}-${i}`} />
                    ))}
                  </div>
                  <footer className="mt-4 font-semibold text-brand-dark">{testimonial.name}</footer>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="consumers" className="relative flex h-[70vh] min-h-[500px] w-full items-center justify-center bg-gray-400 bg-cover bg-center">
          <img
            src="https://placehold.co/1920x500/3B82F6/ffffff?text=Secure+Data+Flow"
            alt="Secure blockchain network"
            className="absolute inset-0 h-full w-full object-cover -z-10"
          />
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 w-full max-w-3xl text-center text-white px-4">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Secure Your Supply Chain. Build Consumer Trust.
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-100">
              See how Herbal Trace can bring unparalleled transparency to your brand. Schedule a personalized demo with our team today.
            </p>
            <div className="mt-10">
              <button className="rounded-full bg-brand-primary px-8 py-3 text-lg font-semibold text-white shadow-sm hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
                Request a Demo
              </button>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="technology" className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Technology & Insights
            </h2>
            <div className="mt-12 grid grid-flow-col-dense auto-cols-[90%] gap-6 overflow-x-auto pb-4 md:auto-cols-[31%] md:gap-8 no-scrollbar">
              {blogUpdates.map((blog) => (
                <div key={blog.title} className="group flex-shrink-0">
                  <div className="w-full h-64 overflow-hidden rounded-lg">
                    <img
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={blog.image}
                      alt={blog.title}
                    />
                  </div>
                  <p className="mt-6 text-sm font-semibold uppercase text-brand-primary">{blog.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-brand-dark group-hover:text-brand-primary">
                    {blog.title}
                  </h3>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <button className="rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
                Read More on Our Blog
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <div className="mt-16 space-y-8">
              {faqGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xl font-semibold text-brand-dark">{group.title}</h3>
                  <div className="mt-6 divide-y divide-gray-200 border-b border-t border-gray-200">
                    {group.items.map((item) => {
                      const faqKey = `${group.title}-${item.question}`;
                      const isOpen = openFaqIndex[faqKey];
                      return (
                        <div key={item.question}>
                          <h2>
                            <button
                              type="button"
                              onClick={() => toggleFaq(group.title, item.question)}
                              className="flex w-full items-center justify-between py-6 text-left text-lg font-medium text-gray-800"
                              aria-expanded={isOpen}
                            >
                              <span>{item.question}</span>
                              <svg
                                className={`h-6 w-6 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </button>
                          </h2>
                          {isOpen && (
                            <div className="py-4 pr-12">
                              <p className="text-base text-gray-600">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
            {footerNavGroups.map((group) => (
              <div key={group.title} className="col-span-1">
                <h4 className="font-semibold text-white">{group.title}</h4>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <button className="hover:text-white text-left">{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social Icons (Desktop) */}
            <div className="hidden lg:col-span-1 lg:flex lg:justify-end lg:gap-x-6">
              <button className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-center text-base text-gray-400">&copy; 2025 Herbal Trace. All rights reserved.</p>
            {/* Social Icons (Mobile) */}
            <div className="mt-6 flex justify-center space-x-6 lg:hidden">
              <button className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PASLandingPageTailwind;
