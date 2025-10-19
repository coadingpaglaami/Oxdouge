import { Footer, NavBar } from "@/appcomponent/ui";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#040403]">
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
