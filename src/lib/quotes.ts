/**
 * Model de quotes de la XEPC.
 *
 * Cada quota es reparteix entre les organitzacions que la formen.
 * Quan una persona ja està afiliada a alguna organització, se li
 * descompta la part corresponent a aquella organització.
 */

export type OrgKey = "xepc" | "gimnas" | "pahc" | "cgt";

export type TierKey = "precaria" | "basica" | "solidaria";

export type Frequency = "mensual" | "trimestral" | "anual";

export type Tier = {
  key: TierKey;
  name: string;
  description: string;
  /** Import mensual nominal (el que es mostra a la landing). */
  monthly: number;
  /** Repartiment mensual entre organitzacions. */
  split: Record<OrgKey, number>;
  /** Classe de color de fons de la targeta. */
  accent: string;
  /**
   * Si la quota l'ha de validar el col·lectiu, no es pot triar directament:
   * la targeta mostra aquest missatge i el botó queda desactivat.
   */
  validationNote?: string;
};

export const TIERS: Tier[] = [
  {
    key: "precaria",
    name: "Quota reduïda",
    description:
      "Per a les persones a l'atur o amb dificultats econòmiques.",
    monthly: 10,
    split: { xepc: 1.16, gimnas: 1.5, pahc: 1.5, cgt: 5.86 },
    accent: "bg-xepc-blue",
    validationNote:
      "La quota reduïda ha de ser validada pel teu col·lectiu. Si us plau, parla amb la persona referent del teu col·lectiu.",
  },
  {
    key: "basica",
    name: "Quota base",
    description: "La quota de referència per sostenir l'organització.",
    monthly: 20,
    split: { xepc: 3, gimnas: 5, pahc: 5, cgt: 6.9 },
    accent: "bg-xepc-lilac",
  },
  {
    key: "solidaria",
    name: "Quota solidària",
    description:
      "Per a qui pot aportar una mica més.",
    monthly: 30,
    split: { xepc: 8.28, gimnas: 5, pahc: 5, cgt: 11.72 },
    accent: "bg-xepc-orange",
  },
];

export const FREQUENCIES: { key: Frequency; label: string; months: number; unit: string }[] = [
  { key: "mensual", label: "Mensual", months: 1, unit: "mes" },
  { key: "trimestral", label: "Trimestral", months: 3, unit: "trimestre" },
  { key: "anual", label: "Anual", months: 12, unit: "any" },
];

/** Organitzacions que es poden descomptar al flux "ja estic afiliada". */
export const AFFILIABLE_ORGS: { key: Exclude<OrgKey, "xepc">; label: string }[] = [
  { key: "cgt", label: "CGT / Acció Sindical" },
  { key: "pahc", label: "COSHAC / PAHC" },
  { key: "gimnas", label: "Gimnàs Popular la Ruda" },
];

/**
 * Import mensual d'una quota descomptant les organitzacions on ja s'està afiliada.
 * Sense descomptes es retorna l'import nominal; amb descomptes es suma la part
 * de les organitzacions restants.
 */
export function monthlyPrice(tier: Tier, excluded: OrgKey[] = []): number {
  if (excluded.length === 0) return tier.monthly;
  const total = (Object.keys(tier.split) as OrgKey[])
    .filter((org) => !excluded.includes(org))
    .reduce((sum, org) => sum + tier.split[org], 0);
  return Math.round(total * 100) / 100;
}

export function periodPrice(monthly: number, frequency: Frequency): number {
  const months = FREQUENCIES.find((f) => f.key === frequency)?.months ?? 1;
  return Math.round(monthly * months * 100) / 100;
}

const intFormatter = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const decFormatter = new Intl.NumberFormat("ca-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 10 € / 1,50 € — decimals només quan cal. */
export function formatEuro(value: number): string {
  return Number.isInteger(value) ? intFormatter.format(value) : decFormatter.format(value);
}

/** Espais que reben part de la quota unificada (ordre de presentació a les targetes). */
export const SPLIT_ORGS: { key: OrgKey; label: string }[] = [
  { key: "xepc", label: "Contribució a la XEPC" },
  { key: "cgt", label: "Afiliació a Acció Sindical / CGT" },
  { key: "pahc", label: "Afiliació a la PAHC / COSHAC" },
  { key: "gimnas", label: "Afiliació al Gimnàs la Ruda" },
];
