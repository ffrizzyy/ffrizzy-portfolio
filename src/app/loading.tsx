import { LAYOUT } from "@/lib/constants";

/**
 * Spec 5.2: loading skeletons that match the final layout shapes. No generic
 * spinners anywhere.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className={LAYOUT.section}>
      <div className={LAYOUT.container}>
        <span className="sr-only">Loading</span>

        {/* Hero shape */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="flex flex-col gap-6 md:col-span-7">
            <div className="h-12 w-4/5 bg-paper-sunken md:h-16" />
            <div className="h-12 w-3/5 bg-paper-sunken md:h-16" />
            <div className="h-5 w-2/3 bg-paper-sunken" />
            <div className="flex gap-4">
              <div className="h-11 w-32 rounded-pill bg-paper-sunken" />
              <div className="h-11 w-36 rounded-pill bg-paper-sunken" />
            </div>
          </div>
          <div className="aspect-[4/5] bg-paper-sunken md:col-span-5" />
        </div>

        {/* Stat row shape */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-6">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className={`flex flex-col gap-4 border-t border-line pt-8 ${index >= 3 ? "sm:col-span-2 md:col-span-3" : "md:col-span-2"}`}
            >
              <div className="size-10 bg-paper-sunken" />
              <div className="h-10 w-24 bg-paper-sunken" />
              <div className="h-4 w-32 bg-paper-sunken" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
