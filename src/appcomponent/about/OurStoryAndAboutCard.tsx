"use client";

import { useGetAboutStoryQuery } from "@/api/ui_manager";
import { AboutCard } from "./AboutCard";
import { OurStory } from "./OurStory";

export const AboutStoryAndAboutCard = () => {
  const { data: aboutStory, isLoading, isError } = useGetAboutStoryQuery({});

  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-[#121212]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-white">Loading story...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-[#121212]">
        <div className="text-center">
          <p className="text-red-500">Error loading content</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] w-full">
      <OurStory storyData={aboutStory || null} />
      <div className="py-12">
        <AboutCard storyData={aboutStory || null} />
      </div>
    </div>
  );
};
