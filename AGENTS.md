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

## The 4 proposals (debate mockup)

This app is a mockup to debate how XEPC fees should work. `/` explains 4 proposals and links to each flow. All proposals share the sign-up form (`AltaView` → `AltaForm`) and `/gracies`.

| # | Route | Flow | Plan `kind` |
|---|---|---|---|
| 1 | `/proposta-1` | XEPC amount (3/5/10/20 or custom > 20 €/month) + optional add-on fees for PAHC/COSHAC, CGT and Gimnàs, summed in one payment | `integrada` |
| 2 | `/proposta-2` | XEPC amount only; external affiliation links (CGT, PAHC/COSHAC) shown AFTER the form, on `/gracies`. | `aportacio` |
| 3 | `/proposta-3` (+ `/ja-afiliada`) | Unified fee (precària/base/solidària) split across orgs, with deductions | `unificada` |
| 4 | `/proposta-4` | Choice: A `/proposta-4/aportacio` (= P1 without add-ons) or B `/proposta-4/afiliacio` (= P3) | `aportacio` / `unificada` |

- `src/lib/plans.ts` is the single source of truth: `PROPOSALS` (landing copy), `XEPC_AMOUNTS`, `ADDONS` (P1 add-on prices), `AFFILIATION_LINKS` (P2), the `Plan` zod union, URL helpers (`planToParams`, `planFromParams`, `altaHref`, `backHref`, `graciesHref`) and `planNeeds` / `planJoins`.
- Every plan has a `frequency` (mensual/trimestral/anual, `freq` URL param). The alta page (`AltaView`, client) has `FrequencyTabs` to change it in place; it updates the summary and the URL (`history.replaceState`), and `AltaForm` submits the current plan.
- Each flow's alta route is `${planBase(plan)}/alta`. `/gracies` gets `p` (proposal) and `k` (kind) params.
- Form sections depend on the plan (`planNeeds`): address if joining PAHC/COSHAC, sector if joining CGT, affiliation numbers only for P3 deductions. Legal text version from `planJoins`.
- Every alta form is wrapped in a `DemoOverlay` (mockup): a shortcut to `/gracies` so each flow can be tried without filling data, plus "Prefereixo omplir el formulari" to dismiss it. P2's copy mentions the affiliation links.
- Every proposal page has a `ProposalBanner` (via `proposta-N/layout.tsx`) linking back to `/`.
- Old routes `/alta` and `/ja-afiliada` only redirect to `/proposta-3/...`. `submitAlta` still lives in `src/app/alta/actions.ts`.

## Structure

```
src/
  app/
    page.tsx                  # "/" landing: 4 proposal cards + comparison table
    proposta-1/ …             # P1 selector + /alta
    proposta-2/ …             # P2 selector + /alta
    proposta-3/ …             # P3 landing, /ja-afiliada, /alta
    proposta-4/ …             # P4 choice, /aportacio(/alta), /afiliacio(/ja-afiliada, /alta)
    alta/actions.ts           # submitAlta server action (MOCK: validates plan + form, redirects to /gracies)
    gracies/page.tsx          # thank-you page for every proposal
  components/
    flows/                    # per-proposal UI: xepc-amount-picker, integrated-flow (P1), aportacio-flow (P2/P4A),
                              # unified-landing + affiliated-page (P3/P4B), continue-bar, xepc-header
    alta-view.tsx             # shared alta page (back link, summary, form)
    plan-summary.tsx          # summary of any plan (P3 uses quota-summary.tsx)
    proposal-banner.tsx       # sticky "Proposta N" bar
    benefits.tsx              # benefits list with org logos + info Dialog
    pricing-selector.tsx      # P3 frequency tabs + 3 tier cards
    alta-form.tsx             # react-hook-form + zod; sections from planNeeds(plan)
    address-fields.tsx        # "Carrer i número" = Google autocomplete combobox; auto-validates on pause/blur
    affiliated-flow.tsx       # P3 org checkboxes -> PricingSelector with `excluded`
    ui/                       # shadcn components
  lib/
    plans.ts                  # proposals, plans, URL helpers (see above)
    quotes.ts                 # P3 tiers, splits, frequencies, formatEuro
    alta-schema.ts            # zod form schema; altaSchemaFor(planNeeds(plan))
    validators.ts             # DNI/NIE, IBAN, postal code
    sectors.ts                # labor sector options
    google-maps.ts / address.ts  # same Google APIs as coshac-base-dades
    legal.ts                  # data-protection text, 4 versions chosen by planJoins(plan)
```

## Pricing rules — proposal 3 (`src/lib/quotes.ts`)

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

## Sign-up form (`…/alta`, all proposals)

- The plan travels in the URL (see `planToParams`); `planFromParams` validates it and each alta route redirects to the flow start if invalid. Never put personal data in URLs.
- Conditional sections (`planNeeds(plan)` in `plans.ts`):
  - Address is only requested if the person joins PAHC/COSHAC with this plan (P1 add-on, or P3/P4B without `pahc` deducted).
  - Labor sector is only requested if the person joins CGT with this plan.
  - Section numbers in the form are computed from the visible sections.
- Validation: `altaSchemaFor(planNeeds(plan))` (zod) runs on the client via `zodResolver` and again in `submitAlta` (which parses `plan` first to know which fields are required; skipped fields are discarded). `altaSchema` is the all-optional shape used only for typing the form.
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
- P1: the Gimnàs la Ruda is not covered by the legal texts; P2/P4: confirm affiliation links and whether Gimnàs needs one.
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
