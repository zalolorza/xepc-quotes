import type { Metadata } from "next";
import { Archivo, Roboto_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Propostes de quotes — XEPC",
  description: "Aporta a la lluita i afilia't al sindicalisme popular.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ca"
      className={`${archivo.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-10">{children}</body>
    </html>
  );
}
