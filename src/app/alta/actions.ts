"use server";

import { redirect } from "next/navigation";

import { altaSchemaFor, hasAddress, quotaSchema } from "@/lib/alta-schema";
import { normalizeDni, normalizeIban } from "@/lib/validators";

export type AltaActionResult = { ok: false; message: string };

/**
 * Alta d'afiliació — MOCK.
 * TODO: desar a la base de dades / CRM i generar el mandat SEPA.
 * Nota: la validació de l'adreça es fa al client; el servidor només
 * comprova que s'hagi marcat com a validada.
 */
export async function submitAlta(input: unknown): Promise<AltaActionResult> {
  // Primer la quota: determina quins camps són obligatoris.
  const quota = quotaSchema.safeParse((input as { quota?: unknown } | null)?.quota);
  if (!quota.success) {
    return { ok: false, message: "La quota triada no és vàlida." };
  }

  const parsed = altaSchemaFor(quota.data.excluded).safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Hi ha camps incorrectes. Revisa el formulari." };
  }

  const data = {
    ...parsed.data,
    dni: parsed.data.dni ? normalizeDni(parsed.data.dni) : undefined,
    // Adreça en blanc → no es desa.
    adreca: hasAddress(parsed.data.adreca) ? parsed.data.adreca : undefined,
    iban: normalizeIban(parsed.data.iban),
  };

  // Simula la latència d'un backend real.
  await new Promise((r) => setTimeout(r, 800));

  // No registrem dades personals completes als logs.
  console.info("[mock] Nova alta", {
    quota: data.quota,
    sector: data.sector,
    poblacio: data.adreca?.poblacio,
    iban: `${data.iban.slice(0, 4)}…${data.iban.slice(-4)}`,
  });

  const params = new URLSearchParams({ quota: data.quota.tier, freq: data.quota.frequency });
  if (data.quota.excluded.length) params.set("orgs", data.quota.excluded.join(","));
  redirect(`/gracies?${params}`);
}
