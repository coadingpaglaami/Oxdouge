import { ContactInfo } from "./ContactInfo";
import { FooterSection } from "./FooterSection";
import { HeadingManagement } from "./HeadingManagement";
import { HeroSectionManagement } from "./hero/HeroSection";
import { SocialLinks } from "./SocialLinks";
import { WhyChooseManagement } from "./WhyChooseManagement";

export const UIManager = () => {
  return (
    <div className="py-16 flex flex-col gap-6">
      <HeroSectionManagement />
      <HeadingManagement />
      <WhyChooseManagement />
      {/* <HowWorksManagement /> */}
      {/* <WarmSection /> */}
      <ContactInfo />
      <FooterSection />
      <SocialLinks />
    </div>
  );
};
