import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatEuro } from "@/lib/quotes";

/** Barra inferior fixa amb el total i el botó per continuar al formulari. */
export function ContinueBar({ total, href, detail }: { total: number; href: string; detail?: string }) {
  return (
    <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-3xl border sm:rounded-full border-black bg-white py-2 pr-2 pl-6 shadow-[4px_4px_0_0_#000]">
      <p className="flex flex-col font-mono text-xs sm:flex-row sm:items-baseline sm:gap-2 sm:text-sm">
        <span>
          Total: <strong className="font-heading text-2xl font-black">{formatEuro(total)}</strong>/mes
        </span>
        {detail && <span className="text-black/60">{detail}</span>}
      </p>
      <Link href={href} className={cn(buttonVariants({ size: "lg" }), "group/cta h-11 rounded-full px-6 font-mono")}>
        Continuar
        <ArrowRightIcon className="transition-transform group-hover/cta:translate-x-1" />
      </Link>
    </div>
  );
}
