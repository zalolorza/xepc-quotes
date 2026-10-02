"use client";

import { useMemo, useState, useTransition } from "react";
import { Controller, FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import type { z } from "zod";

import { submitAlta } from "@/app/alta/actions";
import { AddressFields } from "@/components/address-fields";
import { inputClass } from "@/components/form-styles";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { altaSchema, altaSchemaFor } from "@/lib/alta-schema";
import { legalVersionFor } from "@/lib/legal";
import { planJoins, planNeeds, type Plan } from "@/lib/plans";
import { SECTORS } from "@/lib/sectors";
import { formatIban } from "@/lib/validators";
import { cn } from "@/lib/utils";

type FormInput = z.input<typeof altaSchema>;
type FormOutput = z.output<typeof altaSchema>;

type AltaFormProps = {
  plan: Plan;
};

const legendClass = "mb-2 font-heading text-xl font-extrabold uppercase";

export function AltaForm({ plan }: AltaFormProps) {
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  // Seccions segons el pla: adreça si t'afilies a la PAHC/COSHAC, sector si a la CGT,
  // números d'afiliació si se'n descompta la part (proposta 3).
  const needs = useMemo(() => planNeeds(plan), [plan]);
  const joins = planJoins(plan);
  const resolver = useMemo(
    () => zodResolver(altaSchemaFor(needs)) as unknown as Resolver<FormInput, unknown, FormOutput>,
    [needs]
  );

  // Numeració de seccions segons les que es mostren.
  const sections = ["personal", (needs.numCoshac || needs.numCgt) && "afiliacions", needs.adreca && "adreca", needs.sector && "sector", "banc"].filter(Boolean);
  const n = (key: string) => `${sections.indexOf(key) + 1}.`;

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      plan,
      nom: "",
      cognoms: "",
      dni: "",
      numCoshac: needs.numCoshac ? "" : undefined,
      numCgt: needs.numCgt ? "" : undefined,
      adreca: needs.adreca
        ? {
            carrer: "",
            pisPorta: "",
            codiPostal: "",
            poblacio: "",
            provincia: "",
            formatted: "",
            validated: false,
          }
        : undefined,
      sector: undefined,
      iban: "",
      mandatSepa: false,
      privacitat: false,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (data: FormOutput) => {
    setServerError(null);
    startTransition(async () => {
      // Si va bé, l'acció redirigeix a /gracies.
      // El pla sempre és el de la prop (la periodicitat es pot canviar a la mateixa pàgina).
      const result = await submitAlta({ ...data, plan });
      if (result && !result.ok) setServerError(result.message);
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-12">
        {/* Dades personals */}
        <FieldSet>
          <FieldLegend className={legendClass}>{n("personal")} Dades personals</FieldLegend>
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.nom}>
              <FieldLabel htmlFor="nom">Nom</FieldLabel>
              <Input id="nom" autoComplete="given-name" className={inputClass} aria-invalid={!!errors.nom} {...register("nom")} />
              <FieldError errors={[errors.nom]} />
            </Field>
            <Field data-invalid={!!errors.cognoms}>
              <FieldLabel htmlFor="cognoms">Cognoms</FieldLabel>
              <Input id="cognoms" autoComplete="family-name" className={inputClass} aria-invalid={!!errors.cognoms} {...register("cognoms")} />
              <FieldError errors={[errors.cognoms]} />
            </Field>
            <Field data-invalid={!!errors.dni}>
              <FieldLabel htmlFor="dni">DNI / NIE <span className="font-mono text-xs font-normal normal-case text-black/60">(opcional)</span></FieldLabel>
              <Input
                id="dni"
                placeholder="12345678Z"
                autoCapitalize="characters"
                className={cn(inputClass, "uppercase")}
                aria-invalid={!!errors.dni}
                {...register("dni")}
              />
              <FieldError errors={[errors.dni]} />
            </Field>
          </FieldGroup>
        </FieldSet>

        {/* Afiliacions actuals (només si es descompta la part de COSHAC i/o CGT) */}
        {(needs.numCoshac || needs.numCgt) && (
          <FieldSet>
            <FieldLegend className={legendClass}>{n("afiliacions")} Les teves afiliacions</FieldLegend>
            <FieldDescription className="-mt-2 font-mono text-xs">
              Com que ja hi estàs afiliada, no et cobrarem aquesta part. Indica&rsquo;ns el número
              d&rsquo;afiliació perquè ho puguem comprovar.
            </FieldDescription>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              {needs.numCoshac && (
                <Field data-invalid={!!errors.numCoshac}>
                  <FieldLabel htmlFor="numCoshac">Número d&rsquo;afiliació COSHAC / PAHC</FieldLabel>
                  <Input id="numCoshac" autoComplete="off" className={inputClass} aria-invalid={!!errors.numCoshac} {...register("numCoshac")} />
                  <FieldError errors={[errors.numCoshac]} />
                </Field>
              )}
              {needs.numCgt && (
                <Field data-invalid={!!errors.numCgt}>
                  <FieldLabel htmlFor="numCgt">Número d&rsquo;afiliació CGT</FieldLabel>
                  <Input id="numCgt" autoComplete="off" className={inputClass} aria-invalid={!!errors.numCgt} {...register("numCgt")} />
                  <FieldError errors={[errors.numCgt]} />
                </Field>
              )}
            </FieldGroup>
          </FieldSet>
        )}

        {/* Adreça (no cal si ja s'està afiliada a la PAHC/COSHAC) */}
        {needs.adreca && (
          <FieldSet>
            <FieldLegend className={legendClass}>{n("adreca")} Adreça <span className="font-mono text-xs font-normal normal-case text-black/60">(opcional)</span></FieldLegend>
            <AddressFields />
          </FieldSet>
        )}

        {/* Sector laboral (no cal si ja s'està afiliada a la CGT) */}
        {needs.sector && (
          <FieldSet>
            <FieldLegend className={legendClass}>{n("sector")} Sector laboral <span className="font-mono text-xs font-normal normal-case text-black/60">(opcional)</span></FieldLegend>
            <Controller
              control={control}
              name="sector"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="sm:max-w-sm">
                  <FieldLabel htmlFor="sector">En quin sector treballes?</FieldLabel>
                  <Select
                    items={SECTORS}
                    value={field.value ?? null}
                    onValueChange={(value) => field.onChange(value ?? undefined)}
                  >
                    <SelectTrigger
                      id="sector"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={fieldState.invalid}
                      className="h-11! w-full rounded-full border-black bg-white px-4 font-mono"
                    >
                      <SelectValue placeholder="Tria un sector" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false} className="rounded-2xl font-mono">
                      {SECTORS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldSet>
        )}

        {/* Dades bancàries */}
        <FieldSet>
          <FieldLegend className={legendClass}>{n("banc")} Domiciliació bancària</FieldLegend>
          <FieldGroup className="gap-5">
            <Controller
              control={control}
              name="iban"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="iban">IBAN</FieldLabel>
                  <Input
                    id="iban"
                    inputMode="text"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="ES00 0000 0000 0000 0000 0000"
                    className={cn(inputClass, "uppercase tracking-wider")}
                    aria-invalid={fieldState.invalid}
                    {...field}
                    onChange={(e) => field.onChange(formatIban(e.target.value))}
                  />
                  <FieldDescription className="font-mono text-xs">
                    Hi carregarem la quota amb la periodicitat que has triat.
                  </FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <ConsentCheckbox
              name="mandatSepa"
              control={control}
              label="Autoritzo la XEPC a carregar la quota al meu compte (mandat SEPA)."
             />
            <ConsentCheckbox
              name="privacitat"
              control={control}
              label={`Accepto el tractament de les meves dades per gestionar ${
                plan.kind === "aportacio" ? "la meva aportació" : "l'afiliació"
              }.`}
            >
              <LegalNotice joins={joins} />
            </ConsentCheckbox>
          </FieldGroup>
        </FieldSet>

        {serverError && (
          <p role="alert" className="rounded-3xl border border-destructive bg-white px-5 py-3 font-mono text-sm text-destructive">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={pending} size="lg" className="h-12 rounded-full px-8 font-mono text-base sm:w-fit">
          {pending && <Loader2Icon className="animate-spin" />}
          {pending ? "Enviant…" : "Enviar"}
        </Button>
      </form>
    </FormProvider>
  );
}

function ConsentCheckbox({
  name,
  control,
  label,
  description,
  children,
}: {
  name: "mandatSepa" | "privacitat";
  control: ReturnType<typeof useForm<FormInput, unknown, FormOutput>>["control"];
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            onBlur={field.onBlur}
            aria-invalid={fieldState.invalid}
            className="size-5 border-black"
          />
          <FieldContent>
            <FieldLabel htmlFor={name} className="font-mono text-sm font-normal">
              {label}
            </FieldLabel>
            {description && <FieldDescription className="font-mono text-xs">{description}</FieldDescription>}
            <FieldError errors={[fieldState.error]} />
            {children}
          </FieldContent>
        </Field>
      )}
    />
  );
}

/** Informació de protecció de dades: text unificat per a les organitzacions on t'afilies. */
function LegalNotice({ joins }: { joins: { pahc: boolean; cgt: boolean } }) {
  const { blocks } = legalVersionFor(joins);
  return (
    <div
      tabIndex={0}
      aria-label="Informació sobre protecció de dades"
      className="mt-2 flex max-h-56 flex-col gap-3 overflow-y-auto rounded-2xl border border-black bg-white p-4 font-mono text-xs leading-relaxed text-black/70 focus-visible:ring-3 focus-visible:ring-black/20 focus-visible:outline-none"
    >
      {blocks.map((b) => (
        <p key={b.heading}>
          <strong className="font-medium text-black">{b.heading}.</strong> {b.body}
        </p>
      ))}
    </div>
  );
}
