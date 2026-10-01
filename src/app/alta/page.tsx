import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { AltaForm } from "@/components/alta-form";
import { QuotaSummary } from "@/components/quota-summary";
import { parseQuotaParams } from "@/lib/alta-schema";

export const metadata: Metadata = {
  title: "Alta — XEPC",
};

export default async function AltaPage({ searchParams }: PageProps<"/alta">) {
  const quota = parseQuotaParams(await searchParams);
  if (!quota) redirect("/");

  const backHref = quota.excluded.length ? "/ja-afiliada" : "/";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16 sm:py-24">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-2 font-mono text-sm underline underline-offset-4 hover:no-underline"
      >
        <ArrowLeftIcon className="size-4" /> Canviar de quota
      </Link>

      <header className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Omple les teves dades
        </h1>
        <p className="font-mono text-sm">Omple les teves dades per completar la teva aportació.</p>
      </header>

      <QuotaSummary tier={quota.tier} frequency={quota.frequency} excluded={quota.excluded} />

      <AltaForm quota={quota} />
    </main>
  );
}
