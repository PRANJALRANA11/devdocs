"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/store/store";
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
        <NextThemesProvider   attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
>
          {children}
          </NextThemesProvider>
        </Provider>
      </body>
    </html>
  );
}
