import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KPICards } from "@/components/KPICards";
import { PortfolioHealthChart } from "@/components/PortfolioHealthChart";
import { PIPerformanceChart } from "@/components/PIPerformanceChart";
import { SprintVelocityChart } from "@/components/SprintVelocityChart";
import { RiskPanel } from "@/components/RiskPanel";
import { ProgramsTable } from "@/components/ProgramsTable";
import { BudgetPanel } from "@/components/BudgetPanel";
import { TradeOffPanel } from "@/components/TradeOffPanel";
import { StakeholderAlignment } from "@/components/StakeholderAlignment";
import { PredictabilityDetail } from "@/components/PredictabilityDetail";
import { ForecastTimeline } from "@/components/ForecastTimeline";
import { DependencyGraph } from "@/components/DependencyGraph";
import portfolioData from "@/data/portfolioDataV2";
import { FilterOption } from "@/types/portfolio";

const Index = () => {
  const [filter, setFilter] = useState<FilterOption>("all");

  const filteredPrograms = useMemo(() => {
    if (filter === "all") return portfolioData.programs;
    if (filter === "critical-risks") return portfolioData.programs.filter(p => portfolioData.risks.some(r => r.programId === p.id && r.severity === "critical"));
    return portfolioData.programs.filter(p => p.health === filter);
  }, [filter]);

  const filteredRisks = useMemo(() => {
    if (filter === "all") return portfolioData.risks;
    if (filter === "critical-risks") return portfolioData.risks.filter(r => r.severity === "critical");
    const programIds = new Set(filteredPrograms.map(p => p.id));
    return portfolioData.risks.filter(r => programIds.has(r.programId));
  }, [filter, filteredPrograms]);

  return (
    <DashboardLayout>
      <div className="space-y-8 sm:space-y-10 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">

        <div className="mb-2">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Nova Systems · AI/SaaS · Series C</p>
              <h1 className="text-xl sm:text-[2rem] font-bold text-foreground tracking-tight leading-tight">
                AI Program Management Portfolio
              </h1>
              <p className="text-xs sm:text-sm text-foreground/80 font-semibold mt-2">
                Jessica Manzo · Senior Technical Program Manager
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                PI 24.2 · Week 7 of 10
              </div>
              <span className="text-[10px] text-muted-foreground/60">Week of April 14, 2026</span>
            </div>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-red-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Today's Focus</span>
              <span className="text-[10px] font-semibold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded">Decision Required</span>
            </div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">
              ML Platform Reliability is blocked on SOC 2 audit — $3.2M Q2 ARR at risk if not resolved before May 15 enterprise activation deadline.
            </p>
            <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
              <p className="text-xs text-red-600 dark:text-red-400">
                Recommended: Engage premium audit firm ($340K) to accelerate by 3 weeks. Decision needed from CTO + CFO this week.
              </p>
              <Link to="/executive-briefing" className="shrink-0 inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                View Executive Briefing →
              </Link>
            </div>
          </div>
        </div>

        <KPICards
          programs={filteredPrograms}
          currentPI={portfolioData.currentPI}
          currentPIWeek={portfolioData.currentPIWeek}
          totalPIWeeks={portfolioData.totalPIWeeks}
          criticalRiskCount={filteredRisks.filter(r => r.severity === "critical").length}
          totalRiskCount={filteredRisks.length}
        />

<div>
          <SectionLabel label="Decision Support" description="Quantified trade-offs requiring leadership action — with revenue, schedule, risk, and cost impact" />
          <div className="grid grid-cols-1 gap-4">
            <TradeOffPanel tradeOffs={portfolioData.tradeOffs} />
          </div>
        </div>

        <div>
          <SectionLabel label="Budget & Resource Tracking" description="Spend vs. plan, forecast at completion, headcount utilization, and per-program variance" />
          <div className="grid grid-cols-1 gap-4">
            <BudgetPanel
              programs={filteredPrograms}
              totalBudget={portfolioData.totalBudget}
              totalSpent={portfolioData.totalSpent}
              totalForecast={portfolioData.totalForecast}
            />
          </div>
        </div>

        <div>
          <SectionLabel label="Portfolio Health & Execution" description="Program health distribution, PI performance, and sprint velocity trends" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <PortfolioHealthChart programs={filteredPrograms} onSegmentClick={setFilter} activeFilter={filter} />
            <PIPerformanceChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4">
            <SprintVelocityChart />
            <RiskPanel risks={filteredRisks} />
          </div>
        </div>

        <div>
          <SectionLabel label="Dependency Network" description="Visual map of cross-program dependencies — hover to inspect upstream/downstream exposure" />
          <div className="grid grid-cols-2 gap-4">
            <DependencyGraph programs={filteredPrograms} />
          </div>
        </div>

        <div>
          <SectionLabel label="Predictability & Forecasting" description="Completion forecasts with confidence bands, predictability formula breakdown, and trend analysis" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ForecastTimeline programs={filteredPrograms} />
            <PredictabilityDetail programs={filteredPrograms} />
          </div>
        </div>

        <div>
          <SectionLabel label="Stakeholder Alignment" description="Sign-off chain across all programs — approvals, pending reviews, and change requests with comments" />
          <div className="grid grid-cols-1 gap-4">
            <StakeholderAlignment programs={filteredPrograms} />
          </div>
        </div>

        <div>
          <SectionLabel label="Program Detail" description="Full program table with inline health, velocity, and risk metrics" />
          <ProgramsTable programs={filteredPrograms} activeFilter={filter} onFilterChange={setFilter} />
        </div>

      </div>
    </DashboardLayout>
  );
};

function SectionLabel({ label, description }: { label: string; description: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold text-foreground tracking-tight">{label}</h2>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

export default Index;
