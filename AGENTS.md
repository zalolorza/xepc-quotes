<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# XEPC Quotes

Landing page where people choose a membership fee ("quota") for the XEPC (Xarxa d'Estructures Populars i Comunitàries de Manresa). One fee covers membership of several organisations: PAHC Bages/COSHAC, Acció Sindical Bages/CGT, Gimnàs Popular la Ruda and the XEPC itself.

## Stack

- Next.js 16 (App Router, `src/` dir, Turbopack), React 19, TypeScript strict
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`, no `tailwind.config`)
- shadcn/ui, style `base-nova`, built on **Base UI** (`@base-ui/react`), not Radix:
  - Compose with the `render` prop, not `asChild` (e.g. `<DialogTrigger render={<Button />} />`)
  - Tabs use `value` / `onValueChange`; active state is `data-active`
  - Add components with `npx shadcn@latest add <name>`; don't hand-edit `src/components/ui/*` unless necessary
- Icons: `lucide-react`
- `cn` comes from the `cn` package, re-exported from `@/lib/utils`

## Structure

```
src/
  app/
    layout.tsx            # fonts (Archivo, Roboto Mono), lang="ca"
    globals.css           # theme tokens + XEPC colours
    page.tsx              # "/" landing: title, benefits, pricing, link to second flow
    ja-afiliada/page.tsx  # "/ja-afiliada": already-affiliated flow
    alta/page.tsx         # "/alta?quota=&freq=&orgs=": sign-up form for the chosen quota
    alta/actions.ts       # submitAlta server action (MOCK: validates, logs, redirects)
    gracies/page.tsx      # "/gracies": thank-you page
  components/
    benefits.tsx          # benefits list with org logos (public/logos) + info Dialog (modal copy lives here)
    pricing-selector.tsx  # frequency tabs + 3 tier cards; each card links to /alta
    quota-summary.tsx     # chosen quota box (used in /alta and /gracies)
    alta-form.tsx         # react-hook-form + zod: personal data, address, sector, IBAN, consents
    address-fields.tsx    # "Carrer i número" = Google autocomplete combobox; auto-validates on pause/blur
    form-styles.ts        # shared input class
    affiliated-flow.tsx   # org checkboxes -> PricingSelector with `excluded`
    ui/                   # shadcn components
  lib/
    quotes.ts             # single source of truth for tiers, splits, frequencies, pricing
    alta-schema.ts        # zod schema shared by client and server action; quota URL helpers
    validators.ts         # DNI/NIE letter check, IBAN mod-97, postal code
    sectors.ts            # labor sector options
    google-maps.ts        # Maps JS API loader (@googlemaps/js-api-loader); same APIs as coshac-base-dades
    address.ts            # classic Places AutocompleteService + Geocoder validation (or mock without key)
    legal.ts              # unified data-protection text, 4 versions: xepc+coshac+cgt / xepc+cgt / xepc+coshac / xepc
```

## Pricing rules (`src/lib/quotes.ts`)

- Tiers (monthly): Precària 10 €, Base 20 €, Solidària 30 €.
- Each tier is split per org (`split: Record<OrgKey, number>`):
  - Precària: XEPC 1.16 / Gimnàs 1.5 / PAHC 1.5 / CGT 5.86
  - Bàsica: XEPC 3 / Gimnàs 5 / PAHC 5 / CGT 6.9
  - Solidària: XEPC 8.28 / Gimnàs 5 / PAHC 5 / CGT 11.72
- `monthlyPrice(tier, excluded)`: no exclusions → nominal price; with exclusions → **sum of the remaining parts** (the splits don't add up exactly to the nominal price for Precària and Bàsica, so this rule matters).
- Frequencies: mensual ×1, trimestral ×3, anual ×12. No discounts.
- Format money only with `formatEuro` (ca-ES; no decimals when the value is whole, otherwise 2).
- Change prices or splits in `quotes.ts` only; never hardcode amounts in components.

## Conventions

- All user-facing copy is in **Catalan**. Use the feminine generic as in the existing copy ("afiliada").
- Visual style matches the main XEPC site (`../xepc-2026`): `#ececec` background, black text and borders, pill shapes (`rounded-full` / `rounded-3xl`), Archivo for uppercase headings (`font-heading`), Roboto Mono for body (`font-mono`).
- Accent colours are Tailwind tokens: `bg-xepc-blue` (Precària), `bg-xepc-lilac` (Base), `bg-xepc-orange` (Solidària).
- Keep pages as server components; put interactivity in `"use client"` components under `src/components/`.

## Sign-up form (`/alta`)

- Quota selection travels in the URL (`quota`, `freq`, `orgs`); `parseQuotaParams` validates it and `/alta` redirects to `/` if invalid. Never put personal data in URLs.
- Conditional sections (`requiredSections(excluded)` in `alta-schema.ts`):
  - Address is only requested if the user is NOT already in PAHC/COSHAC (`pahc` not in `orgs`).
  - Labor sector is only requested if the user is NOT already in CGT (`cgt` not in `orgs`).
  - Section numbers in the form are computed from the visible sections.
- Validation: `altaSchemaFor(excluded)` (zod) runs on the client via `zodResolver` and again in `submitAlta` (which parses `quota` first to know which fields are required; skipped fields are discarded). `altaSchema` is the all-optional shape used only for typing the form.
- Required vs optional: nom, cognoms, IBAN and both consents are required. DNI/NIE, address and sector are optional (DNI validated only if filled; address must be complete + validated only if any field is filled).
- Affiliation numbers: if `pahc` is deducted → `numCoshac` required; if `cgt` is deducted → `numCgt` required ("Les teves afiliacions" section).
- Address uses the SAME Google APIs/key as `../coshac-base-dades` (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`): Maps JavaScript API, Places API (classic, `AutocompleteService`) and Geocoding API (`Geocoder`). Do NOT use Places API (New) or Address Validation API: they're not enabled on that project.
  - "Carrer i número" is the search box; picking a suggestion fills CP/població/província (place details via `Geocoder({ placeId })`).
  - Validation runs automatically 800 ms after typing stops and on blur, only when carrer + CP + població + província are filled. Confirmed = ROOFTOP + street_address/premise and no partial_match; otherwise "unconfirmed" with a "Sí, és correcta" button.
  - Any edit resets `adreca.validated`. Without the key, `address.ts` uses mock data (dev only).
- Base UI Checkbox puts `id` on a hidden input: target it via its label in tests.
- Links styled as buttons use `<Link className={buttonVariants()}>`, not `<Button render={<Link/>}>` (that gives the link `role="button"`).

## Pending

- `submitAlta` is a mock: persist to DB/CRM and generate the SEPA mandate.
- Address validation is client-side only; re-validate server-side once a server key exists.
- XEPC legal text in `legal.ts` is a placeholder: needs legal review and real contact details (NIF, address, email).
- Sector list (`sectors.ts`) to be reviewed with Acció Sindical / CGT.
- Modal texts in `benefits.tsx` are placeholders; to be reviewed by each organisation.

## Commands

```bash
npm run dev     # dev server
npm run build   # production build (also type-checks)
npm run lint
```

Verify with `npm run build` before finishing any change.
