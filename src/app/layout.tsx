import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeRoot from "./components/ThemeRoot";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Video Hub - Your Movie Destination",
  description: "Your ultimate destination for movie collections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { var t = localStorage.getItem('theme'); if (!t) { t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } document.documentElement.setAttribute('data-theme', t); } catch (e) {} })();`,
          }}
        />
        <ThemeProvider>
          <ThemeRoot>
            {children}
            <Toaster position="top-right" richColors closeButton theme="dark" />
          </ThemeRoot>
        </ThemeProvider>
      </body>
    </html>
  );
}
