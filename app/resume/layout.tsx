import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev — Resume",
  description: "Resume of Dev, Software Engineer",
  robots: "noindex",
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
