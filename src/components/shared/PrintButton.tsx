"use client";

import { Button } from "@/components/ui/Button";

/**
 * "Save as PDF" for the CV page. The browser's own print pipeline produces a
 * better PDF than a hand-rolled generator, and it keeps the CV page as the
 * single source of truth instead of a second document that drifts.
 */
export function PrintButton({ label = "Save as PDF" }: { label?: string }) {
  return (
    <Button type="button" variant="primary" size="md" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
