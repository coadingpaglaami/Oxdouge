import { AboutHeadingManagement } from "./AboutHeader";
import { OurStoryManagement } from "./OurStory";
import { OurValues } from "./OurValues";

export const AboutMain = () => {
  return (
    <div className="py-16 flex flex-col gap-6">
      <AboutHeadingManagement />
      <OurStoryManagement />
      <OurValues />
      {/* <OurJourneyManagement /> */}
    </div>
  );
};
