import { Suspense } from "react";
import { OscarsClient } from "./OscarsClient";

export const dynamic = "force-dynamic";

export default function OscarsPage() {
  return (
    <Suspense>
      <OscarsClient />
    </Suspense>
  );
}
