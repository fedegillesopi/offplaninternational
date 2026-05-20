import type { Metadata } from "next";
import { Host_Grotesk, Roboto } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Off Plan International",
  description:
    "One place, total transparency. Find the exact unit you want, filtered by deposit, monthly payment plan, size, location, completion date, and developer.",
  icons: {
    icon: "/images/favicon/favicon-32x32.png",
    apple: "/images/favicon/favicon-256x256.png",
  },
};

const hostGrotesk = Host_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${roboto.variable}`}>
      <body className="font-body antialiased bg-white text-text-primary">
        {children}
      </body>
    </html>
  );
}
