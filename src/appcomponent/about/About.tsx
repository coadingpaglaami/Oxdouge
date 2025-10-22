import { AboutCard } from "./AboutCard";
import { HeroSection } from "./HeroSection";
import { OurJourney } from "./OurJourney";
import { OurStory } from "./OurStory";
import { OurValues } from "./OurValues";

export const About = () => {
  return (
    <>
      <HeroSection />
      <div className="my-20 space-y-16">
        <OurStory />
        <AboutCard />
        <OurValues />
        <OurJourney />
      </div>
    </>
  );
};
