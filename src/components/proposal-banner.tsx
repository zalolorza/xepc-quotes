import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { proposal, type ProposalNumber } from "@/lib/plans";

/** Franja superior: recorda quina proposta s'està provant (maqueta per debatre). */
export function ProposalBanner({ n }: { n: ProposalNumber }) {
  const p = proposal(n);
  return (
    <div className="sticky top-0 z-30 border-b border-black bg-black text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5 font-mono text-xs sm:text-sm">
        <p className="truncate">
          <span className="mr-2 rounded-full bg-white px-2 py-0.5 font-bold text-black">Proposta {p.n}</span>
          {p.title}
        </p>
        <Link href="/" className="inline-flex shrink-0 items-center gap-1.5 underline underline-offset-4 hover:no-underline">
          <ArrowLeftIcon className="size-3.5" />
          <span className="hidden sm:inline">Totes les propostes</span>
          <span className="sm:hidden">Propostes</span>
        </Link>
      </div>
    </div>
  );
}
