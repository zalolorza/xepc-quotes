/** Validadors de documents i dades bancàries (client i servidor). */

const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

export function normalizeDni(value: string): string {
  return value.toUpperCase().replace(/[\s-]/g, "");
}

/** Valida DNI (12345678Z) i NIE (X1234567L) amb la lletra de control. */
export function isValidDni(raw: string): boolean {
  const value = normalizeDni(raw);
  const match = /^([XYZ]?)(\d{7,8})([A-Z])$/.exec(value);
  if (!match) return false;
  const [, prefix, digits, letter] = match;
  // DNI: 8 xifres sense prefix. NIE: prefix + 7 xifres.
  if (prefix ? digits.length !== 7 : digits.length !== 8) return false;
  const number = Number(`${prefix ? "XYZ".indexOf(prefix) : ""}${digits}`);
  return DNI_LETTERS[number % 23] === letter;
}

export function normalizeIban(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** ES91 2100 0418 4502 0005 1332 */
export function formatIban(value: string): string {
  return normalizeIban(value).replace(/(.{4})(?=.)/g, "$1 ");
}

const IBAN_LENGTHS: Record<string, number> = {
  ES: 24, AD: 24, FR: 27, PT: 25, DE: 22, IT: 27, BE: 16, NL: 18, IE: 22, LU: 20, AT: 20,
};

/** Validació ISO 13616 (mod 97). Llargada estricta per als països més habituals. */
export function isValidIban(raw: string): boolean {
  const iban = normalizeIban(raw);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) return false;
  const expected = IBAN_LENGTHS[iban.slice(0, 2)];
  if (expected && iban.length !== expected) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const n = char >= "A" ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of n) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder === 1;
}

/** Codi postal espanyol: 5 xifres, província 01–52. */
export function isValidPostalCode(value: string): boolean {
  if (!/^\d{5}$/.test(value)) return false;
  const province = Number(value.slice(0, 2));
  return province >= 1 && province <= 52;
}
