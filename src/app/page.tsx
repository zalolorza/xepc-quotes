import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { PROPOSALS } from "@/lib/plans";

const ACCENTS = ["bg-xepc-blue", "bg-xepc-lilac", "bg-xepc-orange", "bg-white"];

/** Comparativa per al debat. Columnes: propostes 1–4. */
const COMPARISON: { label: string; values: [string, string, string, string] }[] = [
  {
    label: "Aportació a la XEPC",
    values: [
      "Tria lliure: 3, 5, 10, 20 € o més",
      "Tria lliure: 3, 5, 10, 20 € o més",
      "Inclosa a la quota única (una part fixa)",
      "A: tria lliure · B: inclosa a la quota única",
    ],
  },
  {
    label: "Afiliació a PAHC/COSHAC, CGT i Gimnàs",
    values: [
      "Opcional, triant la quota de cada espai al mateix formulari",
      "A part, a la web de cada organització (CGT i PAHC/COSHAC)",
      "Inclosa a totes; es descompta la part on ja estàs afiliada",
      "A: no · B: inclosa a totes",
    ],
  },
  {
    label: "Import mensual",
    values: ["Des de 3 € (aportació + quotes triades)", "Des de 3 € (+ quotes a part)", "10, 20 o 30 €", "A: des de 3 € · B: 10, 20 o 30 €"],
  },
  {
    label: "Formularis i rebuts",
    values: ["Un", "Un per a la XEPC + un per organització", "Un", "Un"],
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 py-16 sm:py-20">
      <header className="flex flex-col items-center gap-5 text-center">
        <Image src="/logos/logo-xepc.svg" alt="XEPC" width={134} height={214} priority className="mb-2 h-20 w-auto sm:h-24" />
        <span className="rounded-full border border-black bg-white px-4 py-1 font-mono text-xs uppercase tracking-widest">
          Maqueta per al debat
        </span>
        <h1 className="max-w-4xl font-heading text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Propostes de quotes de la XEPC
        </h1>
        <p className="max-w-2xl font-mono text-sm leading-relaxed sm:text-base">
          Hi ha quatre maneres possibles d&rsquo;organitzar les aportacions a la XEPC i l&rsquo;afiliació
          als espais en lluita. Cada proposta té el seu propi recorregut: prova-les com ho faria una
          persona que s&rsquo;hi vol sumar i compara-les. Els formularis no envien cap dada.
        </p>
      </header>

      <section aria-labelledby="propostes" className="flex flex-col gap-6">
        <h2 id="propostes" className="sr-only">
          Les quatre propostes
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {PROPOSALS.map((p, i) => (
            <article
              key={p.n}
              className={cn("flex flex-col gap-5 rounded-3xl border border-black p-6 sm:p-8", ACCENTS[i])}
            >
              <div className="flex items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-black bg-white font-heading text-3xl font-black">
                  {p.n}
                </span>
                <h3 className="pt-1 font-heading text-2xl font-extrabold uppercase leading-tight">{p.title}</h3>
              </div>
              <p className="font-mono text-sm leading-relaxed">{p.summary}</p>
              <ol className="flex flex-1 flex-col gap-2 border-t border-black pt-4 font-mono text-xs leading-relaxed sm:text-sm">
                {p.steps.map((step, j) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-bold">{j + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={p.href}
                className="group inline-flex h-11 w-fit items-center gap-2 rounded-full bg-black px-6 font-mono text-sm text-white transition-colors hover:bg-black/85"
              >
                Prova la proposta {p.n}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* <section aria-labelledby="comparativa" className="flex flex-col gap-6">
        <h2 id="comparativa" className="font-heading text-2xl font-extrabold uppercase">
          Comparativa
        </h2>
        <div className="overflow-x-auto rounded-3xl border border-black bg-white">
          <table className="w-full min-w-[44rem] border-collapse text-left font-mono text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-black">
                <th scope="col" className="w-44 p-4 font-normal text-black/60">
                  <span className="sr-only">Aspecte</span>
                </th>
                {PROPOSALS.map((p) => (
                  <th key={p.n} scope="col" className="p-4 align-bottom font-heading text-base font-extrabold uppercase">
                    Proposta {p.n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-black/15 last:border-0">
                  <th scope="row" className="p-4 align-top font-medium">
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-4 align-top leading-relaxed">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section> */}
    </main>
  );
}
