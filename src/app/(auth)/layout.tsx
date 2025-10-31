"use client"
import { NavBar } from "@/appcomponent/ui";
import { Noto_Sans } from "next/font/google";
import NextDynamic from "next/dynamic";
const myFont = Noto_Sans({
  subsets: ["latin"],
});


const UserLayout = NextDynamic(
  () => import("@/app/(main)/UserLayOut").then(mod => mod.default),
  { ssr: false }
);

export default function AuthLayOut({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-[#040403] ${myFont.className} `}>
      <div className="sticky top-0 bg-[#73737321] z-50 ">
        <NavBar />
      </div>
      <main>
        <UserLayout>
          {children}

        </UserLayout>
      </main>
    </div>
  );
}
