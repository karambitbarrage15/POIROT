import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "POIROT — AI Cloud Cost Detective",
  description:
    "Autonomous AI-powered FinOps investigator for AWS cloud infrastructure waste, orphaned storage, idle instances, and over-provisioned resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col bg-grid-pattern selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <p>
            POIROT — AI Cloud Cost Detective • Built with Next.js 15, AWS SDK v3, Neon PostgreSQL, and OpenRouter (Llama 3.3 70B)
          </p>
        </footer>
      </body>
    </html>
  );
}
