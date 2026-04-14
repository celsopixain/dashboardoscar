import { Suspense } from "react";
import { OscarsClient } from "./OscarsClient";

export default function OscarsPage() {
  return (
    <Suspense>
      <OscarsClient />
    </Suspense>
  );
}
