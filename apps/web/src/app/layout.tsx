import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "./provider.tsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remote_Work_Setup",
  description: "Creating a Project to make remote work easy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
      <html lang="en">
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
