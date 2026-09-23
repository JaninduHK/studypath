import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  caption,
  className,
}: {
  caption: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(155deg,#F1ECE4,#E7E0D4)] p-8 text-center",
        className,
      )}
    >
      <ImageIcon size={28} strokeWidth={1.6} className="text-ink-2" />
      <p className="max-w-[220px] text-[13px] font-medium leading-snug text-ink-2">
        {caption}
      </p>
    </div>
  );
}
