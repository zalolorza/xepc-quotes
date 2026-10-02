"use client";

import { useId, useState } from "react";

import { inputClass } from "@/components/form-styles";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { XEPC_AMOUNTS, XEPC_CUSTOM_MIN, XEPC_MAX, isValidXepcAmount } from "@/lib/plans";
import { formatEuro } from "@/lib/quotes";

const pill =
  "flex h-14 items-center justify-center rounded-full border border-black px-4 font-heading text-xl font-extrabold transition-colors focus-visible:ring-3 focus-visible:ring-black/30 focus-visible:outline-none";

/** Tria de l'aportació mensual a la XEPC: 3, 5, 10, 20 € o una quantitat > 20 €. */
export function XepcAmountPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const inputId = useId();
  const isPreset = value !== null && (XEPC_AMOUNTS as readonly number[]).includes(value);
  const [custom, setCustom] = useState(value !== null && !isPreset);
  const [text, setText] = useState(value !== null && !isPreset ? String(value).replace(".", ",") : "");

  const parsed = Number(text.replace(",", "."));
  const customError =
    custom && text !== "" && !isValidXepcAmount(parsed)
      ? parsed > XEPC_MAX
        ? `Màxim ${formatEuro(XEPC_MAX)}`
        : `Ha de ser més de ${formatEuro(XEPC_CUSTOM_MIN)}`
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div role="radiogroup" aria-label="Aportació mensual a la XEPC" className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {XEPC_AMOUNTS.map((amount) => {
          const checked = !custom && value === amount;
          return (
            <button
              key={amount}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => {
                setCustom(false);
                onChange(amount);
              }}
              className={cn(pill, checked ? "bg-black text-white" : "bg-white hover:bg-xepc-blue")}
            >
              {formatEuro(amount)}
            </button>
          );
        })}
        <button
          type="button"
          role="radio"
          aria-checked={custom}
          onClick={() => {
            setCustom(true);
            onChange(isValidXepcAmount(parsed) && text !== "" ? parsed : null);
          }}
          className={cn(pill, "col-span-2 font-mono text-sm font-normal sm:col-span-1", custom ? "bg-black text-white" : "bg-white hover:bg-xepc-blue")}
        >
          Altra quantitat
        </button>
      </div>

      {custom && (
        <div className="flex flex-col gap-2 sm:max-w-xs">
          <label htmlFor={inputId} className="font-mono text-sm">
            Quant vols aportar? (més de {formatEuro(XEPC_CUSTOM_MIN)})
          </label>
          <div className="relative">
            <Input
              id={inputId}
              autoFocus
              inputMode="decimal"
              placeholder="25"
              value={text}
              aria-invalid={!!customError}
              onChange={(e) => {
                const next = e.target.value.replace(/[^\d,.]/g, "");
                setText(next);
                const n = Number(next.replace(",", "."));
                onChange(next !== "" && isValidXepcAmount(n) ? n : null);
              }}
              className={cn(inputClass, "pr-16 text-lg")}
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-sm">€/mes</span>
          </div>
          {customError && (
            <p role="alert" className="font-mono text-sm text-destructive">
              {customError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
