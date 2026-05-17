import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verdict - PR Review with Cross-Temporal Analysis",
  description: "CodeRabbit reviews the diff. Verdict reviews the decision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

// Made with Bob
