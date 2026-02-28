import { ContactInfo } from "./ContactInfo";
import { FooterSection } from "./FooterSection";
import { HeroSectionManagement } from "./hero/HeroSection";
import { HowWorksManagement } from "./HowWorksManagement";
import { WarmSection } from "./WarmSection";
import { WhyChooseManagement } from "./WhyChooseManagement";

export const UIManager = () => {
  return (
    <div className="py-16 flex flex-col gap-6">
      <HeroSectionManagement />
      <WhyChooseManagement />
      <HowWorksManagement />
      <WarmSection />
      <ContactInfo />
      <FooterSection />
    </div>
  );
};
