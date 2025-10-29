"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function page() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "What makes Not Overland heaters different from others?",
      answer: "Not Overland heaters combine power, portability, and innovation. Each model is engineered for efficiency, built with premium materials, and designed to deliver consistent heat even in extreme environments."
    },
    {
      id: 2,
      question: "How long does shipping typically take?",
      answer: "Standard shipping takes 3-5 business days within the continental US. Express shipping is available for 1-2 business days. International shipping times vary by location but typically range from 7-14 business days."
    },
    {
      id: 3,
      question: "What is the warranty period for your heaters?",
      answer: "All Not Overland heaters come with a 2-year comprehensive warranty covering manufacturing defects and performance issues. Extended warranty options are available for commercial use."
    },
    {
      id: 4,
      question: "Are your heaters energy efficient?",
      answer: "Yes! Our heaters feature advanced energy-saving technology that automatically adjusts power consumption based on room temperature, reducing electricity usage by up to 30% compared to conventional heaters."
    },
    {
      id: 5,
      question: "Can I use the heater in my RV or vehicle?",
      answer: "Absolutely! Our portable models are specifically designed for RV and overland use with low power consumption and built-in safety features for mobile applications."
    },
    {
      id: 6,
      question: "What safety features do your heaters include?",
      answer: "All heaters include tip-over protection, overheat protection, child lock, and automatic shut-off features. Our premium models also feature carbon monoxide detection and fire-resistant housing."
    },
    {
      id: 7,
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide to most countries. Shipping costs and delivery times vary by location. You can calculate exact shipping costs during checkout."
    },
    {
      id: 8,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for larger orders."
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            FAQ
          </h1>
          <p className="text-lg md:text-xl text-[#BEBABA] max-w-2xl mx-auto leading-relaxed">
            Thank you for shopping with us! This shipping policy explains how and when your order will be processed, shipped and delivered.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-20">
          {faqData.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-primary rounded-lg overflow-hidden bg-[#212121] transition-all duration-300 hover:border-primary/80"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
              }}
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-primary/5 transition-all duration-300"
              >
                <span className="text-lg font-semibold pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 transition-transform duration-300">
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary" />
                  )}
                </div>
              </button>
              
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openItems.includes(faq.id)
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 border-t border-primary/30">
                  <p className="text-gray-300 leading-relaxed mt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center border-t border-primary/30 pt-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still have a question?
          </h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Can't find the answer you're looking for? Please reach out to our friendly team.
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-primary to-[#FFBB28] hover:from-[#FFDF76] hover:to-purple-600/90 text-black px-8 py-6 text-md rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <Link href="/contact" className="flex items-center gap-2">
              Contact Us
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};