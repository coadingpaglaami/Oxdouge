import { CustomerSay } from "./CustomerSay";
import { Experience } from "./Experience";
import { HeaterSolution } from "./HeaterSolution";
import { HeroSection } from "./hero";
import { WarmSection } from "./WarmSection";
import { WhyChoose } from "./WhyChoose";

export const Home = () => {
  return (
    <>
      <HeroSection />
      <div className="space-y-12 px-6 my-12">
        <WhyChoose />
        <HeaterSolution />
        <WarmSection />
        <CustomerSay />
        <Experience />
      </div>
    </>
  );
};
