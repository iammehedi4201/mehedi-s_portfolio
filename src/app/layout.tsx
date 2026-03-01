import type { Metadata } from "next";
import { Inter, Syne, Rajdhani } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mehedi Hasan | Full-Stack Developer",
  description:
    "Full-stack developer portfolio showcasing modern web applications built with Next.js, React, Node.js, and more.",
  keywords: [
    "developer",
    "portfolio",
    "full-stack",
    "Next.js",
    "React",
    "TypeScript",
  ],
  openGraph: {
    title: "Mehedi Hasan | Full-Stack Developer",
    description:
      "Full-stack developer portfolio showcasing modern web applications.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${rajdhani.variable} font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Noise texture overlay */}
          <div className="noise-overlay" />
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1C1C22",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#fff",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
