"use client"
import { SignUp } from "@/appcomponent/auth";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
