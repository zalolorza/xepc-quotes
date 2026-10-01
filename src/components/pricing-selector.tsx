"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { quotaHref } from "@/lib/alta-schema";
import {
  FREQUENCIES,
  TIERS,
  formatEuro,
  monthlyPrice,
  periodPrice,
  type Frequency,
  type OrgKey,
} from "@/lib/quotes";

type PricingSelectorProps = {
  /** Organitzacions a descomptar de la quota. */
  excluded?: OrgKey[];
  /** Mostra el preu original ratllat quan hi ha descompte. */
  showOriginal?: boolean;
};

export function PricingSelector({ excluded = [], showOriginal = false }: PricingSelectorProps) {
  const [frequency, setFrequency] = useState<Frequency>("mensual");

  const freq = FREQUENCIES.find((f) => f.key === frequency)!;
  const hasDiscount = excluded.length > 0;

  return (
    <div className="flex flex-col items-center gap-8">
      <Tabs value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
        <TabsList className="h-11! rounded-full border border-black bg-white p-1">
          {FREQUENCIES.map((f) => (
            <TabsTrigger
              key={f.key}
              value={f.key}
              className="rounded-full px-5 font-mono text-sm data-active:bg-black! data-active:text-white!"
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
              </CardContent>

              <CardFooter className="mt-auto border-0 bg-transparent">
                <Link
                  href={quotaHref(tier.key, frequency, excluded.filter((o) => o !== "xepc"))}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group/cta h-11 w-full rounded-full border-black bg-white font-mono text-sm text-black hover:bg-black hover:text-white"
                  )}
                >
                  Tria aquesta quota
                  <ArrowRightIcon className="transition-transform group-hover/cta:translate-x-1" />
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
