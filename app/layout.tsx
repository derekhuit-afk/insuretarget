import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "InsureTarget — Insurance M&A Target Identification Feed",
  description: "Scored list of insurance acquisition targets — carriers, MGAs, and agencies ranked by financial health, market position,",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#050A07", color: "#E8EAF0", fontFamily: "monospace", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
