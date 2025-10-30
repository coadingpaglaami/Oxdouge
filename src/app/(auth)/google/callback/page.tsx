import { GoogleCallback } from "@/appcomponent/googleCallBack";
import { Suspense } from "react";

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallback />;
    </Suspense>
  );
}
