"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Mateixes APIs que coshac-base-dades (mateixa clau):
 * - Maps JavaScript API
 * - Places API (clàssica): AutocompleteService per als suggeriments
 * - Geocoding API: detalls del suggeriment i validació de l'adreça
 *
 * Sense clau, el formulari funciona en mode de prova (sense Google).
 */
export const hasGoogleMaps = Boolean(API_KEY);

let configured = false;

function configure() {
  if (configured || !API_KEY) return;
  setOptions({ key: API_KEY, v: "weekly", language: "ca", region: "ES" });
  configured = true;
}

export async function loadPlaces() {
  configure();
  return importLibrary("places");
}

export async function loadGeocoding() {
  configure();
  return importLibrary("geocoding");
}
