import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { AportacioFlow } from "@/components/flows/aportacio-flow";
import { XepcHeader } from "@/components/flows/xepc-header";
import { initialFromParams } from "@/lib/plans";

export const metadata: Metadata = { title: "Proposta 4 · Aportació — XEPC" };

export default async function Proposta4Aportacio({ searchParams }: PageProps<"/proposta-4/aportacio">) {
  const initial = initialFromParams(await searchParams);
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-14 px-4 py-12 sm:py-16">
      <Link href="/proposta-4" className="inline-flex w-fit items-center gap-2 font-mono text-sm underline underline-offset-4 hover:no-underline">
        <ArrowLeftIcon className="size-4" /> Tornar
      </Link>
      <XepcHeader title="Aporta a la XEPC">
        Fes una aportació econòmica mensual a la Xarxa d&rsquo;Estructures Populars i Comunitàries de Manresa.
      </XepcHeader>
      <AportacioFlow proposta={4} initialXepc={initial.xepc} frequency={initial.frequency} linksAfterForm={false} />
    </main>
  );
}
