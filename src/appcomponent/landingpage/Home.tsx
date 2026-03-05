import { CustomerSay } from "./CustomerSay";
import { HeaterSolution } from "./HeaterSolution";
import { HeroSection } from "./hero";
import { WhyChoose } from "./WhyChoose";


export const Home = () => {
  return (
    <>
      <HeroSection />
      <div className="space-y-12 px-6 my-12">
        <WhyChoose />
        <HeaterSolution />
        {/* <WarmSection /> */}
        {/* <Work /> */}
        <CustomerSay />
        {/* <Experience /> */}
      </div>
    </>
  );
};
