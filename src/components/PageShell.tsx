import React from "react";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="gmk-page">{children}</main>;
}
