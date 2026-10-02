import Image from "next/image";

/** Capçalera de les propostes amb aportació a la XEPC. */
export function XepcHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="flex flex-col items-center gap-5 text-center">
      <Image src="/logos/logo-xepc.svg" alt="XEPC" width={134} height={214} priority className="mb-2 h-16 w-auto sm:h-20" />
      <h1 className="max-w-3xl font-heading text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
        {title}
      </h1>
      {children && <div className="max-w-2xl font-mono text-sm leading-relaxed sm:text-base">{children}</div>}
    </header>
  );
}

export function StepTitle({ n, children, id }: { n?: number; children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-heading text-2xl font-extrabold uppercase">
      {n !== undefined && <span className="mr-2 font-black">{n}.</span>}
      {children}
    </h2>
  );
}
