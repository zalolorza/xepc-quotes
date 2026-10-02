import { cn } from "@/lib/utils";
import {
  AFFILIABLE_ORGS,
  FREQUENCIES,
  TIERS,
  formatEuro,
  monthlyPrice,
  periodPrice,
  type Frequency,
  type OrgKey,
} from "@/lib/quotes";

type QuotaSummaryProps = {
  tier: string;
  frequency: string;
  excluded: OrgKey[];
  className?: string;
  children?: React.ReactNode;
};

export function QuotaSummary({ tier: tierKey, frequency, excluded, className, children }: QuotaSummaryProps) {
  const tier = TIERS.find((t) => t.key === tierKey)!;
  const freq = FREQUENCIES.find((f) => f.key === frequency)!;
  const monthly = monthlyPrice(tier, excluded);
  const price = periodPrice(monthly, freq.key as Frequency);
  const excludedLabels = AFFILIABLE_ORGS.filter((o) => excluded.includes(o.key)).map((o) => o.label);

  return (
    <div className={cn("flex flex-col gap-3 rounded-3xl border border-black p-6", tier.accent, className)}>
      <span className="font-mono text-xs uppercase tracking-widest">La teva quota</span>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-heading text-2xl font-extrabold uppercase leading-none">{tier.name}</h2>
        <p className="flex items-baseline gap-1">
          <span className="font-heading text-4xl font-black">{formatEuro(price)}</span>
          <span className="font-mono text-sm">/{freq.unit}</span>
        </p>
      </div>
      <p className="font-mono text-xs text-black/70">
        Pagament {freq.label.toLowerCase()}
        {freq.key !== "mensual" && ` · equival a ${formatEuro(monthly)}/mes`}
        {excludedLabels.length > 0 && ` · Sense la part de: ${excludedLabels.join(", ")}`}
      </p>
      {children}
    </div>
  );
}
