"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFormContext, useFormState, type UseFormRegisterReturn } from "react-hook-form";
import { CheckCircle2Icon, Loader2Icon, SearchIcon, TriangleAlertIcon } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { inputClass } from "@/components/form-styles";
import {
  searchAddresses,
  validateAddress,
  type AddressParts,
  type AddressSuggestion,
  type ValidationResult,
} from "@/lib/address";
import type { altaSchema } from "@/lib/alta-schema";
import { hasGoogleMaps } from "@/lib/google-maps";
import { isValidPostalCode } from "@/lib/validators";
import { cn } from "@/lib/utils";

type FormValues = z.input<typeof altaSchema>;

const PART_KEYS = ["carrer", "pisPorta", "codiPostal", "poblacio", "provincia"] as const;
type PartKey = (typeof PART_KEYS)[number];

/** Temps sense teclejar abans de validar automàticament. */
const VALIDATE_DEBOUNCE_MS = 800;

/** Hi ha prou dades per intentar validar? */
const canValidate = (p: Partial<AddressParts>) =>
  Boolean(p.carrer && p.codiPostal && isValidPostalCode(p.codiPostal) && p.poblacio && p.provincia);

const partsKey = (p: Partial<AddressParts>) =>
  [p.carrer, p.pisPorta, p.codiPostal, p.poblacio, p.provincia].map((v) => v?.trim() ?? "").join("|");

/**
 * Adreça (opcional). "Carrer i número" és el cercador de Google: en triar un
 * suggeriment s'omplen la resta de camps. L'adreça es valida automàticament
 * quan la persona deixa d'escriure o surt d'un camp.
 */
export function AddressFields() {
  const { register, setValue, getValues, control } = useFormContext<FormValues>();
  const { errors } = useFormState({ control, name: "adreca" });
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [validating, setValidating] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);
  /** Dades de l'última validació, per no repetir-la si no han canviat. */
  const lastKey = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  /** Qualsevol edició invalida la validació anterior. */
  const invalidate = () => {
    if (getValues("adreca.validated")) setValue("adreca.validated", false);
    setValue("adreca.formatted", "");
    lastKey.current = null;
    requestId.current++; // descarta validacions en curs
    setValidating(false);
    setResult(null);
  };

  /** Valida l'adreça actual (no fa res si està incompleta o ja s'ha validat igual). */
  const runValidation = async () => {
    if (timer.current) clearTimeout(timer.current);
    const parts = getValues("adreca") as AddressParts;
    if (!canValidate(parts)) return;
    const key = partsKey(parts);
    if (key === lastKey.current) return;
    lastKey.current = key;

    const id = ++requestId.current;
    setValidating(true);
    try {
      const res = await validateAddress(parts);
      if (id !== requestId.current) return; // la persona ha seguit escrivint
      setResult(res);
      if (res.status !== "invalid") {
        for (const [k, value] of Object.entries(res.corrected)) {
          setValue(`adreca.${k as keyof AddressParts}`, value, { shouldValidate: true });
        }
        setValue("adreca.formatted", res.formatted);
        lastKey.current = partsKey(getValues("adreca") as AddressParts);
      }
      if (res.status === "confirmed") {
        setValue("adreca.validated", true, { shouldValidate: true });
      }
    } catch (error) {
      console.error(error);
      if (id !== requestId.current) return;
      lastKey.current = null; // permet tornar-ho a provar
      setResult({ status: "invalid", message: "El servei de validació no respon. Torna-ho a provar." });
    } finally {
      if (id === requestId.current) setValidating(false);
    }
  };

  /** En escriure: invalida i programa la validació quan es deixi d'escriure. */
  const handleEdit = () => {
    invalidate();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runValidation(), VALIDATE_DEBOUNCE_MS);
  };

  /** En sortir d'un camp: valida de seguida. */
  const handleLeave = () => void runValidation();

  const applySuggestion = async (suggestion: AddressSuggestion) => {
    const parts = await suggestion.resolve();
    for (const key of PART_KEYS) {
      if (key === "pisPorta") continue; // es manté el que hagi escrit la persona
      setValue(`adreca.${key}`, parts[key] ?? "", { shouldValidate: true });
    }
    invalidate();
    await runValidation();
  };

  const confirmUnconfirmed = () => {
    setValue("adreca.validated", true, { shouldValidate: true });
    setResult((r) => (r && r.status === "unconfirmed" ? { ...r, status: "confirmed" } : r));
  };

  const adreca = errors.adreca;
  const reg = (key: PartKey) => register(`adreca.${key}`);

  return (
    <FieldGroup className="gap-4">
      <div className="grid gap-4 sm:grid-cols-6">
        <Field className="sm:col-span-4" data-invalid={!!adreca?.carrer}>
          <FieldLabel htmlFor="carrer">Carrer i número</FieldLabel>
          <StreetSearch
            registration={reg("carrer")}
            invalid={!!adreca?.carrer}
            onEdit={handleEdit}
            onLeave={handleLeave}
            onSelect={applySuggestion}
          />
          <FieldDescription className="font-mono text-xs">
            {hasGoogleMaps
              ? "Escriu i tria la teva adreça de la llista per omplir la resta de camps."
              : "Mode de prova: falta NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, s'usen adreces d'exemple."}
          </FieldDescription>
          <FieldError errors={[adreca?.carrer]} />
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="pisPorta">Pis i porta</FieldLabel>
          <AddressInput id="pisPorta" autoComplete="address-line2" placeholder="2n 1a" registration={reg("pisPorta")} onEdit={handleEdit} onLeave={handleLeave} />
        </Field>
        <Field className="sm:col-span-2" data-invalid={!!adreca?.codiPostal}>
          <FieldLabel htmlFor="codiPostal">Codi postal</FieldLabel>
          <AddressInput id="codiPostal" inputMode="numeric" autoComplete="postal-code" maxLength={5} invalid={!!adreca?.codiPostal} registration={reg("codiPostal")} onEdit={handleEdit} onLeave={handleLeave} />
          <FieldError errors={[adreca?.codiPostal]} />
        </Field>
        <Field className="sm:col-span-2" data-invalid={!!adreca?.poblacio}>
          <FieldLabel htmlFor="poblacio">Població</FieldLabel>
          <AddressInput id="poblacio" autoComplete="address-level2" invalid={!!adreca?.poblacio} registration={reg("poblacio")} onEdit={handleEdit} onLeave={handleLeave} />
          <FieldError errors={[adreca?.poblacio]} />
        </Field>
        <Field className="sm:col-span-2" data-invalid={!!adreca?.provincia}>
          <FieldLabel htmlFor="provincia">Província</FieldLabel>
          <AddressInput id="provincia" autoComplete="address-level1" invalid={!!adreca?.provincia} registration={reg("provincia")} onEdit={handleEdit} onLeave={handleLeave} />
          <FieldError errors={[adreca?.provincia]} />
        </Field>
      </div>

      {validating ? (
        <p role="status" className="flex items-center gap-2 font-mono text-sm">
          <Loader2Icon className="size-4 animate-spin" /> Validant l&rsquo;adreça…
        </p>
      ) : (
        <ValidationStatus result={result} onConfirm={confirmUnconfirmed} />
      )}
      {!result && !validating && adreca?.validated && (
        <p role="alert" className="font-mono text-sm text-destructive">
          {adreca.validated.message}
        </p>
      )}
    </FieldGroup>
  );
}

