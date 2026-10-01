/**
 * Informació de protecció de dades de l'alta.
 *
 * Un sol text unificat per a totes les organitzacions on la persona s'afilia
 * amb aquesta quota. Hi ha 4 versions segons el que ja tingui:
 *
 *   - xepc+coshac+cgt  → no està afiliada a cap
 *   - xepc+cgt         → ja està a la PAHC/COSHAC
 *   - xepc+coshac      → ja està a la CGT
 *   - xepc             → ja està a totes dues
 *
 * Basat en els textos actuals de la COSHAC i de la CGT de Catalunya.
 * TODO: revisió legal; completar NIF i contacte de la XEPC i contacte de la COSHAC.
 */

export type LegalBlock = { heading: string; body: string };
export type LegalVersionKey = "xepc+coshac+cgt" | "xepc+cgt" | "xepc+coshac" | "xepc";
export type LegalVersion = { key: LegalVersionKey; blocks: LegalBlock[] };

/* ----------------------------- Peces comunes ------------------------------ */

const NORMATIVA =
  "el Reglament (UE) 2016/679 del Parlament Europeu i del Consell, de 27 d'abril de 2016 (GDPR), i la Llei orgànica 3/2018, de 5 de desembre, de Protecció de Dades Personals i garantia dels drets digitals";

const XEPC = "la Xarxa d'Estructures Populars i Comunitàries de Manresa (XEPC) [NIF i adreça pendents]";
const COSHAC = "la Confederació Sindical d'Habitatge de Catalunya (COSHAC), a la qual pertany la PAHC Bages [NIF i adreça pendents]";
const CGT = "el Comitè Confederal de la CGT de Catalunya (CGT Catalunya, NIF G58059262, C/ Burgos 59 baixos, 08014 Barcelona)";

const CONTACTE_XEPC = "XEPC: [correu de contacte pendent]";
const CONTACTE_COSHAC = "COSHAC: [correu de contacte pendent]";
const CONTACTE_CGT =
  "CGT Catalunya: basedades@cgtcatalunya.cat, C/ Burgos 59 baixos, 08014 Barcelona, tel. 93 512 04 81, de manera escrita o presencial i mitjançant identificació personal fefaent";

const FINALITAT_XEPC =
  "gestionar la teva quota i la teva participació a la XEPC, el cobrament domiciliat de les aportacions i l'enviament d'informació sobre les activitats de la xarxa";
const FINALITAT_COSHAC =
  "gestionar la teva afiliació a la PAHC Bages i a la COSHAC i informar-te de les seves assemblees, campanyes i activitats";
const FINALITAT_CGT =
  "gestionar la teva afiliació al sindicat, l'enviament de publicacions i informacions periòdiques sobre les activitats de la CGT, l'elaboració d'estadístiques i la prestació de serveis. Si exerceixes tasques de representació col·lectiva, la CGT tractarà les teves dades per a la realització i seguiment d'activitats sindicals emparades en la legislació vigent";

const CESSIONS_CGT =
  "Mitjançant aquesta sol·licitud atorgues consentiment explícit perquè el Sindicat CGT de Catalunya cedeixi les teves dades a: 1) el Comitè Confederal de la CGT d'Espanya, C/ Sagunto 15 1r, 28010 Madrid; 2) els serveis jurídics del sindicat, les dades imprescindibles per identificar la persona afiliada i comprovar que l'afiliació està al dia; 3) l'entitat bancària col·laboradora de la Responsable del Tractament, les dades imprescindibles per al cobrament de les quotes d'afiliació domiciliades.";

const BASE_LEGAL: LegalBlock = {
  heading: "Base legal",
  body: "El teu consentiment i la relació d'afiliació que estableixes amb aquesta sol·licitud.",
};

const CONSERVACIO: LegalBlock = {
  heading: "Conservació",
  body: "Les dades es conservaran mentre mantinguis l'afiliació i, un cop finalitzada, durant els terminis legalment exigibles.",
};

const drets = (contactes: string[]): LegalBlock => ({
  heading: "Drets",
  body: `En qualsevol moment pots exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat adreçant-te a ${
    contactes.length > 1 ? "qualsevol de les organitzacions responsables" : "l'organització responsable"
  }: ${contactes.join("; ")}. També pots presentar una reclamació davant l'Autoritat Catalana de Protecció de Dades (apdcat.gencat.cat).`,
});

/* ------------------------------- 4 versions ------------------------------- */

