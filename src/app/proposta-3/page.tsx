import type { Metadata } from "next";

import { UnifiedLanding } from "@/components/flows/unified-landing";

export const metadata: Metadata = { title: "Proposta 3 — XEPC" };

export default function Proposta3() {
  return <UnifiedLanding proposta={3} />;
}
