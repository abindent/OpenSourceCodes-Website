"use client";
import {useTheme} from "next-themes";
import { Navbar } from "./navigation/navbar";
import { Footer } from "./navigation/footer";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {resolvedTheme} = useTheme();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div>{children}</div> <Toaster closeButton={true} theme={resolvedTheme as "light" | "dark" | "system" | undefined} />
      </main>

      <Footer />
    </div>
  );
}
