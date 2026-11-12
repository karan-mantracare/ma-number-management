import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Integrations | MantraAssist",
  description: "MantraAssist Telephony Integrations and Number Routing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f4f6f9] text-slate-900">
        {children}
      </body>
    </html>
  );
}

