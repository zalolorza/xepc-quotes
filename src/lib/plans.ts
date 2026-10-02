/**
 * Model de les 4 propostes de quotes de la XEPC.
 *
 * Un "pla" és el que la persona ha triat abans d'omplir el formulari d'alta.
 * Viatja a la URL (paràmetres de cerca) i el servidor el torna a validar.
 *
 *   - unificada  → Proposta 3 (i opció B de la 4): quota única repartida entre organitzacions
 *   - integrada  → Proposta 1: aportació a la XEPC + quotes d'afiliació que se sumen
 *   - aportacio  → Proposta 2 (i opció A de la 4): només aportació a la XEPC
 */

import { z } from "zod";

import { FREQUENCIES, TIERS, type Frequency, type OrgKey } from "@/lib/quotes";

/* -------------------------------------------------------------------------- */
/* Propostes                                                                  */
/* -------------------------------------------------------------------------- */

export type ProposalNumber = 1 | 2 | 3 | 4;

export const PROPOSALS: {
  n: ProposalNumber;
  href: string;
  title: string;
  summary: string;
  steps: string[];
}[] = [
  {
    n: 1,
    href: "/proposta-1",
    title: "Contribució a la XEPC + tria d'afiliació integrada",
    summary:
      "Tries quant aportes a la XEPC i, en el mateix formulari, pots afegir-hi l'afiliació a cada espai en lluita. Es paga tot junt.",
    steps: [
      "Tries una aportació a la XEPC: 3, 5, 10, 20 € o una altra quantitat (més de 20 €) al mes.",
      "Pots afegir-hi la quota de la PAHC/COSHAC, d'Acció Sindical/CGT i del Gimnàs la Ruda.",
      "Un sol formulari i un sol rebut amb la suma de tot.",
    ],
  },
  {
    n: 2,
    href: "/proposta-2",
    title: "Contribució a la XEPC + enllaços d'afiliació",
    summary:
      "Tries quant aportes a la XEPC. L'afiliació a cada espai es fa a part, des de la web de cada organització.",
    steps: [
      "Tries una aportació a la XEPC: 3, 5, 10, 20 € o una altra quantitat (més de 20 €) al mes.",
      "Després d'enviar el formulari, et mostrem els enllaços per afiliar-te a la CGT i a la PAHC/COSHAC pel teu compte.",
      "Cada organització cobra la seva quota per separat.",
    ],
  },
  {
    n: 3,
    href: "/proposta-3",
    title: "Afiliació sindical unificada",
    summary:
      "Una quota única (reduïda, base o solidària) que inclou la XEPC, la PAHC/COSHAC, la CGT i el Gimnàs, repartida entre totes.",
    steps: [
      "Tries una de les tres quotes (10, 20 o 30 € al mes) i la periodicitat.",
      "Si ja estàs afiliada a alguna organització, se't descompta la seva part.",
      "Un sol formulari i un sol rebut.",
    ],
  },
  {
    n: 4,
    href: "/proposta-4",
    title: "Proposta híbrida",
    summary:
      "Primer tries com vols participar: fent només una aportació a la XEPC o afiliant-te a totes les estructures amb la quota unificada.",
    steps: [
      "Opció A: aportació econòmica a la XEPC (com la proposta 1, sense afiliacions).",
      "Opció B: afiliació a les estructures de la XEPC (com la proposta 3).",
    ],
  },
];

export const proposal = (n: ProposalNumber) => PROPOSALS.find((p) => p.n === n)!;

/* -------------------------------------------------------------------------- */
/* Aportació a la XEPC                                                        */
/* -------------------------------------------------------------------------- */

export const XEPC_AMOUNTS = [3, 5, 10, 20] as const;
/** La quantitat personalitzada ha de ser superior a aquest import. */
export const XEPC_CUSTOM_MIN = 20;
export const XEPC_MAX = 1000;

export function isValidXepcAmount(value: number): boolean {
  if (!Number.isFinite(value)) return false;
  if ((XEPC_AMOUNTS as readonly number[]).includes(value)) return true;
  return value > XEPC_CUSTOM_MIN && value <= XEPC_MAX && Math.round(value * 100) === value * 100;
}

const xepcAmountSchema = z.coerce
  .number()
  .refine(isValidXepcAmount, `L'aportació ha de ser 3, 5, 10, 20 € o més de ${XEPC_CUSTOM_MIN} €`);

/* -------------------------------------------------------------------------- */
/* Quotes d'afiliació que se sumen (Proposta 1)                               */
/* -------------------------------------------------------------------------- */

export type AddonKey = "pahc" | "cgt" | "gimnas";

export type AddonOption = { key: string; label: string; monthly: number };

