import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { PlanSummary } from "@/components/plan-summary";
import { ProposalBanner } from "@/components/proposal-banner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AFFILIATION_LINKS, planFromGraciesParams, proposal } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Gràcies — XEPC",
};

export default async function GraciesPage({ searchParams }: PageProps<"/gracies">) {
  const plan = planFromGraciesParams(await searchParams);
  const isAportacio = plan?.kind === "aportacio";

  return (
    <>
      {plan && <ProposalBanner n={plan.proposta} />}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-10 px-4 py-12 sm:py-16">
        <header className="flex flex-col gap-5">
          <span className="w-fit rounded-full border border-black bg-white px-4 py-1 font-mono text-xs uppercase tracking-widest">
            {isAportacio ? "Aportació rebuda" : "Alta rebuda"}
          </span>
          <h1 className="font-heading text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Gràcies per sumar-te a la lluita!
          </h1>
          <p className="max-w-xl font-mono text-sm leading-relaxed">
            {isAportacio
              ? "Hem rebut la teva aportació a la XEPC. Ens posarem en contacte amb tu per donar-te la benvinguda i explicar-te com participar a les assemblees."
              : "Hem rebut la teva sol·licitud d'afiliació. Ens posarem en contacte amb tu per donar-te la benvinguda i explicar-te com participar a les assemblees."}
          </p>
        </header>

        {plan && <PlanSummary plan={plan} />}

        {/* Proposta 2: recordatori dels enllaços d'afiliació */}
        {plan?.proposta === 2 && (
          <section className="flex flex-col gap-4" aria-labelledby="links">
            <h2 id="links" className="font-heading text-xl font-extrabold uppercase">
              Afilia&rsquo;t també als espais en lluita de la XEPC
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {AFFILIATION_LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-3xl border border-black bg-white p-4 transition-shadow hover:shadow-[4px_4px_0_0_#000]"
                >
                  {link.logos.map((logo) => (
                    <Image key={logo.src} src={logo.src} alt="" width={logo.width} height={logo.height} className="h-8 w-auto object-contain" />
                  ))}
                  <span className="flex-1 font-mono text-sm">{link.name}</span>
                  <ArrowUpRightIcon className="size-4 shrink-0" />
                  <span className="sr-only">(s&rsquo;obre en una pestanya nova)</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
