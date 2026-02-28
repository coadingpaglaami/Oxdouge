"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  useGetReturnHelpQuery,
  useGetReturnPolicyQuery,
} from "@/api/ui_manager";

interface ReturnPolicyResult {
  id: number;
  heading: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ReturnPolicyResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReturnPolicyResult[];
}

interface ReturnHelpData {
  id: number;
  title: string;
  heading1: string;
  email: string;
  phone: string;
  hours: string;
  heading2: string;
  address_line1: string;
  address_line2: string;
  city_state_zip: string;
  updated_at: string;
}

export default function ReturnPolicyPage() {
  const [page, setPage] = useState(1);
  const [allPolicies, setAllPolicies] = useState<ReturnPolicyResult[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [activePolicyId, setActivePolicyId] = useState<number | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // Flag so the observer doesn't fire again while a fetch is in-flight
  const isFetchingMoreRef = useRef(false);

  const { data: helpData, isLoading: isHelpLoading } = useGetReturnHelpQuery();
  const { data, isLoading, isFetching } = useGetReturnPolicyQuery({
    page,
    limit: 10,
  });

  // Update policies when new data arrives
  useEffect(() => {
    if (!data) return;

    const response = data as ReturnPolicyResponse;

    // Skip if we've already processed this page
    if (loadedPagesRef.current.has(page)) return;
    loadedPagesRef.current.add(page);

    setAllPolicies((prev) => {
      // Deduplicate by id just in case
      const existingIds = new Set(prev.map((p) => p.id));
      const newItems = response.results.filter((r) => !existingIds.has(r.id));
      return [...prev, ...newItems];
    });

    setHasMore(!!response.next);
    isFetchingMoreRef.current = false;

    // Set first item active only once
    if (page === 1 && response.results.length > 0) {
      setActivePolicyId((prev) =>
        prev === null ? response.results[0].id : prev,
      );
    }
  }, [data, page]);

  // Setup intersection observer for infinite scroll
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

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = allPolicies
        .map((p) => document.getElementById(`policy-${p.id}`))
        .filter(Boolean) as HTMLElement[];

      const active = sections.find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });

      if (active) {
        setActivePolicyId(parseInt(active.id.replace("policy-", "")));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allPolicies]);

  const scrollToPolicy = (policyId: number) => {
    setActivePolicyId(policyId);
    document
      .getElementById(`policy-${policyId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // Parse content - split by newlines and format
  const renderContent = (content: string) => {
    const paragraphs = content.split("\n").filter((p) => p.trim() !== "");

    return paragraphs.map((paragraph, index) => (
      <div key={index} className="flex gap-3 group">
        <span className="mt-1 shrink-0 group-hover:scale-110 transition-transform">
          •
        </span>
        <p className="group-hover:text-gray-200 transition-colors text-gray-300">
          {paragraph}
        </p>
      </div>
    ));
  };

  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-gray-400">Loading return policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Return Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We want you to be completely satisfied with your purchase. Please
            read our return policy carefully to understand our terms and
            conditions.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table of Contents - Left Side (Infinite Scroll) */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                All Policies
              </h2>

              <nav className="space-y-2 pr-4">
                {allPolicies.map((policy) => (
                  <button
                    key={policy.id}
                    onClick={() => scrollToPolicy(policy.id)}
                    className={`w-full flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 text-left group ${
                      activePolicyId === policy.id
                        ? "bg-primary/20 border-l-4 border-primary shadow-lg shadow-primary/10"
                        : "hover:bg-primary/10 border-l-4 border-transparent hover:border-primary/30"
                    }`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activePolicyId === policy.id
                          ? "rotate-90 text-primary"
                          : "text-gray-400 group-hover:text-primary"
                      }`}
                    />
                    <span
                      className={`font-medium transition-colors duration-300 line-clamp-1 ${
                        activePolicyId === policy.id
                          ? "text-primary"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {policy.heading}
                    </span>
                  </button>
                ))}

                {/* Loading indicator for infinite scroll */}
                <div ref={loadMoreRef} className="py-3">
                  {isFetching && page > 1 && (
                    <div className="flex items-center justify-center gap-2 text-[#FFD345]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Loading more...</span>
                    </div>
                  )}
                  {!hasMore && allPolicies.length > 0 && (
                    <p className="text-center text-xs text-gray-600 py-1">
                      All {allPolicies.length} terms loaded
                    </p>
                  )}
                </div>
              </nav>
            </div>
          </div>

          {/* Content - Right Side */}
          <div className="lg:w-3/4">
            {allPolicies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No return policies available.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {allPolicies.map((policy) => (
                  <section
                    key={policy.id}
                    id={`policy-${policy.id}`}
                    className={`scroll-mt-24 p-6 rounded-2xl transition-all duration-300 ${
                      activePolicyId === policy.id
                        ? "bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 shadow-lg shadow-primary/5"
                        : "bg-gradient-to-b from-gray-900/50 to-transparent hover:from-gray-800/50"
                    }`}
                  >
                    <h2 className="text-xl font-bold mb-4 text-white">
                      {policy.heading}
                    </h2>

                    <div className="space-y-4">
                      {renderContent(policy.content)}
                    </div>

                    {/* Last updated info */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-500">
                        Last updated:{" "}
                        {new Date(policy.updated_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </section>
                ))}

                {/* Bottom loading indicator */}
                <div ref={loadMoreRef} className="py-3">
                  {isFetching && page > 1 && (
                    <div className="flex items-center justify-center gap-2 text-[#FFD345]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Loading more...</span>
                    </div>
                  )}
                  {!hasMore && allPolicies.length > 0 && (
                    <div className="text-center py-8 border-t border-white/10">
                      <p className="text-gray-500">
                        You've viewed all {allPolicies.length} return policies
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Box - Dynamic from useGetReturnHelpQuery */}
        {helpData && (
          <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl border border-primary/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              {helpData.title || "Need Help with a Return?"}
            </h3>
            <p className="text-gray-300 mb-6">
              {helpData.heading1 ||
                "Our customer service team is here to help you with any return-related questions or concerns."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-primary mb-3">
                  {helpData.heading2 || "Contact Information"}
                </h4>
                <div className="space-y-2 text-gray-400">
                  {helpData.email && <p>📧 Email: {helpData.email}</p>}
                  {helpData.phone && <p>📞 Phone: {helpData.phone}</p>}
                  {helpData.hours && <p>⏰ Hours: {helpData.hours}</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3">
                  Return Address
                </h4>
                <div className="space-y-2 text-gray-400">
                  {helpData.address_line1 && <p>{helpData.address_line1}</p>}
                  {helpData.address_line2 && <p>{helpData.address_line2}</p>}
                  {helpData.city_state_zip && <p>{helpData.city_state_zip}</p>}
                </div>
              </div>
            </div>

            {/* Last updated for help data */}
            {helpData.updated_at && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  Help information updated:{" "}
                  {new Date(helpData.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Fallback if help data is loading */}
        {isHelpLoading && !helpData && (
          <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl border border-primary/20 backdrop-blur-sm flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
}
