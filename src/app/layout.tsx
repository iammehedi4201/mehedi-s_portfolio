import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

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
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png?v=3" />
        <link rel="apple-touch-icon" href="/icon-180.png?v=3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var s = localStorage.getItem("portfolio_brand_primary");
                if (s) {
                  var t = JSON.parse(s);
                  if (t && t.primary) {
                    var r = document.documentElement;
                    r.style.setProperty("--brand-primary", t.primary);
                    if (t.hover) r.style.setProperty("--brand-hover", t.hover);
                    if (t.subtle) r.style.setProperty("--brand-subtle", t.subtle);
                    if (t.subtleText) r.style.setProperty("--brand-subtle-text", t.subtleText);
                    if (t.onPrimary) r.style.setProperty("--brand-on-primary", t.onPrimary);
                    if (t.hsl) {
                      r.style.setProperty("--primary", t.hsl);
                      r.style.setProperty("--ring", t.hsl);
                    }
                  }
                }
              } catch(e){}
            })()`,
          }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
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
