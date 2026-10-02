"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FREQUENCIES, type Frequency } from "@/lib/quotes";

/** Selector Mensual / Trimestral / Anual. */
export function FrequencyTabs({
  value,
  onChange,
  className,
}: {
  value: Frequency;
  onChange: (value: Frequency) => void;
  className?: string;
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Frequency)} className={className}>
      <TabsList aria-label="Periodicitat del pagament" className={cn("h-11! rounded-full border border-black bg-white p-1")}>
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
  );
}
