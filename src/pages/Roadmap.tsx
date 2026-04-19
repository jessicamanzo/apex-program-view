import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, healthColor, healthLabel, milestoneColor } from "@/components/StatusHelpers";
import portfolioData from "@/data/portfolioDataV2";
import { CheckCircle2, Circle, Clock, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const piLabels = ["PI 24.1", "PI 24.2", "PI 24.3"];

const Roadmap = () => {
  const navigate = useNavigate();

  const piStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-4 sm:h-5 w-4 sm:w-5 text-success" />;
    if (status === "in-progress") return <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-warning" />;
    return <Circle className="h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />;
  };

  const piStatusLabel = (status: string) => {
    if (status === "completed") return "Completed";
    if (status === "in-progress") return "In Progress";
    return "Planned";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Portfolio Roadmap</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Cross-program milestones by Program Increment</p>
        </div>

        {/* At-risk milestone synthesis */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">Roadmap Risk Summary — PI 24.2</p>
          <p className="text-sm text-foreground/85 leading-relaxed">
            3 milestones are at risk of missing their PI 24.2 target. 2 are blocked by external vendor dependency (SOC 2 auditor). 1 is delayed by scope variance in the feature store architecture. None of these are execution failures — they are dependency and architectural issues that require leadership decisions, not more engineering effort.
          </p>
        </div>

        {piLabels.map(piLabel => {
          const piStatus = piLabel === "PI 24.1" ? "completed" : piLabel === "PI 24.2" ? "in-progress" : "planned";
          return (
            <Card key={piLabel}>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                  {piStatusIcon(piStatus)}
                  <span>{piLabel}</span>
                  <span className="text-xs text-muted-foreground font-normal">{piStatusLabel(piStatus)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:px-6">
                <div className="space-y-4">
                  {portfolioData.programs.map(program => {
                    const piRoadmap = program.roadmap.find(r => r.pi === piLabel);
                    if (!piRoadmap || piRoadmap.milestones.length === 0) return null;

                    return (
                      <div key={program.id} className="space-y-2">
                        <button
                          onClick={() => navigate(`/program/${program.id}`)}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <StatusBadge className={healthColor(program.health)}>{healthLabel(program.health)}</StatusBadge>
                          <span className="text-xs sm:text-sm font-medium text-foreground">{program.name}</span>
                        </button>
                        <div className="ml-4 sm:ml-6 space-y-1.5">
                          {piRoadmap.milestones.map(m => (
                            <div key={m.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg bg-muted/50">
                              <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                                <div className={`h-2 w-2 rounded-full shrink-0 mt-1 sm:mt-0 ${
                                  m.status === "completed" ? "bg-success" :
                                  m.status === "on-track" ? "bg-success/80" :
                                  m.status === "at-risk" ? "bg-warning" : "bg-danger"
                                }`} />
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm text-foreground">{m.name}</p>
                                  {m.dependency && (
                                    <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1">
                                      <Link2 className="h-3 w-3 shrink-0" />Depends on: {m.dependency}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-4 sm:ml-0">
                                <span className="text-[11px] sm:text-xs text-muted-foreground">{m.targetDate}</span>
                                <StatusBadge className={milestoneColor(m.status)}>
                                  {m.status === "on-track" ? "On Track" : m.status === "at-risk" ? "At Risk" : m.status === "blocked" ? "Blocked" : "Completed"}
                                </StatusBadge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Roadmap;
