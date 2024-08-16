import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Ecommerce',
  description: 'Ecommerece site built with Next.js',

}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </NextThemesProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
