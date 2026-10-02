"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { AltaForm } from "@/components/alta-form";
import { DemoOverlay } from "@/components/flows/demo-overlay";
import { FrequencyTabs } from "@/components/frequency-tabs";
import { PlanSummary } from "@/components/plan-summary";
import { backHref, graciesHref, type Plan } from "@/lib/plans";
import type { Frequency } from "@/lib/quotes";

/**
 * Pàgina d'alta compartida per totes les propostes.
 * La periodicitat (mensual/trimestral/anual) es pot canviar aquí mateix.
 */
export function AltaView({ plan: initialPlan }: { plan: Plan }) {
  const [frequency, setFrequency] = useState<Frequency>(initialPlan.frequency);
  const plan = { ...initialPlan, frequency } as Plan;

  const changeFrequency = (next: Frequency) => {
    setFrequency(next);
    // Manté la URL al dia (recarregar o compartir conserva la tria).
    const url = new URL(window.location.href);
    url.searchParams.set("freq", next);
    window.history.replaceState(window.history.state, "", url);
  };

  // Maqueta: a totes les propostes, una capa sobre el formulari permet saltar-lo
  // i veure el pas final sense omplir dades. A la proposta 2, aquest pas són els enllaços.
  const isP2 = plan.kind === "aportacio" && plan.proposta === 2;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12 sm:py-16">
      <Link
        href={backHref(plan)}
        className="inline-flex w-fit items-center gap-2 font-mono text-sm underline underline-offset-4 hover:no-underline"
      >
        <ArrowLeftIcon className="size-4" /> Canviar de quota
      </Link>

      <header className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
          Omple les teves dades
        </h1>
        <p className="font-mono text-sm">
          Omple les teves dades per completar la teva {plan.kind === "aportacio" ? "aportació" : "afiliació"}.
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-label="La teva quota">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-sm">Com vols pagar?</span>
          <FrequencyTabs value={frequency} onChange={changeFrequency} />
        </div>
        <PlanSummary plan={plan} />
      </section>

      <DemoOverlay
        href={graciesHref(plan)}
        message={
          isP2
            ? "En aquesta proposta, els enllaços per afiliar-te a la CGT i a la PAHC/COSHAC es mostren després d'enviar el formulari d'aportació."
            : "Això és una maqueta: no cal omplir les dades per provar la proposta. Pots veure directament la pantalla final."
        }
        cta={isP2 ? "Veure enllaços un cop omplert el formulari" : "Veure la pantalla un cop omplert el formulari"}
      >
        <AltaForm plan={plan} />
      </DemoOverlay>
    </main>
  );
}
