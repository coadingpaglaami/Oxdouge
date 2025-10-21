import { Footer, NavBar } from "@/appcomponent/ui";
import { Noto_Sans } from "next/font/google";

const myFont = Noto_Sans({
  subsets: ["latin"],
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-[#040403] ${myFont.className}`}>
      <div className="sticky top-0 ">
        <NavBar />
      </div>

      <main>{children}</main>
      <Footer />
    </div>
  );
}