export const ADDONS: {
  key: AddonKey;
  name: string;
  logos: { src: string; alt: string; width: number; height: number }[];
  options: AddonOption[];
}[] = [
  {
    key: "pahc",
    name: "PAHC Bages / COSHAC",
    logos: [
      { src: "/logos/logo-pahc.svg", alt: "PAHC Bages", width: 164, height: 122 },
      { src: "/logos/logo-coshac-2.svg", alt: "COSHAC", width: 172, height: 213 },
    ],
    options: [
      { key: "base", label: "Quota base", monthly: 5 },
      { key: "solidaria", label: "Quota solidària", monthly: 12 },
    ],
  },
  {
    key: "cgt",
    name: "Acció Sindical Bages / CGT",
    logos: [
      { src: "/logos/logo-accio-sindical-bages.webp", alt: "Acció Sindical Bages", width: 512, height: 512 },
      { src: "/logos/logo-cgt.svg", alt: "CGT", width: 83, height: 134 },
    ],
    options: [
      { key: "atur", label: "Persones jubilades o en situació d'atur", monthly: 5.86 },
      { key: "precaria", label: "Persones en situació de precarietat", monthly: 6.9 },
      { key: "activa", label: "Persones en actiu o prejubilades", monthly: 11.72 },
    ],
  },
  {
    key: "gimnas",
    name: "Gimnàs Popular la Ruda",
    logos: [{ src: "/logos/logo-ruda.png", alt: "Gimnàs Popular la Ruda", width: 382, height: 382 }],
    options: [
      { key: "basica", label: "Quota bàsica", monthly: 3.3 },
      { key: "solidaria", label: "Quota solidària", monthly: 10 },
    ],
  },
];

export const addon = (key: AddonKey) => ADDONS.find((a) => a.key === key)!;

export function addonOption(key: AddonKey, option?: string): AddonOption | undefined {
  return option ? addon(key).options.find((o) => o.key === option) : undefined;
}

const addonSchema = (key: AddonKey) =>
  z.enum(addon(key).options.map((o) => o.key) as [string, ...string[]]).optional();

/** Enllaços d'afiliació externs (Proposta 2). */
export const AFFILIATION_LINKS: { key: AddonKey; name: string; href: string; logos: (typeof ADDONS)[number]["logos"] }[] = [
  { key: "cgt", name: addon("cgt").name, href: "https://cgtcatalunya.cat/afiliacio/", logos: addon("cgt").logos },
  { key: "pahc", name: addon("pahc").name, href: "https://www.coshac.cat/afiliacio/pahc-bages", logos: addon("pahc").logos },
];

/* -------------------------------------------------------------------------- */
/* Plans                                                                      */
/* -------------------------------------------------------------------------- */

const affiliableOrg = z.enum(["gimnas", "pahc", "cgt"]);

/** Totes les propostes permeten pagar mensual, trimestral o anual. */
const frequencySchema = z.enum(FREQUENCIES.map((f) => f.key) as [Frequency, ...Frequency[]]);

export const planSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("unificada"),
    proposta: z.union([z.literal(3), z.literal(4)]),
    tier: z.enum(TIERS.map((t) => t.key) as [string, ...string[]]),
    frequency: frequencySchema,
    excluded: z.array(affiliableOrg),
  }),
  z.object({
    kind: z.literal("integrada"),
    proposta: z.literal(1),
    frequency: frequencySchema,
    xepc: xepcAmountSchema,
    pahc: addonSchema("pahc"),
    cgt: addonSchema("cgt"),
    gimnas: addonSchema("gimnas"),
  }),
  z.object({
    kind: z.literal("aportacio"),
    proposta: z.union([z.literal(2), z.literal(4)]),
    frequency: frequencySchema,
    xepc: xepcAmountSchema,
  }),
]);

export type Plan = z.infer<typeof planSchema>;
export type PlanKind = Plan["kind"];

/** Ruta base de cada recorregut. */
export function planBase(plan: Pick<Plan, "kind" | "proposta">): string {
  switch (plan.kind) {
    case "unificada":
      return plan.proposta === 4 ? "/proposta-4/afiliacio" : "/proposta-3";
    case "integrada":
      return "/proposta-1";
    case "aportacio":
      return plan.proposta === 4 ? "/proposta-4/aportacio" : "/proposta-2";
  }
}

export function planToParams(plan: Plan): URLSearchParams {
  const params = new URLSearchParams();
  switch (plan.kind) {
    case "unificada":
      params.set("quota", plan.tier);
      if (plan.excluded.length) params.set("orgs", plan.excluded.join(","));
      break;
    case "integrada":
      params.set("xepc", String(plan.xepc));
      for (const key of ["pahc", "cgt", "gimnas"] as const) if (plan[key]) params.set(key, plan[key]!);
      break;
    case "aportacio":
      params.set("xepc", String(plan.xepc));
      break;
  }
  params.set("freq", plan.frequency);
  return params;
}

