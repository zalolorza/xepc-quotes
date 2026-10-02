import { QuotaSummary } from "@/components/quota-summary";
import { cn } from "@/lib/utils";
import { planLines, type Plan } from "@/lib/plans";
import { FREQUENCIES, formatEuro, periodPrice } from "@/lib/quotes";

/** Resum del que es pagarà, per a qualsevol proposta i periodicitat. */
export function PlanSummary({ plan, className }: { plan: Plan; className?: string }) {
  if (plan.kind === "unificada") {
    return (
      <QuotaSummary tier={plan.tier} frequency={plan.frequency} excluded={plan.excluded} className={className} />
    );
  }

  const { lines, total } = planLines(plan);
  const freq = FREQUENCIES.find((f) => f.key === plan.frequency)!;
  const per = (monthly: number) => periodPrice(monthly, plan.frequency);

  return (
    <div className={cn("flex flex-col gap-4 rounded-3xl border border-black bg-white p-6", className)}>
      <span className="font-mono text-xs uppercase tracking-widest">
        {plan.kind === "aportacio" ? "La teva aportació" : "La teva quota"}
      </span>
      <ul className="flex flex-col divide-y divide-black/15 border-y border-black/15">
        {lines.map((l) => (
          <li key={l.label} className="flex items-baseline justify-between gap-4 py-2 font-mono text-sm">
            <span>
              {l.label}
              {l.detail && <span className="block text-xs text-black/60">{l.detail}</span>}
            </span>
            <span className="shrink-0">
              {formatEuro(per(l.monthly))}/{freq.unit}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="font-heading text-xl font-extrabold uppercase">Total</span>
        <span>
          <span className="font-heading text-4xl font-black">{formatEuro(per(total))}</span>
          <span className="font-mono text-sm">/{freq.unit}</span>
        </span>
      </div>
      <p className="font-mono text-xs text-black/70">
        Pagament {freq.label.toLowerCase()}
        {plan.frequency !== "mensual" && ` · equival a ${formatEuro(total)}/mes`}
      </p>
    </div>
  );
}
