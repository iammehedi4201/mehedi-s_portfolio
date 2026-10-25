import type { Metadata } from "next";
import { Manrope, Inter, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mehedi Hasan | Software Engineer",
  description:
    "Portfolio of Mehedi Hasan, a Software Engineer specializing in Next.js, React, Express.js, MongoDB, scalable web applications, and dynamic CMS architectures.",
  keywords: [
    "Mehedi Hasan",
    "Software Engineer",
    "Full-Stack Developer",
    "Next.js",
    "React",
    "Express.js",
    "MongoDB",
    "TypeScript",
    "Antopolis",
    "Daffodil International University",
    "Dhaka Bangladesh",
  ],
  authors: [{ name: "Mehedi Hasan" }],
  openGraph: {
    title: "Mehedi Hasan | Software Engineer",
    description:
      "Software Engineer specializing in Next.js, React, Express.js, and MongoDB. Building scalable web platforms with clean architecture.",
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
        className={`${manrope.variable} ${inter.variable} ${syne.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
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
