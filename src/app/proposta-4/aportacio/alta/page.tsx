import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AltaView } from "@/components/alta-view";
import { planBase, planFromParams } from "@/lib/plans";

export const metadata: Metadata = { title: "Alta — XEPC" };

const CTX = { kind: "aportacio", proposta: 4 } as const;

export default async function Alta({ searchParams }: PageProps<"/proposta-4/aportacio/alta">) {
  const plan = planFromParams(CTX, await searchParams);
  if (!plan) redirect(planBase(CTX));
  return <AltaView plan={plan} />;
}
