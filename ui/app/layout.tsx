import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synthetic User Council",
  description:
    "A multi-agent AI system powered by Gemini that challenges your research assumptions before you talk to real users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grain bg-canvas text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
