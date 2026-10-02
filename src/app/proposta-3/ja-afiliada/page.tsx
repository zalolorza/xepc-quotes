import type { Metadata } from "next";

import { AffiliatedPage } from "@/components/flows/affiliated-page";

export const metadata: Metadata = { title: "Ja estic afiliada — XEPC" };

export default function Page() {
  return <AffiliatedPage proposta={3} />;
}
