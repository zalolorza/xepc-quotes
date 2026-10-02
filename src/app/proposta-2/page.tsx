import type { Metadata } from "next";

import { AportacioFlow } from "@/components/flows/aportacio-flow";
import { XepcHeader } from "@/components/flows/xepc-header";
import { initialFromParams } from "@/lib/plans";

export const metadata: Metadata = { title: "Proposta 2 — XEPC" };

export default async function Proposta2({ searchParams }: PageProps<"/proposta-2">) {
  const initial = initialFromParams(await searchParams);
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-14 px-4 py-12 sm:py-16">
      <XepcHeader title="Aporta a la XEPC">
        Tria quant vols aportar cada mes a la Xarxa d&rsquo;Estructures Populars i Comunitàries de
        Manresa. Després t&rsquo;expliquem com afiliar-te als espais en lluita.
      </XepcHeader>
      <AportacioFlow proposta={2} initialXepc={initial.xepc} frequency={initial.frequency} linksAfterForm />
    </main>
  );
}
