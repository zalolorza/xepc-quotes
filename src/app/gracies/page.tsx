import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuotaSummary } from "@/components/quota-summary";
import { parseQuotaParams } from "@/lib/alta-schema";

export const metadata: Metadata = {
  title: "Gràcies — XEPC",
};

export default async function GraciesPage({ searchParams }: PageProps<"/gracies">) {
  const quota = parseQuotaParams(await searchParams);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-4 py-16 sm:py-24">
      <header className="flex flex-col gap-5">
        <span className="w-fit rounded-full border border-black bg-white px-4 py-1 font-mono text-xs uppercase tracking-widest">
          Alta rebuda
        </span>
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Gràcies per sumar-te a la lluita!
        </h1>
        <p className="max-w-xl font-mono text-sm leading-relaxed">
          Hem rebut la teva sol·licitud d&rsquo;afiliació. Ens posarem en contacte amb tu per
          donar-te la benvinguda i explicar-te com participar a les assemblees.
        </p>
      </header>

      {quota && <QuotaSummary tier={quota.tier} frequency={quota.frequency} excluded={quota.excluded} />}

      <Link href="/" className={cn(buttonVariants(), "h-11 w-fit rounded-full px-6 font-mono")}>
        Tornar a l&rsquo;inici
      </Link>
    </main>
  );
}
