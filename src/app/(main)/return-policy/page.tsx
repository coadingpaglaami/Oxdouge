"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const returnPolicyData = {
  "returnPolicy": {
    "title": "Return Policy",
    "description": "We want you to be completely satisfied with your purchase. Please read our return policy carefully to understand our terms and conditions.",
    "sections": [
      {
        "id": "return-eligibility",
        "title": "Return Eligibility",
        "content": [
          "Items must be returned within 30 days of the delivery date.",
          "The product must be unused, in its original packaging, and in the same condition as received.",
          "All original tags and labels must be attached.",
          "Proof of purchase or order number is required for all returns."
        ]
      },
      {
        "id": "non-returnable-items",
        "title": "Non-Returnable Items",
        "content": [
          "Customized or personalized products",
          "Gift cards and downloadable software products",
          "Intimate apparel and swimwear for hygiene reasons",
          "Products marked as 'Final Sale' or 'Clearance'",
          "Opened software, DVDs, and video games"
        ]
      },
      {
        "id": "return-process",
        "title": "Return Process",
        "content": [
          "Contact our customer service team to initiate a return and receive a Return Authorization Number.",
          "Pack the item securely in its original packaging with all accessories.",
          "Include the original invoice and Return Authorization Number inside the package.",
          "Ship the package to our return address using a trackable shipping method."
        ]
      },
      {
        "id": "refund-timeline",
        "title": "Refund Timeline",
        "content": [
          {
            "type": "nested",
            "title": "Once we receive your return:",
            "items": [
              "Processing and inspection: 3-5 business days",
              "Refund initiation: Within 24 hours after approval",
              "Credit card refunds: 5-10 business days to appear on your statement",
              "PayPal refunds: 3-5 business days"
            ]
          },
          "You will receive an email notification once your refund has been processed."
        ]
      },
      {
        "id": "shipping-costs",
        "title": "Shipping Costs",
        "content": [
          "Return shipping costs are the responsibility of the customer unless the return is due to our error.",
          "Original shipping charges are non-refundable.",
          "If you received free shipping on your original order, the cost of return shipping will be deducted from your refund."
        ]
      },
      {
        "id": "exchanges",
        "title": "Exchanges",
        "content": [
          "We currently offer exchanges for defective or damaged items only.",
          "To exchange an item, please follow the standard return process and place a new order for the desired item.",
          "Exchanges are subject to product availability.",
          "Size and color exchanges are treated as returns and new purchases."
        ]
      },
      {
        "id": "damaged-defective",
        "title": "Damaged or Defective Items",
        "content": [
          "If you receive a damaged or defective item, please contact us within 7 days of delivery.",
          "Provide photos of the damaged product and packaging.",
          "We will arrange for a free return shipping label and expedite your replacement.",
          "Replacements are subject to stock availability. If unavailable, we will issue a full refund."
        ]
      },
      {
        "id": "international-returns",
        "title": "International Returns",
        "content": [
          "International customers are responsible for return shipping costs and any customs fees.",
          "Return processing may take additional time due to customs clearance.",
          "Refunds will be issued in the original currency of payment.",
          "Currency exchange rates and bank fees may apply."
        ]
      },
      {
        "id": "store-credit",
        "title": "Store Credit",
        "content": [
          "You may choose to receive store credit instead of a refund.",
          "Store credit never expires and can be used for future purchases.",
          "Store credit is issued immediately upon return approval.",
          "Store credit cannot be converted to cash or transferred to another account."
        ]
      }
    ]
  }
};

export default function ReturnPolicyPage() {
  const [activeSection, setActiveSection] = useState("return-eligibility");
  const { title, description, sections } = returnPolicyData.returnPolicy;

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
            <p className="group-hover:text-gray-200 transition-colors">{item}</p>
          </div>
        );
      } else if (item.type === 'nested') {
        return (
          <div key={index} className="space-y-3">
            <div className="flex gap-3 group">
              <span className=" mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">•</span>
              <p className="group-hover:text-gray-200 transition-colors">{item.title}</p>
            </div>
            <div className="space-y-2 ml-6">
              {item.items.map((nestedItem: string, nestedIndex: number) => (
                <div key={nestedIndex} className="flex gap-3 group">
                  <span className="text-gray-400 mt-1 flex-shrink-0 group-hover:text-primary transition-colors">-</span>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{nestedItem}</p>
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
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table of Contents - Left Side */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-primary">Table of Content</h2>
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
                    <span className={`font-medium transition-colors duration-300 ${
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
                  className="scroll-mt-24 bg-gradient-to-b from-gray-900/50 to-transparent p-5 rounded-2xl"
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

        {/* Additional Info Box */}
        <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl border border-primary/20">
          <h3 className="text-2xl font-bold mb-4 text-primary">Need Help with a Return?</h3>
          <p className="text-gray-300 mb-4">
            Our customer service team is here to help you with any return-related questions or concerns.
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex-1">
              <h4 className="font-semibold text-primary mb-2">Contact Information</h4>
              <p className="text-gray-400">Email: returns@notoverland.com</p>
              <p className="text-gray-400">Phone: +1 (555) 123-RETURN</p>
              <p className="text-gray-400">Hours: Mon-Fri, 9AM-6PM EST</p>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-primary mb-2">Return Address</h4>
              <p className="text-gray-400">Not Overland Returns</p>
              <p className="text-gray-400">123 Commerce Street</p>
              <p className="text-gray-400">Suite 456, Business Park, CA 90210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};