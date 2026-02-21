import { OurJourneyManagement } from "./OurJourney";
import { OurStoryManagement } from "./OurStory";

export const AboutMain = () => {
  return (
    <div className="py-16 flex flex-col gap-6">
      <OurStoryManagement />
      <OurJourneyManagement />
    </div>
  );
};
