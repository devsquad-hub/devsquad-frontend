"use client";

import { BaseStyles, ThemeProvider } from "@primer/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider colorMode="auto">
      <BaseStyles>{children}</BaseStyles>
    </ThemeProvider>
  );
}
