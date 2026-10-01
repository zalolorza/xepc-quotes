"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { PricingSelector } from "@/components/pricing-selector";
import { AFFILIABLE_ORGS, type OrgKey } from "@/lib/quotes";
import { cn } from "@/lib/utils";

export function AffiliatedFlow() {
  const [orgs, setOrgs] = useState<OrgKey[]>([]);

  const toggle = (key: OrgKey, checked: boolean) =>
    setOrgs((prev) => (checked ? [...prev, key] : prev.filter((o) => o !== key)));

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-5" aria-labelledby="step-1">
        <h2 id="step-1" className="font-heading text-2xl font-extrabold uppercase">
          <span className="mr-2 font-black">1.</span>A quines organitzacions estàs afiliada?
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {AFFILIABLE_ORGS.map((org) => {
            const checked = orgs.includes(org.key);
            return (
              <label
                key={org.key}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-full border border-black px-5 py-4 font-mono text-sm transition-colors",
                  checked ? "bg-black text-white" : "bg-white hover:bg-white/70"
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) => toggle(org.key, value === true)}
                  className={cn("size-5 border-black", checked && "border-white bg-white! text-black!")}
                />
                {org.label}
              </label>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-6" aria-labelledby="step-2">
        <h2 id="step-2" className="font-heading text-2xl font-extrabold uppercase">
          <span className="mr-2 font-black">2.</span>Quina quota voldries pagar?
        </h2>
        {orgs.length === 0 && (
          <p className="font-mono text-sm text-black/60">
            Marca almenys una organització per veure la quota reduïda.
          </p>
        )}
        <PricingSelector excluded={orgs} showOriginal />
      </section>
    </div>
  );
}
