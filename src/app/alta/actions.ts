"use server";

import { redirect } from "next/navigation";

import { altaSchemaFor, hasAddress } from "@/lib/alta-schema";
import { graciesHref, planNeeds, planSchema } from "@/lib/plans";
import { normalizeDni, normalizeIban } from "@/lib/validators";

export type AltaActionResult = { ok: false; message: string };

/**
 * Alta (totes les propostes) — MOCK.
 * TODO: desar a la base de dades / CRM i generar el mandat SEPA.
 * Nota: la validació de l'adreça es fa al client; el servidor només
 * comprova que s'hagi marcat com a validada.
 */
export async function submitAlta(input: unknown): Promise<AltaActionResult> {
  // Primer el pla: determina quins camps cal demanar.
  const plan = planSchema.safeParse((input as { plan?: unknown } | null)?.plan);
  if (!plan.success) {
    return { ok: false, message: "La quota triada no és vàlida." };
  }

  const parsed = altaSchemaFor(planNeeds(plan.data)).safeParse(input);
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
    plan: data.plan,
    sector: data.sector,
    poblacio: data.adreca?.poblacio,
    iban: `${data.iban.slice(0, 4)}…${data.iban.slice(-4)}`,
  });

  redirect(graciesHref(data.plan));
}
