"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckIcon } from "lucide-react";

import { ContinueBar } from "@/components/flows/continue-bar";
import { StepTitle } from "@/components/flows/xepc-header";
import { XepcAmountPicker } from "@/components/flows/xepc-amount-picker";
import { cn } from "@/lib/utils";
import { ADDONS, altaHref, planLines, type AddonKey } from "@/lib/plans";
import { formatEuro, type Frequency } from "@/lib/quotes";

type Addons = Partial<Record<AddonKey, string>>;

/** Proposta 1: aportació a la XEPC + quotes d'afiliació integrades que se sumen. */
export function IntegratedFlow({
  initialXepc,
  initialAddons,
  frequency = "mensual",
}: {
  initialXepc: number | null;
  initialAddons: Addons;
  /** Es tria al formulari d'alta; es conserva si es torna enrere. */
  frequency?: Frequency;
}) {
  const [xepc, setXepc] = useState<number | null>(initialXepc);
  const [addons, setAddons] = useState<Addons>(initialAddons);

  const plan = xepc !== null ? ({ kind: "integrada", proposta: 1, frequency, xepc, ...addons } as const) : null;
  const summary = plan ? planLines(plan) : null;
  const extras = summary ? summary.lines.length - 1 : 0;

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-5 max-w-4xl mx-auto" aria-labelledby="step-xepc">
        <StepTitle n={1} id="step-xepc">
          Quant vols aportar a la XEPC cada mes?
        </StepTitle>
        <XepcAmountPicker value={xepc} onChange={setXepc} />
      </section>

      {plan && (
        <section className="flex flex-col gap-6" aria-labelledby="step-addons">
          <div className="max-w-4xl mx-auto flex flex-col gap-2 rounded-3xl border border-black bg-xepc-orange px-6 py-5">
            <StepTitle n={2} id="step-addons">
              Afegeix la teva afiliació als espais en lluita de la XEPC
            </StepTitle>
            <p className="font-mono text-sm">
              Opcional. Les quotes que triïs se sumen a la teva aportació i es paguen juntes.
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto lg:max-w-none flex flex-col gap-4 lg:grid lg:grid-cols-3">
            {ADDONS.map((org) => (
              <fieldset key={org.key} className="flex flex-col gap-4 rounded-3xl border border-black bg-white p-5 sm:p-6">
                <legend className="sr-only">{org.name}</legend>
                <div className="flex items-center gap-4">
                  <div className="flex shrink-0 items-center gap-2">
                    {org.logos.map((logo) => (
                      <Image key={logo.src} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-10 w-auto object-contain" />
                    ))}
                  </div>
                  <h3 className="font-heading text-lg font-extrabold uppercase leading-tight">{org.name}</h3>
                </div>
                <div role="radiogroup" aria-label={org.name} className="flex flex-col gap-2">
                  {[{ key: "", label: "No, gràcies", monthly: 0 }, ...org.options].map((option) => {
                    const checked = (addons[org.key] ?? "") === option.key;
                    return (
                      <button
                        key={option.key || "none"}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => setAddons((prev) => ({ ...prev, [org.key]: option.key || undefined }))}
                        className={cn(
                          "flex min-h-12 items-center justify-between gap-3 rounded-full border border-black px-5 py-2 text-left font-mono text-sm transition-colors focus-visible:ring-3 focus-visible:ring-black/30 focus-visible:outline-none",
                          checked ? "bg-black text-white" : "bg-white hover:bg-xepc-blue"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {checked && <CheckIcon className="size-4 shrink-0" />}
                          {option.label}
                        </span>
                        {option.key && (
                          <span className="shrink-0 font-heading text-base font-extrabold">
                            +{formatEuro(option.monthly)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="max-w-4xl mx-auto w-full sticky bottom-4 z-20 mt-3">
          <ContinueBar
            total={summary!.total}
            href={altaHref(plan)}
            detail={
              extras > 0
                ? `XEPC ${formatEuro(plan.xepc)} + ${extras} ${extras === 1 ? "afiliació" : "afiliacions"}`
                : "Només aportació a la XEPC"
            }
          />
          </div>
        </section>
      )}
    </div>
  );
}