type FieldHandlers = {
  registration: UseFormRegisterReturn;
  invalid?: boolean;
  onEdit: () => void;
  onLeave: () => void;
};

/** Input d'adreça connectat a react-hook-form amb validació en escriure/sortir. */
function AddressInput({
  registration,
  invalid,
  onEdit,
  onLeave,
  ...props
}: FieldHandlers & Omit<React.ComponentProps<"input">, "onChange" | "onBlur" | "name" | "ref">) {
  return (
    <Input
      {...props}
      {...registration}
      aria-invalid={invalid}
      className={inputClass}
      onChange={(e) => {
        void registration.onChange(e);
        onEdit();
      }}
      onBlur={(e) => {
        void registration.onBlur(e);
        onLeave();
      }}
    />
  );
}

function ValidationStatus({ result, onConfirm }: { result: ValidationResult | null; onConfirm: () => void }) {
  if (!result) return null;
  const tone = {
    confirmed: "border-black bg-xepc-blue",
    unconfirmed: "border-black bg-xepc-orange",
    invalid: "border-destructive bg-white text-destructive",
  }[result.status];

  return (
    <div role="status" className={cn("flex items-start gap-3 rounded-3xl border px-4 py-3 font-mono text-sm", tone)}>
      {result.status === "confirmed" ? (
        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
      ) : (
        <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
      )}
      <div className="flex flex-col gap-2">
        {result.status === "confirmed" && (
          <p>
            <strong>Adreça validada:</strong> {result.formatted}
          </p>
        )}
        {result.status === "unconfirmed" && (
          <>
            <p>{result.message}</p>
            <p className="font-medium">{result.formatted}</p>
            <Button type="button" size="sm" onClick={onConfirm} className="w-fit rounded-full px-4">
              Sí, és correcta
            </Button>
          </>
        )}
        {result.status === "invalid" && <p>{result.message}</p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* "Carrer i número" amb autocompletat de Google (combobox accessible)         */
/* -------------------------------------------------------------------------- */

function StreetSearch({
  registration,
  invalid,
  onEdit,
  onLeave,
  onSelect,
}: FieldHandlers & { onSelect: (s: AddressSuggestion) => Promise<void> }) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    if (query.trim().length < 3) return; // la llista no es mostra sota 3 caràcters
    const id = ++requestId.current;
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchAddresses(query);
        if (id === requestId.current) {
          setSuggestions(results);
          setActive(-1);
        }
      } catch (error) {
        console.error(error);
        if (id === requestId.current) setSuggestions([]);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const choose = async (s: AddressSuggestion) => {
    setOpen(false);
    setQuery("");
    await onSelect(s);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      void choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && query.trim().length >= 3;

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
      <Input
        id="carrer"
        {...registration}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid}
        autoComplete="off"
        spellCheck={false}
        placeholder="Comença a escriure el carrer…"
        className={cn(inputClass, "pl-10")}
        onChange={(e) => {
          void registration.onChange(e);
          setQuery(e.target.value);
          setOpen(true);
          onEdit();
        }}
        onBlur={(e) => {
          void registration.onBlur(e);
          setOpen(false);
          onLeave();
        }}
        onKeyDown={onKeyDown}
      />
      {loading && <Loader2Icon className="absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin" />}
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border border-black bg-white py-2 shadow-[4px_4px_0_0_#000]"
        >
          {suggestions.length === 0 && !loading && (
            <li className="px-5 py-2 font-mono text-sm text-black/60">Cap resultat. Pots omplir-la a mà.</li>
          )}
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // Evita el blur de l'input abans del clic
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => void choose(s)}
              onMouseEnter={() => setActive(i)}
              className={cn("cursor-pointer px-5 py-2 font-mono text-sm", i === active && "bg-xepc-blue")}
            >
              <span className="font-medium">{s.main}</span>
              {s.secondary && <span className="text-black/60"> · {s.secondary}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
