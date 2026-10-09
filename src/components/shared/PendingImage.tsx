import { cn } from "@/lib/utils";

/**
 * Spec 2.9 placeholder policy: until an asset exists, its slot shows the
 * expected filename and pixel size in mono on a paper-sunken panel. It must
 * not imitate a screenshot, and it must be obvious in review that the slot is
 * empty. Spec 2.9 forbids div-based fake screenshots.
 */
export function PendingImage({
  src,
  width,
  height,
  label,
  className,
  ratio = "aspect-[16/10]",
}: {
  src: string;
  width: number;
  height: number;
  /** Describes what the real image will show, for the accessible name. */
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${label}. Artwork pending: ${src}`}
      className={cn(
        "flex flex-col items-start justify-end gap-1 border border-line bg-paper-sunken p-4",
        ratio,
        className,
      )}
    >
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
        Artwork pending
      </span>
      <span className="break-all font-mono text-xs text-ink">{src}</span>
      <span className="font-mono text-xs text-ink-muted">
        {width} x {height}
      </span>
    </div>
  );
}