export const LEGAL_VERSIONS: Record<LegalVersionKey, LegalVersion> = {
  "xepc+coshac+cgt": {
    key: "xepc+coshac+cgt",
    blocks: [
      {
        heading: "Responsables del tractament",
        body: `D'acord amb ${NORMATIVA}, t'informem que les dades personals que ens facilites seran tractades, cadascuna en l'àmbit de la seva afiliació, per ${XEPC}; per ${COSHAC}; i per ${CGT}.`,
      },
      {
        heading: "Finalitats",
        body: `XEPC: ${FINALITAT_XEPC}. COSHAC: ${FINALITAT_COSHAC}. CGT: ${FINALITAT_CGT}.`,
      },
      BASE_LEGAL,
      {
        heading: "Comunicació de dades",
        body: `La XEPC comunicarà a la COSHAC i a la CGT només les dades necessàries per gestionar-ne l'afiliació, i a l'entitat bancària les necessàries per al cobrament de la quota. ${CESSIONS_CGT}`,
      },
      CONSERVACIO,
      drets([CONTACTE_XEPC, CONTACTE_COSHAC, CONTACTE_CGT]),
    ],
  },

  "xepc+cgt": {
    key: "xepc+cgt",
    blocks: [
      {
        heading: "Responsables del tractament",
        body: `D'acord amb ${NORMATIVA}, t'informem que les dades personals que ens facilites seran tractades, cadascuna en l'àmbit de la seva afiliació, per ${XEPC} i per ${CGT}.`,
      },
      {
        heading: "Finalitats",
        body: `XEPC: ${FINALITAT_XEPC}. CGT: ${FINALITAT_CGT}.`,
      },
      BASE_LEGAL,
      {
        heading: "Comunicació de dades",
        body: `La XEPC comunicarà a la CGT només les dades necessàries per gestionar-ne l'afiliació, i a l'entitat bancària les necessàries per al cobrament de la quota. ${CESSIONS_CGT}`,
      },
      CONSERVACIO,
      drets([CONTACTE_XEPC, CONTACTE_CGT]),
    ],
  },

  "xepc+coshac": {
    key: "xepc+coshac",
    blocks: [
      {
        heading: "Responsables del tractament",
        body: `D'acord amb ${NORMATIVA}, t'informem que les dades personals que ens facilites seran tractades, cadascuna en l'àmbit de la seva afiliació, per ${XEPC} i per ${COSHAC}.`,
      },
      {
        heading: "Finalitats",
        body: `XEPC: ${FINALITAT_XEPC}. COSHAC: ${FINALITAT_COSHAC}.`,
      },
      BASE_LEGAL,
      {
        heading: "Comunicació de dades",
        body: "La XEPC comunicarà a la COSHAC només les dades necessàries per gestionar-ne l'afiliació, i a l'entitat bancària les necessàries per al cobrament de la quota. No es cediran dades a tercers fora d'aquests casos, llevat d'obligació legal.",
      },
      CONSERVACIO,
      drets([CONTACTE_XEPC, CONTACTE_COSHAC]),
    ],
  },

  xepc: {
    key: "xepc",
    blocks: [
      {
        heading: "Responsable del tractament",
        body: `D'acord amb ${NORMATIVA}, t'informem que les dades personals que ens facilites seran tractades per ${XEPC}.`,
      },
      {
        heading: "Finalitat",
        body: `${FINALITAT_XEPC.charAt(0).toUpperCase()}${FINALITAT_XEPC.slice(1)}.`,
      },
      BASE_LEGAL,
      {
        heading: "Comunicació de dades",
        body: "Les dades només es comunicaran a l'entitat bancària per al cobrament de la quota. No es cediran dades a tercers fora d'aquest cas, llevat d'obligació legal.",
      },
      CONSERVACIO,
      drets([CONTACTE_XEPC]),
    ],
  },
};

/** Versió aplicable segons les organitzacions on ja s'està afiliada. */
export function legalVersionFor(excluded: readonly string[]): LegalVersion {
  const coshac = !excluded.includes("pahc");
  const cgt = !excluded.includes("cgt");
  if (coshac && cgt) return LEGAL_VERSIONS["xepc+coshac+cgt"];
  if (cgt) return LEGAL_VERSIONS["xepc+cgt"];
  if (coshac) return LEGAL_VERSIONS["xepc+coshac"];
  return LEGAL_VERSIONS.xepc;
}
