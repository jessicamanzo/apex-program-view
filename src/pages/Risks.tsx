import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/UserAvatar";
import { StatusBadge, severityColor, mitigationLabel } from "@/components/StatusHelpers";
import portfolioData from "@/data/portfolioDataV2";
import { RiskSeverity } from "@/types/portfolio";
import { Calendar, Clock } from "lucide-react";

const severityOrder: Record<RiskSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const daysOpen = (createdDate: string): number => {
  const ref = new Date("2026-04-14");
  const created = new Date(createdDate);
  return Math.floor((ref.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
};

const Risks = () => {
  const navigate = useNavigate();
  const [severityFilter, setSeverityFilter] = useState<"all" | RiskSeverity>("all");

  const filteredRisks = useMemo(() => {
    const sorted = [...portfolioData.risks].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    if (severityFilter === "all") return sorted;
    return sorted.filter(r => r.severity === severityFilter);
  }, [severityFilter]);

  const counts = {
    all: portfolioData.risks.length,
    critical: portfolioData.risks.filter(r => r.severity === "critical").length,
    high: portfolioData.risks.filter(r => r.severity === "high").length,
    medium: portfolioData.risks.filter(r => r.severity === "medium").length,
    low: portfolioData.risks.filter(r => r.severity === "low").length,
  };

  const mitigationBadgeColor = (status: string) => {
    if (status === "mitigated") return "bg-emerald-100 text-emerald-900 border border-emerald-400/50";
    if (status === "in-progress") return "bg-amber-100 text-amber-900 border border-amber-400/50";
    return "bg-muted text-muted-foreground border border-border";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Risks & Blockers</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">All open risk items across the portfolio, sorted by severity</p>
        </div>

        {/* Portfolio risk synthesis */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">Portfolio Risk Analysis</p>
          <p className="text-sm text-foreground/85 leading-relaxed">
            <strong>4 of 15 risks share a common root cause:</strong> external dependency on third-party auditors and vendors outside our control (RSK-001, RSK-002, RSK-003, RSK-005). These cannot be resolved through engineering effort alone — they require executive escalation, vendor negotiation, or contractual remediation. The remaining risks are execution-level and recoverable within the team.
          </p>
          <p className="text-xs text-muted-foreground mt-2">Critical path: SOC 2 auditor delay → ML Platform production block → AI Feature delivery slip → Enterprise customer activation miss → $3.2M Q2 ARR risk</p>
        </div>

        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {(["all", "critical", "high", "medium", "low"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors touch-manipulation ${
                severityFilter === s
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredRisks.map(risk => (
            <Card
              key={risk.id}
              onClick={() => navigate(`/risk/${risk.id}`)}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <UserAvatar initials={risk.ownerInitials} name={risk.owner} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs text-muted-foreground font-mono">{risk.id}</span>
                      <StatusBadge className={severityColor(risk.severity)}>{risk.severity}</StatusBadge>
                      <StatusBadge className={mitigationBadgeColor(risk.mitigationStatus)}>{mitigationLabel(risk.mitigationStatus)}</StatusBadge>
                    </div>
                    <p className="text-sm font-medium text-foreground">{risk.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">{risk.programName}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{risk.targetResolutionDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Risks;
