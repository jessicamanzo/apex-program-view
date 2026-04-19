import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProgramsTable } from "@/components/ProgramsTable";
import portfolioData from "@/data/portfolioDataV2";
import { FilterOption } from "@/types/portfolio";

const Programs = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get("filter") as FilterOption) || "all";
  const highlightProgram = searchParams.get("highlight") || undefined;
  const [filter, setFilter] = useState<FilterOption>(initialFilter);

  useEffect(() => {
    const f = searchParams.get("filter") as FilterOption;
    if (f) setFilter(f);
  }, [searchParams]);

  useEffect(() => {
    if (highlightProgram) {
      setTimeout(() => {
        document.getElementById(`program-${highlightProgram}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [highlightProgram]);

  const filteredPrograms = useMemo(() => {
    if (filter === "all") return portfolioData.programs;
    if (filter === "critical-risks") return portfolioData.programs.filter(p => portfolioData.risks.some(r => r.programId === p.id && r.severity === "critical"));
    if (filter === "impacted") return portfolioData.programs.filter(p => p.health === "blocked" || p.health === "at-risk");
    return portfolioData.programs.filter(p => p.health === filter);
  }, [filter]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto p-6 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Programs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "impacted" ? "Showing blocked and at-risk programs requiring attention" : "All programs in the portfolio"}
          </p>
        </div>
        <ProgramsTable programs={filteredPrograms} highlightProgram={highlightProgram} activeFilter={filter} onFilterChange={setFilter} />
      </div>
    </DashboardLayout>
  );
};

export default Programs;
