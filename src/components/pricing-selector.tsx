"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, InfoIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FrequencyTabs } from "@/components/frequency-tabs";
import { SpacesInfo } from "@/components/spaces-info";
import { cn } from "@/lib/utils";
import { altaHref } from "@/lib/plans";
import {
  FREQUENCIES,
  SPLIT_ORGS,
  TIERS,
  formatEuro,
  monthlyPrice,
  periodPrice,
  type Frequency,
  type OrgKey,
} from "@/lib/quotes";

type PricingSelectorProps = {
  /** Proposta 3, o opció B de la proposta 4 (mateix recorregut, rutes diferents). */
  proposta: 3 | 4;
  /** Organitzacions a descomptar de la quota. */
  excluded?: OrgKey[];
  /** Mostra el preu original ratllat quan hi ha descompte. */
  showOriginal?: boolean;
};

export function PricingSelector({ proposta, excluded = [], showOriginal = false }: PricingSelectorProps) {
  const [frequency, setFrequency] = useState<Frequency>("mensual");

  const freq = FREQUENCIES.find((f) => f.key === frequency)!;
  const hasDiscount = excluded.length > 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <FrequencyTabs value={frequency} onChange={setFrequency} />

      <div className="grid w-full gap-4 md:grid-cols-3">
        {TIERS.map((tier) => {
          const monthly = monthlyPrice(tier, excluded);
          const price = periodPrice(monthly, frequency);
          const original = periodPrice(tier.monthly, frequency);

          return (
            <Card
              key={tier.key}
              className={cn(
                "relative rounded-3xl py-6 ring-1 ring-black transition-all [--card-spacing:--spacing(6)] has-[a:hover]:shadow-[6px_6px_0_0_#000]",
                tier.accent
              )}
            >
              <CardHeader>
                <CardTitle className="font-heading text-2xl font-extrabold uppercase leading-none tracking-tight">
                  {tier.name}
                </CardTitle>
                <CardDescription className="min-h-10 font-mono text-xs text-black/70">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-1">
                {showOriginal && hasDiscount && (
                  <span className="font-mono text-sm text-black/50 line-through">
                    {formatEuro(original)}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-5xl font-black tracking-tight">
                    {formatEuro(price)}
                  </span>
                  <span className="font-mono text-sm">/{freq.unit}</span>
                </div>
                <span className="min-h-4 font-mono text-xs text-black/60">
                  {frequency !== "mensual" && `${formatEuro(monthly)}/mes`}
                </span>

                {/* Què inclou: aportació a cada espai segons el repartiment de la quota */}
                <ul className="mt-4 mb-2 flex flex-col divide-y divide-black/20 border-y border-black/20 font-mono text-xs">
                  {SPLIT_ORGS.map((org) => {
                    const deducted = excluded.includes(org.key);
                    return (
                      <li
                        key={org.key}
                        className={cn("flex items-baseline justify-between gap-3 py-2", deducted && "text-black/45")}
                      >
                        <span className={cn(deducted && "line-through")}>{org.label}</span>
                        <span className="shrink-0 font-medium">
                          {deducted ? "Ja hi estàs" : formatEuro(periodPrice(tier.split[org.key], frequency))}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <SpacesInfo tier={tier} frequency={frequency} excluded={excluded} />
              </CardContent>

              <CardFooter className="mt-auto flex-col items-stretch gap-3 border-0 bg-transparent">
                {tier.validationNote ? (
                  <>
                    <p role="note" className="flex gap-2 font-mono text-xs leading-relaxed">
                      <InfoIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
                      {tier.validationNote}
                    </p>
                    {/* <span
                      role="link"
                      aria-disabled="true"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-11 w-full cursor-not-allowed rounded-full border-black/40 bg-white/50 font-mono text-sm text-black/40"
                      )}
                    >
                      Tria aquesta quota
                    </span> */}
                  </>
                ) : (
                  <Link
                    href={altaHref({
                      kind: "unificada",
                      proposta,
                      tier: tier.key,
                      frequency,
                      excluded: excluded.filter((o) => o !== "xepc"),
                    })}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "group/cta h-11 w-full rounded-full border-black bg-white font-mono text-sm text-black hover:bg-black hover:text-white",
                    )}
                  >
                    Tria aquesta quota
                    <ArrowRightIcon className="transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
