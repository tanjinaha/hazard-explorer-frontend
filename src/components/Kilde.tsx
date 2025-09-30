import React from "react";

export default function Kilde({ children }: { children: React.ReactNode }) {
  return (
    <footer className="mt-6 text-sm text-gray-600">
      <strong>Kilde (Source): </strong>
      {children}
    </footer>
  );
}
