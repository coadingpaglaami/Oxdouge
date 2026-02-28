"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetFaqsQuery } from "@/api/ui_manager";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

interface FAQResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FAQItem[];
}

export default function FaqPage() {
  const [page, setPage] = useState(1);
  const [allFaqs, setAllFaqs] = useState<FAQItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [openItems, setOpenItems] = useState<number[]>([]);

  // Track already-processed pages to prevent duplicate appends
  const loadedPagesRef = useRef<Set<number>>(new Set());
  // Prevent observer from firing multiple times while fetch is in-flight
  const isFetchingMoreRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useGetFaqsQuery({
    page,
    limit: 10,
  });

  // ── Merge incoming page — runs only once per page number ──────────────────
  useEffect(() => {
    if (!data) return;

    const response = data as FAQResponse;

    // Skip if we've already processed this page
    if (loadedPagesRef.current.has(page)) return;
    loadedPagesRef.current.add(page);

    setAllFaqs((prev) => {
      const existingIds = new Set(prev.map((f) => f.id));
      const newItems = response.results.filter((r) => !existingIds.has(r.id));
      return [...prev, ...newItems];
    });

    setHasMore(!!response.next);
    isFetchingMoreRef.current = false;
  }, [data, page]);

  // ── Intersection Observer ─────────────────────────────────────────────────
  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetching &&
          !isFetchingMoreRef.current
        ) {
          isFetchingMoreRef.current = true;
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [hasMore, isFetching]);

  useEffect(() => {
    if (!isLoading) setupObserver();
    return () => observerRef.current?.disconnect();
  }, [isLoading, setupObserver]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // ── Initial loading ───────────────────────────────────────────────────────
  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#FFD345]" />
          <p className="text-gray-400">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
            FAQ
          </h1>
          <p className="text-lg md:text-xl text-[#BEBABA] max-w-2xl mx-auto leading-relaxed">
            Thank you for shopping with us! This shipping policy explains how
            and when your order will be processed, shipped and delivered.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-20">
          {allFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-[#FFD345] rounded-lg overflow-hidden bg-[#212121] transition-all duration-300 hover:border-[#FFD345]/80"
              style={{
                animation: `fadeInUp 0.5s ease-out ${Math.min(index, 9) * 60}ms both`,
              }}
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-[#FFD345]/5 transition-all duration-300 cursor-pointer"
              >
                <span className="text-lg font-semibold pr-4">
                  {faq.question}
                </span>
                <div className="shrink-0">
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-[#FFD345]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#FFD345]" />
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
                <div className="p-6 pt-0 border-t border-[#FFD345]/30">
                  <p className="text-gray-300 leading-relaxed mt-4">
                    {faq.answer}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-500">
                      Last updated:{" "}
                      {new Date(faq.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={loadMoreRef} className="py-8">
            {isFetching && page > 1 && (
              <div className="flex items-center justify-center gap-2 text-[#FFD345]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading more FAQs...</span>
              </div>
            )}
            {!hasMore && allFaqs.length > 0 && (
              <p className="text-center text-sm text-gray-500 py-4">
                You've viewed all {allFaqs.length} FAQs
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-[#FFD345]/30 pt-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still have a question?
          </h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Please reach out
            to our friendly team.
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-[#FFD345] to-[#FFBB28] hover:from-[#FFDF76] hover:to-[#FFD345] text-black px-8 py-6 text-md rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD345]/20"
          >
            <Link href="/contact" className="flex items-center gap-2 group">
              Contact Us
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
