import { Suspense } from "react";
import { TgaClient } from "./TgaClient";

export const dynamic = "force-dynamic";

export default function TgaPage() {
  return (
    <Suspense>
      <TgaClient />
    </Suspense>
  );
}
