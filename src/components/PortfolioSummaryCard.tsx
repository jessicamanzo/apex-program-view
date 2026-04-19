import { useNavigate } from "react-router-dom";
import portfolioData from "@/data/portfolioDataV2";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Brain } from "lucide-react";
import { StatusBadge, healthColor, healthLabel, STATUS_COLORS } from "@/components/StatusHelpers";

export function PortfolioSummaryCard() {
  const navigate = useNavigate();
  const { programs, risks } = portfolioData;
  const blocked = programs.filter((p) => p.health === "blocked");
  const atRisk = programs.filter((p) => p.health === "at-risk");
  const criticalRisks = risks.filter((r) => r.severity === "critical");

  const overallHealth = blocked.length > 0 ? "blocked" : atRisk.length > 1 ? "at-risk" : "on-track";
  const avgVelChange = programs.reduce((s, p) => s + p.velocityChange, 0) / programs.length;
  const improving = avgVelChange > 0;
  const avgPred = Math.round(programs.reduce((s, p) => s + p.predictability, 0) / programs.length);

  const execSummary = blocked.length > 0
    ? `Portfolio delivery is at risk. ${blocked[0]?.name} cannot deploy to production — blocked on SOC 2 compliance — cascading into AI Feature Delivery and Enterprise Customer Onboarding. $3.2M Q2 ARR at risk.`
    : atRisk.length > 0
    ? `${atRisk.length} program${atRisk.length > 1 ? "s" : ""} at risk with declining velocity — proactive intervention needed to protect PI 24.2 delivery.`
    : `All ${programs.length} programs on track. Portfolio predictability at ${avgPred}% — above SAFe benchmark.`;

  const aiInsight = blocked.length > 0
    ? "This risk pattern indicates a dependency-driven failure rather than execution inefficiency, suggesting escalation—not capacity increase—is the highest-leverage intervention."
    : atRisk.length > 0
    ? "Velocity trends suggest scope volatility rather than resource gaps — consider scope freeze before reallocating capacity."
    : "Stable delivery patterns indicate team maturity. Focus planning energy on PI 24.3 readiness.";

  const primaryConstraint = blocked.length > 0
    ? "Dependency Chain"
    : atRisk.length > 0
    ? "Velocity Decline"
    : null;

  const borderColor = overallHealth === "on-track" ? STATUS_COLORS.onTrack : overallHealth === "at-risk" ? STATUS_COLORS.atRisk : STATUS_COLORS.blocked;

  return (
    <Card
      className="border-l-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.995]"
      style={{
        borderLeftColor: borderColor,
        backgroundColor: overallHealth === "blocked" ? "hsl(0 80% 98%)" : undefined,
      }}
      onClick={() => {
        const highlight = blocked.length > 0 ? blocked[0].id : undefined;
        navigate(`/programs?filter=impacted${highlight ? `&highlight=${highlight}` : ""}`);
      }}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-8">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <h2 className="text-[15px] font-bold text-foreground tracking-tight">Executive Summary</h2>
              <StatusBadge className={healthColor(overallHealth)}>
                {healthLabel(overallHealth)}
              </StatusBadge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground/80 -mt-1">Click to view impacted programs</p>
            <p className="text-sm sm:text-[15px] font-medium text-foreground leading-relaxed">
              {execSummary}
            </p>
            <div className="flex items-start gap-2 text-xs sm:text-sm text-foreground/80 leading-relaxed">
              <Brain className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <p><span className="font-semibold text-foreground">AI Insight:</span> {aiInsight}</p>
            </div>
            {primaryConstraint && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider">Primary Constraint:</span>
                <span className="text-[11px] font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{primaryConstraint}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg ${improving ? "bg-emerald-50" : "bg-amber-50"}`}>
              {improving ? <TrendingUp className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-emerald-700" /> : <TrendingDown className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-amber-700" />}
              <span className={`text-xs font-semibold ${improving ? "text-emerald-800" : "text-amber-800"}`}>
                {improving ? "Improving" : "Declining"}
              </span>
            </div>
            {criticalRisks.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-red-50">
                <AlertTriangle className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-red-600" />
                <span className="text-xs font-semibold text-red-800">{criticalRisks.length} Critical</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
