import { cn } from "@/lib/utils";
import { HealthStatus, MilestoneStatus, MitigationStatus, RiskSeverity } from "@/types/portfolio";

// Vibrant, consistent status colors
export const STATUS_COLORS = {
  onTrack: "#22C55E",
  atRisk: "#F59E0B",
  blocked: "#EF4444",
  critical: "#EF4444",
  high: "#F59E0B",
  medium: "#3B82F6",
  low: "#6B7280",
};

export function healthLabel(status: HealthStatus): string {
  return status === "on-track" ? "On Track" : status === "at-risk" ? "At Risk" : "Blocked";
}

export function healthColor(status: HealthStatus): string {
  return status === "on-track"
    ? "bg-emerald-50 text-emerald-800 border border-emerald-500/40"
    : status === "at-risk"
    ? "bg-amber-50 text-amber-800 border border-amber-500/40"
    : "bg-red-50 text-red-800 border border-red-500/40";
}

export function healthDot(status: HealthStatus): string {
  return status === "on-track"
    ? "bg-[#22C55E]"
    : status === "at-risk"
    ? "bg-[#F59E0B]"
    : "bg-[#EF4444]";
}

export function milestoneColor(status: MilestoneStatus): string {
  if (status === "completed") return "bg-emerald-50 text-emerald-800 border border-emerald-500/40";
  if (status === "on-track") return "bg-emerald-50 text-emerald-800 border border-emerald-500/40";
  if (status === "at-risk") return "bg-amber-50 text-amber-800 border border-amber-500/40";
  return "bg-red-50 text-red-800 border border-red-500/40";
}

export function severityColor(severity: RiskSeverity): string {
  if (severity === "critical") return "bg-red-50 text-red-800 border border-red-500/40";
  if (severity === "high") return "bg-amber-50 text-amber-800 border border-amber-500/40";
  if (severity === "medium") return "bg-blue-50 text-blue-800 border border-blue-500/40";
  return "bg-muted text-foreground border border-border";
}

export function mitigationLabel(status: MitigationStatus): string {
  return status === "not-started" ? "Not Started" : status === "in-progress" ? "In Progress" : "Mitigated";
}

export function StatusBadge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap leading-5 align-middle", className)}>
      {children}
    </span>
  );
}
