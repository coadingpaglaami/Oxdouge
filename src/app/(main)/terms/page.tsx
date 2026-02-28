"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { useGetTermsConditionsQuery } from "@/api/ui_manager";

interface TermsOfServiceResult {
  id: number;
  heading: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface TermsOfServiceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TermsOfServiceResult[];
}

export default function TermsOfServicePage() {
  const [page, setPage] = useState(1);
  const [allPolicies, setAllPolicies] = useState<TermsOfServiceResult[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [activePolicyId, setActivePolicyId] = useState<number | null>(null);

  // Track which pages we've already merged to prevent duplicate appends
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // Flag so the observer doesn't fire again while a fetch is in-flight
  const isFetchingMoreRef = useRef(false);

  const { data, isLoading, isFetching } = useGetTermsConditionsQuery({
    page,
    limit: 10,
  });

  // ── Merge incoming page data (run only once per page number) ───────────────
  useEffect(() => {
    if (!data) return;

    const response = data as TermsOfServiceResponse;

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
      setActivePolicyId((prev) => (prev === null ? response.results[0].id : prev));
    }
  }, [data, page]);

  // ── Intersection Observer for infinite scroll ──────────────────────────────
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
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [hasMore, isFetching]);

  useEffect(() => {
    if (!isLoading) setupObserver();
    return () => observerRef.current?.disconnect();
  }, [isLoading, setupObserver]);

  // ── Scroll spy ─────────────────────────────────────────────────────────────
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

  const renderContent = (content: string) => {
    const paragraphs = content.split("\n").filter((p) => p.trim() !== "");
    return paragraphs.map((paragraph, index) => (
      <div key={index} className="flex gap-3 group">
        <span className="mt-1.5 shrink-0 text-[#FFD345] text-xs">•</span>
        <p className="group-hover:text-gray-200 transition-colors leading-relaxed text-gray-300 m-0">
          {paragraph}
        </p>
      </div>
    ));
  };

  // ── Initial loading screen ─────────────────────────────────────────────────
  if (isLoading && page === 1) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#FFD345]" />
          <p className="text-gray-400">Loading terms of service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
          Terms of Service
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-2">
          Please read these terms carefully before using our website and purchasing our products.
        </p>
        {allPolicies.length > 0 && (
          <p className="text-sm text-gray-500">
            Last updated:{" "}
            {new Date(allPolicies[0].updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* ── Table of Contents (sticky sidebar) ── */}
        <div className="lg:w-1/4">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <h2 className="text-xl font-bold mb-5 text-[#FFD345]">All Terms</h2>

            <nav className="space-y-1 pr-2">
              {allPolicies.map((policy) => (
                <button
                  key={policy.id}
                  onClick={() => scrollToPolicy(policy.id)}
                  className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-lg transition-all duration-200 text-left group ${
                    activePolicyId === policy.id
                      ? "bg-[#FFD345]/15 border-l-4 border-[#FFD345]"
                      : "hover:bg-white/5 border-l-4 border-transparent hover:border-[#FFD345]/30"
                  }`}
                >
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      activePolicyId === policy.id
                        ? "rotate-90 text-[#FFD345]"
                        : "text-gray-500 group-hover:text-[#FFD345]"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium line-clamp-1 transition-colors duration-200 ${
                      activePolicyId === policy.id
                        ? "text-[#FFD345]"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  >
                    {policy.heading}
                  </span>
                </button>
              ))}

              {/* Infinite scroll sentinel */}
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

        {/* ── Main Content ── */}
        <div className="lg:w-3/4">
          {allPolicies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No terms of service available.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {allPolicies.map((policy) => (
                <section
                  key={policy.id}
                  id={`policy-${policy.id}`}
                  className={`scroll-mt-28 p-6 rounded-2xl transition-all duration-300 ${
                    activePolicyId === policy.id
                      ? "bg-gradient-to-b from-[#FFD345]/10 to-transparent border border-[#FFD345]/20 shadow-lg shadow-[#FFD345]/5"
                      : "bg-gradient-to-b from-gray-900/50 to-transparent hover:from-gray-800/50 border border-transparent"
                  }`}
                >
                  <h2 className="text-lg font-bold mb-4 text-white">{policy.heading}</h2>

                  <div className="space-y-3">{renderContent(policy.content)}</div>

                  <div className="mt-5 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-600">
                      Last updated:{" "}
                      {new Date(policy.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </section>
              ))}

              {isFetching && page > 1 && (
                <div className="flex items-center justify-center gap-2 py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-[#FFD345]" />
                  <span className="text-gray-400 text-sm">Loading more terms...</span>
                </div>
              )}

              {!hasMore && allPolicies.length > 0 && (
                <div className="text-center py-8 border-t border-white/10">
                  <p className="text-gray-500 text-sm">
                    You've viewed all {allPolicies.length} terms of service
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legal Notice */}
      <div className="mt-16 p-8 bg-gradient-to-r from-[#FFD345]/10 to-transparent rounded-2xl border border-[#FFD345]/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#FFD345]">Legal Notice</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
            These Terms of Service constitute a legally binding agreement between you and Not
            Overland. By using our website and services, you acknowledge that you have read,
            understood, and agree to be bound by these terms.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { title: "Legal Inquiries", value: "legal@notoverland.com" },
              { title: "General Support", value: "support@notoverland.com" },
              { title: "Business Hours", value: "Mon–Fri, 9AM–6PM PST" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <h4 className="font-semibold text-[#FFD345] mb-1 text-sm">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3a3a3a; }
      `}</style>
    </div>
  );
}