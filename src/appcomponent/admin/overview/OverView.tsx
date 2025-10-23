import { Breadcrumb } from "@/appcomponent/reusable";
import { Card } from "./Card";
import { Revenue } from "./MonthlyRevenue";
import { RevenueData } from "./ReveneuData";

export const OverView = () => {
  return (
    <>
      <Breadcrumb
        title="Overview"
        subtitle="Monitor your business performance abd metrics"
      />
      <div className="flex flex-col gap-4">
        <Card />
        <div className="flex flex-col md:flex-row gap-3">
          <div className="md:w-[75%] w-full">
            <Revenue />
          </div>
          <div className="md:w-[25%] w-full">
            <RevenueData />
          </div>
        </div>
      </div>
    </>
  );
};
