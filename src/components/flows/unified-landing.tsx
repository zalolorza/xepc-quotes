import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { PricingSelector } from "@/components/pricing-selector";
import { planBase } from "@/lib/plans";

/** Proposta 3 (i opció B de la 4): afiliació sindical unificada. */
export function UnifiedLanding({ proposta }: { proposta: 3 | 4 }) {
  const base = planBase({ kind: "unificada", proposta });
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-14 px-4 py-12 sm:py-16">
      <header className="flex flex-col items-center gap-5 text-center">
        <Image
          src="/logos/logo-xepc.svg"
          alt="XEPC"
          width={134}
          height={214}
          priority
          className="mb-4 h-20 w-auto sm:h-24"
        />
        <h1 className="max-w-4xl font-heading text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Aporta a la lluita i afilia&rsquo;t al sindicalisme popular
        </h1>
        <p className="max-w-2xl font-mono text-base">
          Amb una sola quota contribueixes a la XEPC i t&rsquo;afilies als espais en lluita: Acció Sindical/CGT,
          la PAHC/COSHAC i el Gimnàs Popular la Ruda.
        </p>
      </header>

      <section className="flex w-full flex-col gap-6" aria-labelledby="quotes">
        <PricingSelector proposta={proposta} />
      </section>

      <Link
        href={`${base}/ja-afiliada`}
        className="group inline-flex max-w-xl items-center gap-2 text-center font-mono text-sm underline underline-offset-4 hover:no-underline"
      >
        Ja estic afiliada a algunes de les organitzacions, però vull contribuir també amb la XEPC
        <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
      </Link>
    </main>
  );
}
