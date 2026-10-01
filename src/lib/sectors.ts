/** Sectors laborals per a la fitxa d'afiliació. TODO: revisar amb Acció Sindical / CGT. */
export const SECTORS = [
  { value: "administracio-publica", label: "Administració pública" },
  { value: "agricultura", label: "Agricultura i ramaderia" },
  { value: "arts-cultura", label: "Arts, cultura i espectacles" },
  { value: "banca", label: "Banca, finances i assegurances" },
  { value: "comerc", label: "Comerç" },
  { value: "construccio", label: "Construcció" },
  { value: "cures", label: "Cures i treball de la llar" },
  { value: "educacio", label: "Educació" },
  { value: "hostaleria", label: "Hostaleria i turisme" },
  { value: "industria", label: "Indústria i metall" },
  { value: "informatica", label: "Informàtica i telecomunicacions" },
  { value: "neteja", label: "Neteja" },
  { value: "sanitat", label: "Sanitat" },
  { value: "serveis-socials", label: "Serveis socials i tercer sector" },
  { value: "transport", label: "Transport i logística" },
  { value: "altres", label: "Altres sectors" },
  { value: "atur", label: "A l'atur" },
  { value: "estudiant", label: "Estudiant" },
  { value: "jubilada", label: "Jubilada / pensionista" },
] as const;

export type SectorValue = (typeof SECTORS)[number]["value"];
