import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";

<head>
<title>Ecommerce</title>
<meta name="description" content="A Ecommerece site" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
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
            defaultTheme="system"
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
