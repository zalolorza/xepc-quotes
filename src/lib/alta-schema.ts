import { z } from "zod";

import { SECTORS } from "@/lib/sectors";
import { FREQUENCIES, TIERS, type OrgKey } from "@/lib/quotes";
import { isValidDni, isValidIban, isValidPostalCode } from "@/lib/validators";

const required = (message: string) => z.string().trim().min(1, message);

/**
 * Adreça opcional: si es deixa tota en blanc és vàlida; si es comença a omplir,
 * cal completar-la i validar-la.
 */
export const addressSchema = z
  .object({
    carrer: z.string().trim(),
    pisPorta: z.string().trim().optional(),
    codiPostal: z.string().trim(),
    poblacio: z.string().trim(),
    provincia: z.string().trim(),
    /** Adreça normalitzada retornada per la validació. */
    formatted: z.string().optional(),
    validated: z.boolean(),
  })
  .superRefine((a, ctx) => {
    const filled = [a.carrer, a.pisPorta, a.codiPostal, a.poblacio, a.provincia].some(Boolean);
    if (!filled) return;
    const issue = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (!a.carrer) issue("carrer", "Indica el carrer i el número");
    if (!a.codiPostal) issue("codiPostal", "Indica el codi postal");
    else if (!isValidPostalCode(a.codiPostal)) issue("codiPostal", "Codi postal no vàlid");
    if (!a.poblacio) issue("poblacio", "Indica la població");
    if (!a.provincia) issue("provincia", "Indica la província");
    if (!a.validated) issue("validated", "Valida l'adreça o deixa-la en blanc");
  });

/** L'adreça té alguna dada (si no, no es desa). */
export function hasAddress(a?: Partial<z.infer<typeof addressSchema>>): boolean {
  return Boolean(a && [a.carrer, a.pisPorta, a.codiPostal, a.poblacio, a.provincia].some(Boolean));
}

export type AddressValues = z.infer<typeof addressSchema>;

export const quotaSchema = z.object({
  tier: z.enum(TIERS.map((t) => t.key) as [string, ...string[]]),
  frequency: z.enum(FREQUENCIES.map((f) => f.key) as [string, ...string[]]),
  excluded: z.array(z.enum(["gimnas", "pahc", "cgt"])),
});

const sectorSchema = z.enum(SECTORS.map((s) => s.value) as [string, ...string[]], {
  error: "Tria un sector laboral",
});

/** Camp que no es demana: s'ignora el que arribi. */
const skipped = z.unknown().optional().transform(() => undefined);

const baseFields = {
  quota: quotaSchema,
  nom: required("Indica el teu nom"),
  cognoms: required("Indica els teus cognoms"),
  /** Opcional; si s'omple, ha de ser vàlid. */
  dni: z
    .string()
    .trim()
    .refine((v) => !v || isValidDni(v), "DNI/NIE no vàlid (revisa la lletra)"),
  iban: required("Indica l'IBAN").refine(isValidIban, "IBAN no vàlid"),
  mandatSepa: z.boolean().refine((v) => v, "Cal autoritzar la domiciliació"),
  privacitat: z.boolean().refine((v) => v, "Cal acceptar la política de privacitat"),
};

/** Quins camps (opcionals) es mostren segons les organitzacions on ja s'està afiliada. */
export function requiredSections(excluded: readonly string[]) {
  return {
    // L'adreça la necessita la PAHC/COSHAC; si ja hi ets afiliada, ja la tenen.
    adreca: !excluded.includes("pahc"),
    // El sector laboral el necessita la CGT; si ja hi ets afiliada, ja el tenen.
    sector: !excluded.includes("cgt"),
    // Si es descompta una part, cal el número d'afiliació per comprovar-ho.
    numCoshac: excluded.includes("pahc"),
    numCgt: excluded.includes("cgt"),
  };
}

/** Esquema de l'alta adaptat a la quota triada (client i servidor). */
export function altaSchemaFor(excluded: readonly string[]) {
  const needs = requiredSections(excluded);
  return z.object({
    ...baseFields,
    adreca: needs.adreca ? addressSchema : skipped,
    sector: needs.sector ? sectorSchema.optional() : skipped,
    numCoshac: needs.numCoshac ? required("Indica el teu número d'afiliació a la COSHAC/PAHC") : skipped,
    numCgt: needs.numCgt ? required("Indica el teu número d'afiliació a la CGT") : skipped,
  });
}

/** Forma completa (tots els camps opcionals) per tipar el formulari. */
export const altaSchema = z.object({
  ...baseFields,
  adreca: addressSchema.optional(),
  sector: sectorSchema.optional(),
  numCoshac: z.string().optional(),
  numCgt: z.string().optional(),
});

export type AltaValues = z.infer<typeof altaSchema>;

/** Paràmetres de cerca → selecció de quota (o null si no són vàlids). */
export function parseQuotaParams(params: {
  quota?: string | string[];
  freq?: string | string[];
  orgs?: string | string[];
}): { tier: string; frequency: string; excluded: Exclude<OrgKey, "xepc">[] } | null {
  const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
  const orgs = first(params.orgs);
  const parsed = quotaSchema.safeParse({
    tier: first(params.quota),
    frequency: first(params.freq) ?? "mensual",
    excluded: orgs ? orgs.split(",").filter(Boolean) : [],
  });
  return parsed.success ? parsed.data : null;
}

export function quotaHref(tier: string, frequency: string, excluded: string[] = []): string {
  const params = new URLSearchParams({ quota: tier, freq: frequency });
  if (excluded.length) params.set("orgs", excluded.join(","));
  return `/alta?${params}`;
}
