import type { Metadata } from "next";

import { IntegratedFlow } from "@/components/flows/integrated-flow";
import { XepcHeader } from "@/components/flows/xepc-header";
import { initialFromParams } from "@/lib/plans";

export const metadata: Metadata = { title: "Proposta 1 — XEPC" };

export default async function Proposta1({ searchParams }: PageProps<"/proposta-1">) {
  const initial = initialFromParams(await searchParams);
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <XepcHeader title="Aporta a la XEPC">
          Tria quant vols aportar cada mes a la Xarxa d&rsquo;Estructures Populars i Comunitàries de
          Manresa. Després, si vols, hi pots sumar l&rsquo;afiliació als espais en lluita.
        </XepcHeader>
      </div>
      <IntegratedFlow initialXepc={initial.xepc} initialAddons={initial.addons} frequency={initial.frequency} />
    </main>
  );
}
