"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export interface NestedContent {
  type: "nested";
  title: string;
  items: string[];
}

export type SectionContent = string | NestedContent;

export interface Section {
  id: string;
  title: string;
  content: SectionContent[];
}

export interface ShippingPolicy {
  title: string;
  description: string;
  sections: Section[];
}

export interface ShippingData {
  shippingPolicy: ShippingPolicy;
}


const shippingData: ShippingData  = {
  "shippingPolicy": {
    "title": "Shipping Policy",
    "description": "Thank you for shopping with us! This Shipping Policy explains how and when your order will be processed, shipped, and delivered.",
    "sections": [
      {
        "id": "order-processing",
        "title": "Order Processing",
        "content": [
          "All orders are processed within 1–2 business days (excluding weekends and holidays).",
          "You will receive an email confirmation once your order has been shipped.",
          "If we experience a high volume of orders, shipments may be delayed by a few days."
        ]
      },
      {
        "id": "shipping-rates",
        "title": "Shipping Rates",
        "content": [
          "Shipping charges for your order will be calculated and displayed at checkout.",
          {
            "type": "nested",
            "title": "Estimated delivery time depends on your location and selected shipping method:",
            "items": [
              "Standard Shipping: 5–7 business days",
              "Express Shipping: 2–3 business days",
              "Overnight Shipping: 1 business day"
            ]
          },
          "Delivery delays may occasionally occur due to weather, customs, or carrier issues."
        ]
      },
      {
        "id": "delivery-estimates",
        "title": "Delivery Estimates",
        "content": [
          "Shipping charges for your order will be calculated and displayed at checkout.",
          {
            "type": "nested",
            "title": "Estimated delivery time depends on your location and selected shipping method:",
            "items": [
              "Standard Shipping: 5–7 business days",
              "Express Shipping: 2–3 business days",
              "Overnight Shipping: 1 business day"
            ]
          },
          "Delivery delays may occasionally occur due to weather, customs, or carrier issues."
        ]
      },
      {
        "id": "international-shipping",
        "title": "International Shipping",
        "content": [
          "We currently ship to select countries outside the United States.",
          "International delivery times vary between 7–21 business days, depending on customs clearance.",
          "Please note that import duties, taxes, and fees are the customer's responsibility."
        ]
      },
      {
        "id": "order-tracking",
        "title": "Order Tracking",
        "content": [
          "Once your order ships, you'll receive a tracking number via email.",
          "You can track your shipment on our website or through the carrier's tracking portal."
        ]
      },
      {
        "id": "lost-packages",
        "title": "Lost or Damaged Packages",
        "content": [
          "We are not liable for products damaged or lost during shipping.",
          "If your package is lost or damaged, please contact the carrier to file a claim.",
          "Be sure to save all packaging materials and proof of purchase before filing a claim."
        ]
      }
    ]
  }
};

export default function ShippingPolicyPage () {
  const [activeSection, setActiveSection] = useState("order-processing");
  const { title, description, sections } = shippingData.shippingPolicy;

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const renderContent = (content: SectionContent[]) => {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        return (
          <div key={index} className="flex gap-3">
            <span className="text-primary mt-1">•</span>
            <p>{item}</p>
          </div>
        );
      } else if (item.type === 'nested') {
        return (
          <div key={index} className="space-y-3">
            <div className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <p>{item.title}</p>
            </div>
            <div className="space-y-2 ml-6">
              {item.items.map((nestedItem: string, nestedIndex: number) => (
                <div key={nestedIndex} className="flex gap-3">
                  <span className="mt-1">•</span>
                  <p>{nestedItem}</p>
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
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
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
              <h2 className="text-2xl font-bold mb-6">Table of Content</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 text-left group ${
                      activeSection === section.id
                        ? "bg-primary/20 border-l-4 border-primary"
                        : "hover:bg-primary/10 border-l-4 border-transparent"
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
            <div className="space-y-12">
              {sections.map((section) => (
                <section 
                  key={section.id} 
                  id={section.id} 
                  className="scroll-mt-24"
                >
                  <h2 className="text-xl mb-3 text-[#FFFFFF]">{section.title}</h2>
                  <div className="space-y-4 text-[#C4C4C4]">
                    {renderContent(section.content)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};