import { redirect } from "next/navigation";

/** Ruta antiga: ara l'alta de la quota unificada és a /proposta-3/alta. */
export default async function OldAlta({ searchParams }: PageProps<"/alta">) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(await searchParams)) if (typeof v === "string") params.set(k, v);
  redirect(`/proposta-3/alta?${params}`);
}
