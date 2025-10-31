import { Login } from "@/appcomponent/auth";
export const dynamic = "force-dynamic";
import { Suspense } from "react";



export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
