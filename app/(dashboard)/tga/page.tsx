import { Suspense } from "react";
import { TgaClient } from "./TgaClient";

export default function TgaPage() {
  return (
    <Suspense>
      <TgaClient />
    </Suspense>
  );
}
