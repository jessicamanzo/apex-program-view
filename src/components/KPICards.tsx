import { Card, CardContent } from "@/components/ui/card";
import { Activity, BarChart3, Calendar, AlertTriangle, Target } from "lucide-react";
import { Program } from "@/types/portfolio";

interface KPICardsProps {
  programs: Program[];
  currentPI: string;
  currentPIWeek: number;
  totalPIWeeks: number;
  criticalRiskCount: number;
  totalRiskCount: number;
}

export function KPICards({ programs, currentPI, currentPIWeek, totalPIWeeks, criticalRiskCount, totalRiskCount }: KPICardsProps) {
  const avgVelocity = Math.round(programs.reduce((s, p) => s + p.velocity, 0) / (programs.length || 1));
  const avgVelocityChange = Math.round(programs.reduce((s, p) => s + p.velocityChange, 0) / (programs.length || 1));
  const avgPredictability = Math.round(programs.reduce((s, p) => s + p.predictability, 0) / (programs.length || 1));

  const kpis = [
    { label: "Active Programs", value: programs.length, sub: `${programs.filter(p => p.health === "on-track").length} healthy · ${programs.filter(p => p.health === "at-risk").length} downstream-impacted`, icon: BarChart3 },
    { label: "Avg Velocity", value: `${avgVelocity} SP`, sub: `${avgVelocityChange >= 0 ? "+" : ""}${avgVelocityChange}% vs last PI · drag from blocked programs`, icon: Activity, changePositive: avgVelocityChange >= 0 },
    { label: "Current PI", value: currentPI, sub: `Week ${currentPIWeek} of ${totalPIWeeks}`, icon: Calendar },
    { label: "Open Risks", value: totalRiskCount, sub: `${criticalRiskCount} critical severity`, icon: AlertTriangle, alert: criticalRiskCount > 0 },
    { label: "Portfolio Predictability", value: `${avgPredictability}%`, sub: avgPredictability >= 85 ? "Above 85% SAFe benchmark" : avgPredictability >= 70 ? "Below 85% SAFe target" : "Needs intervention", icon: Target },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="hover:shadow-md transition-all duration-200 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground/80 uppercase tracking-[0.1em] leading-tight">{kpi.label}</span>
              <kpi.icon className={`h-3.5 w-3.5 shrink-0 ${kpi.alert ? "text-red-600" : "text-muted-foreground"}`} />
            </div>
            <div className="text-2xl sm:text-[28px] font-bold text-foreground tracking-tight leading-none">{kpi.value}</div>
            <p className={`text-xs sm:text-sm mt-2 sm:mt-2.5 font-semibold ${kpi.changePositive === false ? "text-red-700" : kpi.changePositive === true ? "text-emerald-700" : "text-muted-foreground/80"}`}>
              {kpi.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
