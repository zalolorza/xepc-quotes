import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { XepcHeader } from "@/components/flows/xepc-header";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Proposta 4 — XEPC" };

const OPTIONS = [
  {
    href: "/proposta-4/aportacio",
    label: "Opció A",
    title: "Fes una aportació a la XEPC",
    text: "Aportació econòmica mensual a la XEPC: 3, 5, 10, 20 € o la quantitat que vulguis.",
    accent: "bg-xepc-blue",
  },
  {
    href: "/proposta-4/afiliacio",
    label: "Opció B",
    title: "Afilia't a les estructures de la XEPC",
    text: "Una quota única que inclou la XEPC, la PAHC/COSHAC, Acció Sindical/CGT i el Gimnàs Popular la Ruda.",
    accent: "bg-xepc-orange",
  },
];

export default function Proposta4() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-12 sm:py-16">
      <XepcHeader title="Com vols participar a la XEPC?">Tria una de les dues opcions.</XepcHeader>
      <div className="grid gap-4 md:grid-cols-2">
        {OPTIONS.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className={cn(
              "group flex flex-col gap-4 rounded-3xl border border-black p-6 transition-shadow hover:shadow-[6px_6px_0_0_#000] sm:p-8",
              o.accent
            )}
          >
            <span className="w-fit rounded-full border border-black bg-white px-3 py-1 font-mono text-xs uppercase tracking-widest">
              {o.label}
            </span>
            <h2 className="font-heading text-3xl font-black uppercase leading-none">{o.title}</h2>
            <p className="flex-1 font-mono text-sm leading-relaxed">{o.text}</p>
            <span className="inline-flex items-center gap-2 font-mono text-sm font-medium">
              Continuar
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
