import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { AffiliatedFlow } from "@/components/affiliated-flow";
import { planBase } from "@/lib/plans";

/** Proposta 3 (i opció B de la 4): ja afiliada a alguna organització. */
export function AffiliatedPage({ proposta }: { proposta: 3 | 4 }) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:py-16">
      <Link
        href={planBase({ kind: "unificada", proposta })}
        className="inline-flex w-fit items-center gap-2 font-mono text-sm underline underline-offset-4 hover:no-underline"
      >
        <ArrowLeftIcon className="size-4" /> Tornar
      </Link>

      <header className="flex flex-col gap-4">
        <h1 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Ja estàs afiliada? Contribueix amb la XEPC
        </h1>
        <p className="max-w-2xl font-mono text-sm">
          Indica a quines organitzacions ja pagues quota i et descomptarem la seva part.
        </p>
      </header>

      <AffiliatedFlow proposta={proposta} />
    </main>
  );
}
