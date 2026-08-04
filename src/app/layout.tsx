import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AppHeader } from "@/components/app-header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevSquad",
    template: "%s · DevSquad",
  },
  description:
    "Projetos construídos em comunidade, do primeiro rascunho até a entrega.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className="h-full"
      data-light-theme="light"
      data-dark-theme="dark"
      data-color-mode="auto"
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ClerkProvider>
          <Providers>
            <AppHeader />
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
