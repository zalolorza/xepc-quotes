"use client";

import { hasGoogleMaps, loadGeocoding, loadPlaces } from "@/lib/google-maps";
import { isValidPostalCode } from "@/lib/validators";

export type AddressParts = {
  carrer: string;
  pisPorta?: string;
  codiPostal: string;
  poblacio: string;
  provincia: string;
};

export type AddressSuggestion = {
  id: string;
  main: string;
  secondary: string;
  /** Obté els components de l'adreça triada. */
  resolve: () => Promise<AddressParts>;
};

export type ValidationResult =
  | { status: "confirmed"; formatted: string; corrected: Partial<AddressParts> }
  | { status: "unconfirmed"; formatted: string; corrected: Partial<AddressParts>; message: string }
  | { status: "invalid"; message: string };

/* -------------------------------------------------------------------------- */
/* Autocompletat (Places API clàssica)                                        */
/* -------------------------------------------------------------------------- */

let sessionToken: google.maps.places.AutocompleteSessionToken | null = null;

export async function searchAddresses(input: string): Promise<AddressSuggestion[]> {
  if (input.trim().length < 3) return [];
  if (!hasGoogleMaps) return mockSearch(input);

  const { AutocompleteService, AutocompleteSessionToken } = await loadPlaces();
  sessionToken ??= new AutocompleteSessionToken();

  const { predictions } = await new AutocompleteService().getPlacePredictions({
    input,
    sessionToken,
    componentRestrictions: { country: "es" },
    types: ["address"],
    language: "ca",
  });

  return predictions.map((p) => ({
    id: p.place_id,
    main: p.structured_formatting.main_text,
    secondary: p.structured_formatting.secondary_text ?? "",
    resolve: async () => {
      sessionToken = null; // la sessió acaba en triar un suggeriment
      const { results } = await geocode({ placeId: p.place_id });
      if (!results[0]) throw new Error("No s'han trobat els detalls de l'adreça");
      return fromComponents(results[0].address_components);
    },
  }));
}

/* -------------------------------------------------------------------------- */
/* Validació (Geocoding API)                                                  */
/* -------------------------------------------------------------------------- */

/** Tipus de resultat que indiquen una adreça concreta (carrer + número). */
const PRECISE_TYPES = ["street_address", "premise", "subpremise"];

export async function validateAddress(parts: AddressParts): Promise<ValidationResult> {
  if (!hasGoogleMaps) return mockValidate(parts);

  const address = `${parts.carrer}, ${parts.codiPostal} ${parts.poblacio}, ${parts.provincia}, Espanya`;

  let results: google.maps.GeocoderResult[];
  try {
    ({ results } = await geocode({ address, componentRestrictions: { country: "ES" } }));
  } catch (error) {
    // ZERO_RESULTS arriba com a error
    const code = (error as { code?: string } | null)?.code;
    if (code === "ZERO_RESULTS" || String(error).includes("ZERO_RESULTS")) {
      return { status: "invalid", message: "No hem trobat aquesta adreça. Revisa el carrer, el número i el codi postal." };
    }
    throw error;
  }

  const result = results[0];
  if (!result) {
    return { status: "invalid", message: "No hem trobat aquesta adreça. Revisa el carrer, el número i el codi postal." };
  }

  const found = fromComponents(result.address_components);
  if (!found.carrer) {
    return { status: "invalid", message: "No hem trobat el carrer. Revisa'l i torna-ho a provar." };
  }

  // Afegim el pis/porta a l'adreça normalitzada (Google no el retorna).
  const formatted = parts.pisPorta
    ? result.formatted_address.replace(found.carrer, `${found.carrer}, ${parts.pisPorta}`)
    : result.formatted_address;

  // El carrer no es corregeix (respectem el que ha escrit la persona); sí CP, població i província.
  const corrected: Partial<AddressParts> = {
    ...(found.codiPostal ? { codiPostal: found.codiPostal } : {}),
    ...(found.poblacio ? { poblacio: found.poblacio } : {}),
    ...(found.provincia ? { provincia: found.provincia } : {}),
  };

  const precise =
    !result.partial_match &&
    result.types.some((t) => PRECISE_TYPES.includes(t)) &&
    result.geometry.location_type === "ROOFTOP";

  if (precise) return { status: "confirmed", formatted, corrected };

  return {
    status: "unconfirmed",
    formatted,
    corrected,
    message: "No hem pogut confirmar del tot l'adreça (potser el número). És correcta?",
  };
}

async function geocode(request: google.maps.GeocoderRequest) {
  const { Geocoder } = await loadGeocoding();
  return new Geocoder().geocode({ language: "ca", region: "es", ...request });
}

function fromComponents(components: google.maps.GeocoderAddressComponent[]): AddressParts {
  const get = (type: string) => components.find((c) => c.types.includes(type))?.long_name ?? "";
  const route = get("route");
  const number = get("street_number");
  return {
    carrer: route ? [route, number].filter(Boolean).join(", ") : "",
    codiPostal: get("postal_code"),
    poblacio: get("locality") || get("postal_town") || get("administrative_area_level_3"),
    // A Espanya, administrative_area_level_2 és la província.
    provincia: get("administrative_area_level_2") || get("administrative_area_level_1"),
  };
}

/* -------------------------------------------------------------------------- */
/* Mode de prova (sense NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)                      */
/* -------------------------------------------------------------------------- */

const MOCK_ADDRESSES: AddressParts[] = [
  { carrer: "Carrer del Born, 12", codiPostal: "08241", poblacio: "Manresa", provincia: "Barcelona" },
  { carrer: "Passeig de Pere III, 45", codiPostal: "08242", poblacio: "Manresa", provincia: "Barcelona" },
  { carrer: "Carrer de Sant Miquel, 3", codiPostal: "08241", poblacio: "Manresa", provincia: "Barcelona" },
  { carrer: "Carrer Major, 20", codiPostal: "08260", poblacio: "Súria", provincia: "Barcelona" },
];

async function mockSearch(input: string): Promise<AddressSuggestion[]> {
  await new Promise((r) => setTimeout(r, 150));
  const q = input.toLowerCase();
  return MOCK_ADDRESSES.filter((a) =>
    `${a.carrer} ${a.poblacio}`.toLowerCase().includes(q)
  ).map((a) => ({
    id: a.carrer,
    main: a.carrer,
    secondary: `${a.codiPostal} ${a.poblacio}, ${a.provincia}`,
    resolve: async () => a,
  }));
}

async function mockValidate(parts: AddressParts): Promise<ValidationResult> {
  await new Promise((r) => setTimeout(r, 400));
  if (!/\d/.test(parts.carrer)) {
    return { status: "invalid", message: "Falta el número del carrer." };
  }
  if (!isValidPostalCode(parts.codiPostal)) {
    return { status: "invalid", message: "El codi postal no és vàlid." };
  }
  if (!parts.poblacio || !parts.provincia) {
    return { status: "invalid", message: "Falta la població o la província." };
  }
  const formatted = [
    [parts.carrer, parts.pisPorta].filter(Boolean).join(", "),
    `${parts.codiPostal} ${parts.poblacio}`,
    parts.provincia,
  ].join(", ");
  return { status: "confirmed", formatted, corrected: {} };
}
