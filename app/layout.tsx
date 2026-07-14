import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/provider";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Strelligence | Financial Intelligence Infrastructure",
  description:
    "Financial intelligence infrastructure that transforms Stellar ledger activity into structured insights, analytics, and developer APIs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}