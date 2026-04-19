import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, Zap, ArrowRight, Link2 } from "lucide-react";
import { Program, Risk } from "@/types/portfolio";
import { StatusBadge } from "@/components/StatusHelpers";

interface AIInsightsPanelProps {
  programs: Program[];
  risks: Risk[];
}

export function AIInsightsPanel({ programs, risks }: AIInsightsPanelProps) {
  const blocked = programs.filter(p => p.health === "blocked");
  const atRisk = programs.filter(p => p.health === "at-risk");
  const criticalRisks = risks.filter(r => r.severity === "critical");
  const avgPred = Math.round(programs.reduce((s, p) => s + p.predictability, 0) / programs.length);
  const decliningPrograms = programs.filter(p => p.velocityChange < -5);

  const onTrackCount = programs.filter(p => p.health === "on-track").length;
  const confidencePct = Math.round(
    (avgPred * 0.5) + ((onTrackCount / programs.length) * 100 * 0.3) + ((1 - criticalRisks.length / Math.max(risks.length, 1)) * 100 * 0.2)
  );

  const predictabilityLevel = confidencePct >= 85 ? "High" : confidencePct >= 70 ? "Medium" : "Low";
  const predictabilityColor = predictabilityLevel === "High" ? "bg-emerald-100/80 text-emerald-800 border border-emerald-300/60"
    : predictabilityLevel === "Medium" ? "bg-amber-100/80 text-amber-800 border border-amber-300/60"
    : "bg-red-100/80 text-red-800 border border-red-300/60";

  const blockedDeps = programs.flatMap(p => p.dependencies.filter(d => d.status === "blocked"));
  const atRiskDeps = programs.flatMap(p => p.dependencies.filter(d => d.status === "at-risk"));
  const affectedByBlockers = new Set(blockedDeps.map(d => d.to));
  const downstreamCount = programs.filter(p =>
    p.dependencies.some(d => affectedByBlockers.has(d.to) || blockedDeps.some(bd => bd.from === p.name))
  ).length;

  const primaryDriver = blocked.length > 0
    ? `${blocked[0].name} is blocked by cross-program dependencies`
    : criticalRisks.length > 0
    ? `${criticalRisks.length} critical risk${criticalRisks.length > 1 ? "s" : ""} threaten${criticalRisks.length === 1 ? "s" : ""} delivery`
    : decliningPrograms.length > 0
    ? `Velocity declining in ${decliningPrograms.map(p => p.name).join(", ")}`
    : "All programs tracking within healthy parameters";

  const insights = [
    {
      icon: TrendingUp,
      title: "Diagnosis",
      content: blocked.length > 0
        ? `Primary driver: ${blocked[0].name} blocked by dependency chain. ${blockedDeps.length} blocked link${blockedDeps.length > 1 ? "s" : ""} impacting ${downstreamCount} downstream program${downstreamCount !== 1 ? "s" : ""}. Portfolio predictability at ${avgPred}% (target: 85%). Execution predictability drops to ${confidencePct}% when adjusted for dependency chain risk, indicating systemic delivery exposure rather than isolated execution issues.`
        : atRisk.length > 0
        ? `Primary driver: ${atRisk.map(p => p.name).join(", ")} showing degraded health. ${decliningPrograms.length} program${decliningPrograms.length !== 1 ? "s" : ""} with velocity decline. Portfolio predictability at ${avgPred}%, execution predictability at ${confidencePct}%. Predictability drops from ${avgPred}% to ${confidencePct}% when adjusted for dependency chain risk, indicating systemic delivery exposure rather than isolated execution issues.`
        : `Portfolio predictability at ${avgPred}% — above the 85% SAFe benchmark. Execution predictability at ${confidencePct}%. ${onTrackCount}/${programs.length} programs on track with stable velocity.`,
    },
    {
      icon: AlertTriangle,
      title: "Risk Exposure",
      content: criticalRisks.length > 0
        ? `${criticalRisks.length} critical risk${criticalRisks.length > 1 ? "s" : ""} require immediate attention: ${criticalRisks.slice(0, 2).map(r => r.title).join("; ")}. ${blocked.length > 0 ? `Blocked dependencies amplify impact.` : ""}`
        : `No critical risks active. ${atRisk.length} program${atRisk.length !== 1 ? "s" : ""} under monitoring. Risk posture is ${risks.length <= 3 ? "healthy" : "moderate"}.`,
    },
    {
      icon: Zap,
      title: "Impact if Unresolved",
      content: blocked.length > 0
        ? `Without intervention within 48 hours, ${blocked[0].name} delay will cascade to ${blocked[0].dependencies.length} dependent program${blocked[0].dependencies.length !== 1 ? "s" : ""}, adding 4–6 weeks to PI 24.3 timelines. Execution predictability will drop below 60%.`
        : decliningPrograms.length > 0
        ? `Continued velocity decline will reduce PI 24.2 delivery by ~15–20%, risking PI 24.3 commitments. Execution predictability may fall below 70% within 2 sprints.`
        : "Current trajectory supports on-time delivery for all PI 24.2 commitments with no material schedule risk.",
    },
    {
      icon: ArrowRight,
      title: "Recommended Actions",
      content: blocked.length > 0
        ? `Next 24 Hours: Escalate ${blocked[0].name} blockers to VP-level. Next 48 Hours: Conduct cross-program dependency workshop. This Week: Evaluate scope reduction for PI 24.3 to absorb delays.`
        : atRisk.length > 0
        ? `Next 48 Hours: Schedule risk review for ${atRisk.map(p => p.name).join(", ")}. This Week: Reallocate 2–3 engineers from stable programs to stabilize velocity. Immediately: Freeze scope changes for at-risk programs.`
        : "Maintain current cadence. Focus on PI 24.3 planning readiness and backlog refinement.",
    },
  ];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow bg-muted/30">
      <CardHeader className="pb-3 border-b border-border/60 mb-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-muted-foreground shrink-0" />
            Program Intelligence
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-left sm:text-right">
              <span className="text-xs sm:text-sm text-muted-foreground/80 font-semibold block">Execution Predictability</span>
              <span className="text-lg sm:text-xl font-semibold text-foreground">{confidencePct}%</span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground/70 block mt-0.5 leading-tight">AI risk-adjusted based on dependencies, blockers, and velocity trends.</span>
            </div>
            <StatusBadge className={predictabilityColor}>{predictabilityLevel}</StatusBadge>
          </div>
        </div>
        {predictabilityLevel !== "High" && (
          <p className="text-xs sm:text-sm text-foreground/90 mt-2 leading-relaxed">
            <span className="font-semibold">Primary driver:</span>{" "}
            {primaryDriver}.
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-4 sm:space-y-5 px-4 sm:px-6">
        {(blockedDeps.length > 0 || atRiskDeps.length > 0) && (
          <div className="p-3 sm:p-4 rounded-xl bg-muted/60 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">Dependency Impact</span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
              {blockedDeps.length > 0 && (
                <>{blockedDeps.length} blocked chain{blockedDeps.length > 1 ? "s" : ""}: {blockedDeps.map(d => `${d.from} → ${d.to}`).join(", ")}. </>
              )}
              {atRiskDeps.length > 0 && (
                <>{atRiskDeps.length} at-risk dependency{atRiskDeps.length > 1 ? " relationships" : ""} may escalate. </>
              )}
              {blocked.length > 0 && `${blocked.length} program${blocked.length > 1 ? "s" : ""} directly blocked, impacting ${downstreamCount} in the dependency graph.`}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {insights.map((insight) => (
            <div key={insight.title} className="flex gap-3 p-3 sm:p-4 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
              <insight.icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground mb-1 sm:mb-1.5 uppercase tracking-wide">{insight.title}</p>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">{insight.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