type SearchParams = Record<string, string | string[] | undefined>;
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

/** Paràmetres de cerca → pla (o null si no és vàlid). */
export function planFromParams(
  ctx: Pick<Plan, "kind" | "proposta">,
  params: SearchParams
): Plan | null {
  const raw =
    ctx.kind === "unificada"
      ? {
          ...ctx,
          tier: first(params.quota),
          frequency: first(params.freq) ?? "mensual",
          excluded: first(params.orgs)?.split(",").filter(Boolean) ?? [],
        }
      : ctx.kind === "integrada"
        ? {
            ...ctx,
            frequency: first(params.freq) ?? "mensual",
            xepc: first(params.xepc),
            pahc: first(params.pahc) || undefined,
            cgt: first(params.cgt) || undefined,
            gimnas: first(params.gimnas) || undefined,
          }
        : { ...ctx, frequency: first(params.freq) ?? "mensual", xepc: first(params.xepc) };
  const parsed = planSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export const altaHref = (plan: Plan) => `${planBase(plan)}/alta?${planToParams(plan)}`;

/** On torna "Canviar de quota" des del formulari (conservant la selecció). */
export function backHref(plan: Plan): string {
  const base = planBase(plan);
  if (plan.kind === "unificada") return plan.excluded.length ? `${base}/ja-afiliada` : base;
  return `${base}?${planToParams(plan)}`;
}

export const graciesHref = (plan: Plan) => {
  const params = planToParams(plan);
  params.set("p", String(plan.proposta));
  params.set("k", plan.kind);
  return `/gracies?${params}`;
};

/** Pàgina de gràcies: el pla porta la proposta (p) i el tipus (k). */
export function planFromGraciesParams(params: SearchParams): Plan | null {
  const kind = first(params.k) as PlanKind | undefined;
  const proposta = Number(first(params.p));
  if (!kind) return null;
  return planFromParams({ kind, proposta } as Pick<Plan, "kind" | "proposta">, params);
}

/* -------------------------------------------------------------------------- */
/* Què implica cada pla                                                       */
/* -------------------------------------------------------------------------- */

/** Organitzacions on la persona s'afilia amb aquest pla (a més de la XEPC). */
export function planJoins(plan: Plan): Record<Exclude<OrgKey, "xepc">, boolean> {
  switch (plan.kind) {
    case "unificada":
      return {
        pahc: !plan.excluded.includes("pahc"),
        cgt: !plan.excluded.includes("cgt"),
        gimnas: !plan.excluded.includes("gimnas"),
      };
    case "integrada":
      return { pahc: !!plan.pahc, cgt: !!plan.cgt, gimnas: !!plan.gimnas };
    case "aportacio":
      return { pahc: false, cgt: false, gimnas: false };
  }
}

/** Seccions del formulari d'alta segons el pla. */
export function planNeeds(plan: Plan) {
  const joins = planJoins(plan);
  const deducted = plan.kind === "unificada" ? plan.excluded : [];
  return {
    // L'adreça la necessita la PAHC/COSHAC; el sector laboral, la CGT.
    adreca: joins.pahc,
    sector: joins.cgt,
    // Si es descompta una part (proposta 3), cal el número d'afiliació.
    numCoshac: deducted.includes("pahc"),
    numCgt: deducted.includes("cgt"),
  };
}

/** Desglossament mensual (propostes 1, 2 i 4A). */
export function planLines(plan: Extract<Plan, { kind: "integrada" | "aportacio" }>) {
  const lines: { label: string; detail?: string; monthly: number }[] = [
    { label: "Aportació a la XEPC", monthly: plan.xepc },
  ];
  if (plan.kind === "integrada") {
    for (const key of ["pahc", "cgt", "gimnas"] as const) {
      const option = addonOption(key, plan[key]);
      if (option) lines.push({ label: addon(key).name, detail: option.label, monthly: option.monthly });
    }
  }
  const total = Math.round(lines.reduce((sum, l) => sum + l.monthly, 0) * 100) / 100;
  return { lines, total };
}

/** Estat inicial dels selectors a partir de la URL (per tornar enrere sense perdre la tria). */
export function initialFromParams(params: SearchParams): {
  xepc: number | null;
  addons: Partial<Record<AddonKey, string>>;
  frequency: Frequency;
} {
  const n = Number(first(params.xepc));
  const addons: Partial<Record<AddonKey, string>> = {};
  for (const key of ["pahc", "cgt", "gimnas"] as const) {
    const option = first(params[key]);
    if (addonOption(key, option)) addons[key] = option;
  }
  const freq = frequencySchema.safeParse(first(params.freq));
  return {
    xepc: first(params.xepc) && isValidXepcAmount(n) ? n : null,
    addons,
    frequency: freq.success ? freq.data : "mensual",
  };
}
