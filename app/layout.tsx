import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sales Pipeline | Home Service Business",
  description: "Sales pipeline management for home service businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <Navigation />
              </div>
            </div>
            <main className="max-w-[95%] w-[1800px] mx-auto py-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}