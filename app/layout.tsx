import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "POIROT — Developer-First AI Cloud Cost Detective",
  description:
    "Autonomous AI-powered FinOps investigator for AWS cloud infrastructure waste, orphaned storage, idle instances, and over-provisioned resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-nevita-glow text-slate-100 antialiased flex flex-col selection:bg-rose-500/30 selection:text-rose-200"
      >
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
