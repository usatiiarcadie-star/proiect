import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevZone",
  description: "Platformă personală de învățare programare — Python, JavaScript, React, Next.js, SQL, C++, Cybersecurity și mai mult.",
  keywords: ["programare", "invatare", "python", "javascript", "react", "nextjs", "sql", "cursuri"],
  metadataBase: new URL("https://devzone.vercel.app"),
  openGraph: {
    title: "DevZone — Învață Programare",
    description: "Lecții practice cu teorie + exerciții pentru Python, JS, React, Next.js, SQL, C++, Cybersecurity și altele.",
    url: "https://devzone.vercel.app",
    siteName: "DevZone",
    images: [{ url: "/image.png", width: 1254, height: 1254, alt: "DevZone" }],
    locale: "ro_RO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevZone — Învață Programare",
    description: "Platformă personală de învățare programare.",
    images: ["/image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png",   sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">{children}</body>
    </html>
  );
}
