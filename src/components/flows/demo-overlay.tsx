"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Maqueta: capa sobre el formulari que permet saltar-lo per veure el pas següent
 * del recorregut sense haver d'omplir les dades.
 */
export function DemoOverlay({
  href,
  message,
  cta,
  children,
}: {
  href: string;
  message: React.ReactNode;
  cta: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative">
      <div inert={open} aria-hidden={open} className={cn(open && "pointer-events-none select-none")}>
        {children}
      </div>
      {open && (
        <div className="absolute -inset-4 z-10 rounded-3xl bg-background/70 backdrop-blur-[3px]">
          <div
            role="dialog"
            aria-label="Maqueta"
            className="sticky top-20 mx-4 mt-6 flex max-w-md sm:mx-auto flex-col gap-4 rounded-3xl border border-black bg-white p-6 shadow-[6px_6px_0_0_#000]"
          >
            <span className="w-fit rounded-full border border-black px-3 py-1 font-mono text-xs uppercase tracking-widest">
              Maqueta
            </span>
            <p className="font-mono text-sm leading-relaxed">{message}</p>
            <Link href={href} className={cn(buttonVariants({ size: "lg" }), "group/cta h-auto min-h-11 rounded-full px-6 py-2 text-center font-mono whitespace-normal")}>
              {cta}
              <ArrowRightIcon className="transition-transform group-hover/cta:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-fit font-mono text-xs underline underline-offset-4 hover:no-underline"
            >
              Prefereixo omplir el formulari
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
