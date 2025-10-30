import { Login } from "@/appcomponent/auth";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
