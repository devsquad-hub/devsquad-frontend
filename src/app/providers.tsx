"use client";

import { BaseStyles, ThemeProvider } from "@primer/react";
import { RevealObserver } from "@/components/reveal-observer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider colorMode="auto">
      <BaseStyles>
        <RevealObserver />
        {children}
      </BaseStyles>
    </ThemeProvider>
  );
}
