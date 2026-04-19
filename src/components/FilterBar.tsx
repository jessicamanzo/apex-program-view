import { FilterOption } from "@/types/portfolio";
import { cn } from "@/lib/utils";

const filters: { label: string; value: FilterOption }[] = [
  { label: "All", value: "all" },
  { label: "On Track", value: "on-track" },
  { label: "At Risk", value: "at-risk" },
  { label: "Blocked", value: "blocked" },
  { label: "Critical Risks", value: "critical-risks" },
];

interface FilterBarProps {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
}

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            "px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors touch-manipulation",
            active === f.value
              ? "bg-foreground text-background"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
