"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const termsData = {
  "termsOfService": {
    "title": "Terms of Service",
    "description": "Please read these terms of service carefully before using our website and purchasing our products.",
    "lastUpdated": "Last updated: January 2025",
    "sections": [
      {
        "id": "agreement-to-terms",
        "title": "Agreement to Terms",
        "content": [
          "By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
          "If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
          "We reserve the right to update, change, or replace any part of these Terms of Service at our discretion."
        ]
      },
      {
        "id": "user-accounts",
        "title": "User Accounts",
        "content": [
          "When you create an account with us, you must provide accurate and complete information.",
          "You are responsible for maintaining the confidentiality of your account and password.",
          "You agree to accept responsibility for all activities that occur under your account.",
          "We reserve the right to refuse service, terminate accounts, or remove content at our discretion."
        ]
      },
      {
        "id": "products-pricing",
        "title": "Products and Pricing",
        "content": [
          "All products are subject to availability and we reserve the right to limit quantities.",
          "Prices for our products are subject to change without notice.",
          {
            "type": "nested",
            "title": "We are not responsible for typographical errors regarding:",
            "items": [
              "Product pricing",
              "Product descriptions",
              "Product availability",
              "Shipping charges"
            ]
          },
          "We reserve the right to discontinue any product at any time."
        ]
      },
      {
        "id": "order-acceptance",
        "title": "Order Acceptance",
        "content": [
          "Your receipt of an order confirmation does not constitute our acceptance of your order.",
          "We reserve the right to refuse or cancel any order for any reason at our sole discretion.",
          "We may require additional verification or information before accepting any order.",
          "Orders may be cancelled for reasons including but not limited to: product availability, errors in pricing, or suspected fraud."
        ]
      },
      {
        "id": "intellectual-property",
        "title": "Intellectual Property",
        "content": [
          "All content on this website, including text, graphics, logos, and images, is our property and protected by copyright laws.",
          "You may not use our trademarks, logos, or service marks without our prior written consent.",
          "You may not reproduce, distribute, or create derivative works from our website content.",
          "Any unauthorized use terminates the permission or license granted by us."
        ]
      },
      {
        "id": "prohibited-uses",
        "title": "Prohibited Uses",
        "content": [
          {
            "type": "nested",
            "title": "In addition to other prohibitions, you are prohibited from using the site:",
            "items": [
              "For any unlawful purpose",
              "To solicit others to perform illegal acts",
              "To violate international regulations or laws",
              "To infringe upon intellectual property rights",
              "To harass, abuse, or insult others",
              "To submit false or misleading information"
            ]
          },
          "We reserve the right to terminate your use of the service for violating any prohibited uses."
        ]
      },
      {
        "id": "disclaimer",
        "title": "Disclaimer of Warranties",
        "content": [
          "The service is provided on an 'as is' and 'as available' basis.",
          "We do not warrant that the service will be uninterrupted, timely, secure, or error-free.",
          "We do not warrant that the results from using the service will be accurate or reliable.",
          "You expressly agree that your use of the service is at your sole risk."
        ]
      },
      {
        "id": "limitation-liability",
        "title": "Limitation of Liability",
        "content": [
          "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages.",
          "Our total liability to you for all claims arising from these terms shall not exceed the amount you paid us in the past six months.",
          "Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above limitations may not apply to you."
        ]
      },
      {
        "id": "indemnification",
        "title": "Indemnification",
        "content": [
          "You agree to indemnify and hold us harmless from any claim or demand, including reasonable attorneys' fees.",
          "This includes any claim arising from your breach of these Terms of Service or your violation of any law.",
          "We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you."
        ]
      },
      {
        "id": "governing-law",
        "title": "Governing Law",
        "content": [
          "These Terms of Service shall be governed by and construed in accordance with the laws of the State of California.",
          "Any disputes arising from these terms shall be resolved in the state or federal courts located in California.",
          "Our failure to enforce any right or provision will not be considered a waiver of those rights."
        ]
      },
      {
        "id": "severability",
        "title": "Severability",
        "content": [
          "If any provision of these Terms of Service is determined to be unlawful, void, or unenforceable, that provision shall be deemed severable.",
          "The severability shall not affect the validity and enforceability of any remaining provisions.",
          "The unenforceable provision will be replaced by an enforceable provision that comes closest to the original intention."
        ]
      },
      {
        "id": "contact-information",
        "title": "Contact Information",
        "content": [
          "Questions about the Terms of Service should be sent to us at legal@notoverland.com.",
          "Our mailing address is: Not Overland Legal Department, 123 Commerce Street, Suite 456, Business Park, CA 90210",
          "We typically respond to legal inquiries within 3-5 business days."
        ]
      }
    ]
  }
};

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("agreement-to-terms");
  const { title, description, lastUpdated, sections } = termsData.termsOfService;

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => 
        document.getElementById(section.id)
      ).filter(Boolean) as HTMLElement[];

      const currentSection = sectionElements.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const renderContent = (content: any[]) => {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        return (
          <div key={index} className="flex gap-3 group">
            <span className=" mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">•</span>
            <p className="group-hover:text-gray-200 transition-colors leading-relaxed">{item}</p>
          </div>
        );
      } else if (item.type === 'nested') {
        return (
          <div key={index} className="space-y-3">
            <div className="flex gap-3 group">
              <span className=" mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">•</span>
              <p className="group-hover:text-gray-200 transition-colors leading-relaxed">{item.title}</p>
            </div>
            <div className="space-y-2 ml-6">
              {item.items.map((nestedItem: string, nestedIndex: number) => (
                <div key={nestedIndex} className="flex gap-3 group">
                  <span className="text-gray-400 mt-1 flex-shrink-0 group-hover:text-primary transition-colors">-</span>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">{nestedItem}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-2">
            {description}
          </p>
          <p className="text-sm text-gray-500">{lastUpdated}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table of Contents - Left Side */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-primary">Table of Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 text-left group ${
                      activeSection === section.id
                        ? "bg-primary/20 border-l-4 border-primary shadow-lg shadow-primary/10"
                        : "hover:bg-primary/10 border-l-4 border-transparent hover:border-primary/30"
                    }`}
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                      activeSection === section.id ? "rotate-90 text-primary" : "text-gray-400 group-hover:text-primary"
                    }`} />
                    <span className={`font-medium transition-colors duration-300 text-sm ${
                      activeSection === section.id ? "text-primary" : "text-gray-300 group-hover:text-white"
                    }`}>
                      {section.title}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content - Right Side */}
          <div className="lg:w-3/4">
            <div>
              {sections.map((section) => (
                <section 
                  key={section.id} 
                  id={section.id} 
                  className="scroll-mt-24 bg-gradient-to-b from-gray-900/50 to-transparent p-4"
                >
                  <h2 className="text-xl font-bold mb-3">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-gray-300">
                    {renderContent(section.content)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Notice Box */}
        <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl border border-primary/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-primary">Legal Notice</h3>
            <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
              These Terms of Service constitute a legally binding agreement between you and Not Overland. 
              By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <div className="text-center">
                <h4 className="font-semibold text-primary mb-2">Legal Inquiries</h4>
                <p className="text-gray-400">legal@notoverland.com</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-primary mb-2">General Support</h4>
                <p className="text-gray-400">support@notoverland.com</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-primary mb-2">Business Hours</h4>
                <p className="text-gray-400">Mon-Fri, 9AM-6PM PST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}