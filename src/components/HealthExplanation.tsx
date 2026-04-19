import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Program } from "@/types/portfolio";
import { StatusBadge, healthColor, healthLabel } from "@/components/StatusHelpers";
import { Activity, Clock, Shield, AlertTriangle, Link2, Bug } from "lucide-react";

interface HealthExplanationProps {
  program: Program;
}

export function HealthExplanation({ program }: HealthExplanationProps) {
  const d = program.healthDimensions;

  const dimensions = [
    { label: "Delivery vs Commitment", value: `${d.deliveryVsCommitment}%`, icon: Activity, good: d.deliveryVsCommitment >= 85, detail: d.deliveryVsCommitment >= 85 ? "Meeting delivery commitments" : "Below target delivery ratio" },
    { label: "Schedule Variance", value: `${d.scheduleVariance >= 0 ? "+" : ""}${d.scheduleVariance} weeks`, icon: Clock, good: d.scheduleVariance >= -1, detail: d.scheduleVariance >= 0 ? "On or ahead of schedule" : "Behind planned schedule" },
    { label: "Scope Stability", value: `${d.scopeStability}%`, icon: Shield, good: d.scopeStability >= 80, detail: d.scopeStability >= 80 ? "Scope remains stable" : "Significant scope changes detected" },
    { label: "Risk Severity", value: `${d.riskSeverityScore}/100`, icon: AlertTriangle, good: d.riskSeverityScore <= 30, detail: d.riskSeverityScore <= 30 ? "Low risk exposure" : "Elevated risk exposure" },
    { label: "Dependency Blockers", value: `${d.dependencyBlockerScore}/100`, icon: Link2, good: d.dependencyBlockerScore <= 20, detail: d.dependencyBlockerScore <= 20 ? "No blocking dependencies" : "Active dependency blockers" },
    { label: "Defect Trend", value: `${d.defectTrend >= 0 ? "+" : ""}${d.defectTrend}%`, icon: Bug, good: d.defectTrend <= 0, detail: d.defectTrend <= 0 ? "Quality improving" : "Quality declining" },
  ];

  const negativeFactors = dimensions.filter(dim => !dim.good);
  const positiveFactors = dimensions.filter(dim => dim.good);

  const healthReason = program.health === "blocked"
    ? `This program is blocked due to ${negativeFactors.map(f => f.label.toLowerCase()).join(", ")}. Immediate action is required to unblock delivery.`
    : program.health === "at-risk"
    ? `Health is at risk because of concerns in ${negativeFactors.map(f => f.label.toLowerCase()).join(", ")}. Proactive monitoring and intervention recommended.`
    : `Program is on track with ${positiveFactors.length} of 6 health dimensions in healthy range. ${negativeFactors.length > 0 ? `Watch ${negativeFactors.map(f => f.label.toLowerCase()).join(", ")}.` : "All dimensions healthy."}`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            Health Assessment
            <StatusBadge className={healthColor(program.health)}>{healthLabel(program.health)}</StatusBadge>
          </CardTitle>
          <span className="text-xs text-muted-foreground font-semibold">{positiveFactors.length}/6 dimensions healthy</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        <p className="text-sm text-foreground leading-relaxed mt-2">{healthReason}</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {dimensions.map(dim => (
            <div key={dim.label} className={`p-4 rounded-xl ${dim.good ? "border border-emerald-200/40 bg-emerald-50/50" : "border border-amber-200/40 bg-amber-50/50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <dim.icon className={`h-3.5 w-3.5 ${dim.good ? "text-emerald-700" : "text-amber-700"}`} />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">{dim.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{dim.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">{dim.detail}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
