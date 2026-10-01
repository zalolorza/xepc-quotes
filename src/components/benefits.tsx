"use client";

import Image from "next/image";
import { InfoIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Logo = { src: string; alt: string; width: number; height: number };

type Benefit = {
  title: string;
  logos: Logo[];
  /** Text del modal. TODO: revisar i completar amb cada organització. */
  info: string[];
};

const BENEFITS: Benefit[] = [
  {
    title: "Contribució a la XEPC",
    logos: [{ src: "/logos/logo-xepc.svg", alt: "XEPC", width: 134, height: 214 }],
    info: [
      "La XEPC (Xarxa d'Estructures Populars i Comunitàries de Manresa) teixeix les organitzacions populars de la ciutat per sumar forces i construir comunitat.",
      "Formar-ne part vol dir participar en les assemblees de la xarxa, en les seves campanyes i en la presa de decisions col·lectiva.",
    ],
  },
  {
    title: "Afiliació a Acció Sindical Bages i CGT",
    logos: [
      { src: "/logos/logo-accio-sindical-bages.webp", alt: "Acció Sindical Bages", width: 512, height: 512 },
      { src: "/logos/logo-cgt.svg", alt: "CGT", width: 83, height: 134 },
    ],
    info: [
      "Acció Sindical Bages i la CGT són l'eina d'organització al lloc de treball: defensa col·lectiva dels drets laborals des de l'autonomia i l'acció directa.",
      "L'afiliació et dona accés a l'assessorament laboral i jurídic del sindicat, a les seccions sindicals i al suport en conflictes amb l'empresa.",
    ],
  },
  {
    title:
      "Afiliació a la PAHC Bages i la COSHAC",
    logos: [
      { src: "/logos/logo-pahc.svg", alt: "PAHC Bages", width: 164, height: 122 },
      { src: "/logos/logo-coshac-2.svg", alt: "COSHAC", width: 172, height: 213 },
    ],
    info: [
      "La PAHC Bages és la Plataforma d'Afectats per la Hipoteca i el Capitalisme del Bages: un espai d'autoorganització per defensar el dret a l'habitatge davant de bancs, fons, propietaris i rendistes.",
      "Amb l'afiliació ajudes a l'organització popular, tens dret a un acompanyament col·lectiu en conflictes d'habitatge i rebràs informació actualitzada de la PAHC i la COSHAC.",
    ],
  },
  {
    title: "Afiliació al Gimnàs Popular la Ruda",
    logos: [{ src: "/logos/logo-ruda.png", alt: "Gimnàs Popular la Ruda", width: 382, height: 382 }],
    info: [
      "El Gimnàs Popular la Ruda és un espai esportiu autogestionat, obert al barri i sense ànim de lucre.",
      "Amb l'afiliació pots fer servir el gimnàs i participar en les activitats i entrenaments col·lectius que s'hi organitzen.",
    ],
  },
];

export function Benefits() {
  return (
    <ul className="w-full max-w-2xl border-t border-black">
      {BENEFITS.map((benefit) => (
        <li key={benefit.title} className="flex items-center gap-4 border-b border-black py-5 sm:gap-8">
          <div className="flex w-28 shrink-0 items-center gap-3 sm:w-30">
            {benefit.logos.map((logo) => (
              <Image
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-10 w-auto min-w-0 max-w-[calc(50%-0.375rem)] object-contain object-left only:max-w-full sm:h-12"
              />
            ))}
          </div>
          <p className="flex-1 font-mono text-sm leading-snug sm:text-base">{benefit.title}</p>
          <Dialog>
            <DialogTrigger
              aria-label={`Més informació: ${benefit.title}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black bg-white transition-colors hover:bg-black hover:text-white"
            >
              <InfoIcon className="size-4" />
            </DialogTrigger>
            <DialogContent className="rounded-3xl p-6 ring-1 ring-black sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {benefit.logos.map((logo) => (
                    <Image
                      key={logo.src}
                      src={logo.src}
                      alt=""
                      width={logo.width}
                      height={logo.height}
                      className="h-10 w-auto object-contain"
                    />
                  ))}
                </div>
                <DialogTitle className="pr-8 font-heading text-xl font-extrabold uppercase leading-tight">
                  {benefit.title}
                </DialogTitle>
                <DialogDescription
                  render={<div />}
                  className="flex flex-col gap-3 font-mono text-sm leading-relaxed text-black/80"
                >
                  {benefit.info.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </li>
      ))}
    </ul>
  );
}
