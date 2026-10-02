"use client";

import { useState } from "react";

import { ContinueBar } from "@/components/flows/continue-bar";
import { StepTitle } from "@/components/flows/xepc-header";
import { XepcAmountPicker } from "@/components/flows/xepc-amount-picker";
import { altaHref } from "@/lib/plans";
import type { Frequency } from "@/lib/quotes";

/**
 * Proposta 2 i opció A de la proposta 4: només aportació econòmica a la XEPC.
 * A la proposta 2, els enllaços d'afiliació es mostren després del formulari (a /gracies).
 */
export function AportacioFlow({
  proposta,
  initialXepc,
  frequency = "mensual",
  linksAfterForm,
}: {
  proposta: 2 | 4;
  initialXepc: number | null;
  /** Es tria al formulari d'alta; es conserva si es torna enrere. */
  frequency?: Frequency;
  linksAfterForm: boolean;
}) {
  const [xepc, setXepc] = useState<number | null>(initialXepc);
  const plan = xepc !== null ? ({ kind: "aportacio", proposta, frequency, xepc } as const) : null;

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-5" aria-labelledby="step-xepc">
        <StepTitle id="step-xepc">Quant vols aportar a la XEPC cada mes?</StepTitle>
        <XepcAmountPicker value={xepc} onChange={setXepc} />
      </section>

      

      {plan && <ContinueBar total={plan.xepc} href={altaHref(plan)} detail="Aportació a la XEPC" />}
    </div>
  );
}
