import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "./provider.tsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KarthikaySignage",
  description: "KarthikaySignage",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
      <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Montserrat:wght@400;700&family=Lobster&family=Pacifico&family=Dancing+Script&family=Bangers&family=Anton&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&family=Raleway:wght@400;700&family=Ubuntu:wght@400;700&family=Poppins:wght@400;700&family=Quicksand:wght@400;700&family=Comfortaa:wght@400;700&family=Righteous&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
      <Provider>
        <main>
          {children}
        </main>
      </Provider>
      </body>
      </html>
  );
}