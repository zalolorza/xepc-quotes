"use client";

import Image from "next/image";

import { BENEFITS } from "@/components/benefits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { FREQUENCIES, formatEuro, periodPrice, type Frequency, type OrgKey, type Tier } from "@/lib/quotes";

/** "+ info" d'una targeta de preu: explica cada espai i quant hi va de la quota. */
export function SpacesInfo({
  tier,
  frequency,
  excluded,
}: {
  tier: Tier;
  frequency: Frequency;
  excluded: OrgKey[];
}) {
  const freq = FREQUENCIES.find((f) => f.key === frequency)!;

  return (
    <Dialog>
      <DialogTrigger className="w-fit font-mono text-xs font-medium underline underline-offset-4 hover:no-underline">
        + info<span className="sr-only">: què inclou la {tier.name.toLowerCase()}</span>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-3xl p-6 ring-1 ring-black sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-8 font-heading text-2xl font-extrabold uppercase leading-tight">
            Què inclou la {tier.name.toLowerCase()}?
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-black/70">
            La quota es reparteix entre aquests espais en lluita ({freq.label.toLowerCase()}).
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col divide-y divide-black/15 border-t border-black/15">
          {BENEFITS.map((b) => {
            const deducted = excluded.includes(b.org);
            return (
              <li key={b.org} className={cn("flex flex-col gap-3 py-4", deducted && "opacity-50")}>
                <div className="flex items-center gap-3">
                  <div className="flex shrink-0 items-center gap-2">
                    {b.logos.map((logo) => (
                      <Image key={logo.src} src={logo.src} alt="" width={logo.width} height={logo.height} className="h-9 w-auto object-contain" />
                    ))}
                  </div>
                  <h3 className="flex-1 font-heading text-base font-extrabold uppercase leading-tight">{b.title}</h3>
                  <span className="shrink-0 font-mono text-sm font-medium">
                    {deducted ? "Ja hi estàs" : `${formatEuro(periodPrice(tier.split[b.org], frequency))}/${freq.unit}`}
                  </span>
                </div>
                <div className="flex flex-col gap-2 font-mono text-xs leading-relaxed text-black/80">
                  {b.info.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
