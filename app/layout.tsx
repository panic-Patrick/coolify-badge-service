import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coolify Badge Service",
  description: "SVG badge service for Coolify deployments",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
