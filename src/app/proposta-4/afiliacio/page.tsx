import type { Metadata } from "next";

import { UnifiedLanding } from "@/components/flows/unified-landing";

export const metadata: Metadata = { title: "Proposta 4 · Afiliació — XEPC" };

export default function Proposta4Afiliacio() {
  return <UnifiedLanding proposta={4} />;
}
