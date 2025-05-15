"use client";

import { usePreloader } from "@/lib/hooks/preloader";
import Loading from "@/components/loader/global";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const loading = usePreloader();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
    >
      {loading ? <Loading /> : children}
    </NextThemesProvider>
  );
}