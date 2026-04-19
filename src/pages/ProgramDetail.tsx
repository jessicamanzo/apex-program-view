import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, healthColor, healthLabel, severityColor, mitigationLabel } from "@/components/StatusHelpers";
import { UserAvatar } from "@/components/UserAvatar";
import { ProgramRoadmap } from "@/components/ProgramRoadmap";
import { HealthExplanation } from "@/components/HealthExplanation";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import portfolioData from "@/data/portfolioDataV2";
import { ArrowLeft, Activity, Target, Bug, TrendingUp, Clock, Link2, AlertTriangle } from "lucide-react";

const PROGRAM_LEDE: Record<string, string> = {'prg-001': 'ML Platform Reliability is the most critical program in the Nova Systems portfolio. It is the single production gate for three enterprise customers and the foundation every AI product depends on. Currently blocked on SOC 2 audit completion — a dependency we cannot engineer around — with $3.2M in Q2 ARR at risk if not resolved by May 15.', 'prg-002': 'Security and Compliance is the upstream blocker holding the entire portfolio. The SOC 2 Type II audit is required before ML Platform can deploy to production. Auditor scheduling is the critical constraint — not documentation readiness, not technical gaps. The bottleneck is external and requires executive-level vendor escalation, not more engineering effort.', 'prg-003': 'AI Feature Delivery is building the recommendation engine and model serving infrastructure that enterprise customers have been promised. Delivery is blocked waiting for ML Platform to reach production — not because of execution failure, but because the feature store cannot be certified against a model inference API that does not yet exist in production.', 'prg-004': 'Enterprise Customer Onboarding manages the activation pipeline for three signed enterprise accounts waiting on production ML availability. Each customer has a contractual activation window. Two of the three will miss their SLA if the current block extends past April 30. Revenue recognition for Q2 depends on this program running on time.', 'prg-005': 'Data Platform Modernization is building the real-time feature store that feeds the ML inference engine. Currently at-risk on latency: the p99 read path is at 180ms against a 100ms SLA requirement. An architectural change is in progress — this is not a tuning problem, it is a structural one — and the timeline is tight.', 'prg-006': 'DevOps and Developer Experience is one of two programs running cleanly this PI. It is improving the CI/CD pipeline and developer tooling across all eight programs. Its on-track status is notable given the portfolio-wide drag from blocked upstream dependencies — the team has maintained velocity by isolating their work from the dependency cascade.', 'prg-007': 'Growth and Engagement is the highest-performing program in the portfolio at 96% predictability. It is delivering the in-app engagement features that drive retention and expansion revenue. Its clean execution is providing a buffer against the portfolio-wide revenue risk from the ML Platform block.', 'prg-008': 'Core Platform Reliability maintains the infrastructure that all Nova Systems products depend on. At 93% predictability and running on-track, it is the stabilizing anchor of the portfolio. Its on-time delivery of incident response automation this PI significantly reduces operational risk across the entire platform.'};

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const program = portfolioData.programs.find(p => p.id === id);
  const programRisks = portfolioData.risks.filter(r => r.programId === id);

  if (!program) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Program not found</p>
          <Button variant="ghost" onClick={() => navigate("/")} className="mt-4"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentPI = program.pis.find(pi => pi.status === "in-progress");
  const sprintData = currentPI?.sprints || [];

  const piPredData = program.pis.filter(pi => pi.status !== "planned").map(pi => ({
    pi: pi.label,
    predictability: pi.predictability,
  }));

  const downstreamPrograms = portfolioData.programs.filter(p =>
    p.dependencies.some(d => d.to === program.name)
  );

  const blockedDeps = program.dependencies.filter(d => d.status === "blocked");

  const crossProgramDeps = portfolioData.programs.flatMap(p =>
    p.dependencies.filter(d => d.from === program.name || d.to === program.name)
  ).filter((dep, i, arr) => arr.findIndex(d => d.from === dep.from && d.to === dep.to) === i);

  const getBlockedDownstreamCount = (depTo: string) => {
    return portfolioData.programs.filter(p => p.dependencies.some(d => d.to === depTo && d.status === "blocked")).length;
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="rounded-xl shrink-0 self-start flex items-center gap-1.5 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" />Portfolio Dashboard</Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{program.name}</h1>
              <StatusBadge className={healthColor(program.health)}>{healthLabel(program.health)}</StatusBadge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground/90 mt-2 leading-relaxed">{program.description}</p>
            {PROGRAM_LEDE[program.id] && (
              <div className="mt-3 rounded-lg border-l-4 border-l-primary/30 bg-muted/30 px-4 py-3">
                <p className="text-sm text-foreground/80 leading-relaxed">{PROGRAM_LEDE[program.id]}</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <UserAvatar initials={program.managerInitials} name={program.manager} className="h-8 w-8 sm:h-9 sm:w-9" />
            <div>
              <span className="text-sm font-medium text-foreground">{program.manager}</span>
              <p className="text-[11px] text-muted-foreground">Program Manager</p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {[
            { label: "Velocity", value: `${program.velocity} SP`, icon: Activity, sub: `${program.velocityChange >= 0 ? "+" : ""}${program.velocityChange}%` },
            { label: "Portfolio Predictability", value: `${program.predictability}%`, icon: Target, sub: program.predictability >= 85 ? "Above benchmark" : "Below 85% target" },
            { label: "Defect Trend", value: `${program.defectTrend >= 0 ? "+" : ""}${program.defectTrend}%`, icon: Bug, sub: program.defectTrend <= 0 ? "Improving" : "Increasing" },
            { label: "Progress", value: `${program.progress}%`, icon: TrendingUp, sub: `${program.pis.filter(pi => pi.status === "completed").length} PIs completed` },
            { label: "Risks", value: programRisks.length, icon: AlertTriangle, sub: `${programRisks.filter(r => r.severity === "critical").length} critical` },
          ].map(kpi => (
            <Card key={kpi.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground/80 uppercase tracking-[0.1em] leading-tight">{kpi.label}</span>
                  <kpi.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </div>
                <div className="text-xl sm:text-[28px] font-bold text-foreground leading-none">{kpi.value}</div>
                <p className="text-xs sm:text-sm text-muted-foreground/80 mt-2 sm:mt-2.5 font-medium">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <HealthExplanation program={program} />
        </div>

        {/* Direct Dependencies */}
        {(program.dependencies.length > 0 || downstreamPrograms.length > 0) && (
          <Card className="mt-8">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2 mb-0"><Link2 className="h-4 w-4 text-muted-foreground" />Direct Dependencies</CardTitle>
                {downstreamPrograms.length > 0 && (
                  <span className="text-sm text-muted-foreground/80 font-medium">{downstreamPrograms.length} downstream program{downstreamPrograms.length > 1 ? "s" : ""} affected</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-5 px-4 sm:px-6">
              {blockedDeps.length > 0 && (
                <div className="p-3 sm:p-4 rounded-xl bg-danger/5 border border-danger/15">
                  <p className="text-xs font-bold text-danger mb-1.5 uppercase tracking-wide">Critical Dependency Chain</p>
                  <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                    {blockedDeps.map(d => `${d.from} → ${d.to}: ${d.description}`).join(". ")}.
                    This blocks delivery and impacts {downstreamPrograms.length} downstream program{downstreamPrograms.length !== 1 ? "s" : ""}.
                  </p>
                </div>
              )}
              <div className="space-y-3">
                {program.dependencies.map((dep, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 sm:py-4 px-3 sm:px-4 rounded-xl bg-muted/30">
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base text-foreground font-medium">{dep.from} → {dep.to}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1">{dep.description}</p>
                    </div>
                    <StatusBadge className={healthColor(dep.status)}>{healthLabel(dep.status)}</StatusBadge>
                  </div>
                ))}
              </div>
              {downstreamPrograms.length > 0 && (
                <div className="pt-4 border-t border-border/40">
                  <p className="text-xs font-semibold text-muted-foreground/80 mb-3 uppercase tracking-wide">Programs depending on {program.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {downstreamPrograms.map(p => (
                      <button key={p.id} onClick={() => navigate(`/program/${p.id}`)} className="text-sm font-medium px-2.5 py-1 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-foreground/80">
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cross-Program Dependencies */}
        {crossProgramDeps.length > 0 && (() => {
          const blockedCross = crossProgramDeps.filter(d => d.status === "blocked");
          const atRiskCross = crossProgramDeps.filter(d => d.status === "at-risk");
          const onTrackCross = crossProgramDeps.filter(d => d.status !== "blocked" && d.status !== "at-risk");
          const summaryParts: string[] = [];
          if (atRiskCross.length > 0) summaryParts.push(`${atRiskCross.length} at-risk relationship${atRiskCross.length > 1 ? "s" : ""}`);
          if (blockedCross.length > 0) summaryParts.push(`${blockedCross.length} blocking chain${blockedCross.length > 1 ? "s" : ""}`);
          if (onTrackCross.length > 0) summaryParts.push(`${onTrackCross.length} on track`);

          const renderGroup = (label: string, deps: typeof crossProgramDeps) => deps.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground/80 mb-2 uppercase tracking-wide">{label}</p>
              <div className="divide-y divide-border/40">
                {deps.map((dep, i) => {
                  const blockedCount = dep.status === "blocked" ? getBlockedDownstreamCount(dep.to) : 0;
                  return (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 sm:py-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-foreground">{dep.from} → {dep.to}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1 leading-relaxed">{dep.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {blockedCount > 0 && (
                          <span className="text-xs font-medium text-destructive">Blocks {blockedCount} program{blockedCount > 1 ? "s" : ""}</span>
                        )}
                        <StatusBadge className={healthColor(dep.status)}>{healthLabel(dep.status)}</StatusBadge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );

          return (
            <Card className="mt-8">
              <CardHeader className="pb-4 px-4 sm:px-6">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  Cross-Program Dependencies
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground/80 mt-1">Upstream and downstream relationships impacting this program</p>
                <p className="text-xs sm:text-sm font-medium text-foreground/70 mt-2">{summaryParts.join(" · ")}</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-6 px-4 sm:px-6">
                {renderGroup("Blocked", blockedCross)}
                {renderGroup("At Risk", atRiskCross)}
                {renderGroup("On Track", onTrackCross)}
              </CardContent>
            </Card>
          );
        })()}

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base font-semibold">PI Predictability Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={piPredData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="pi" tick={{ fontSize: 11, fill: "hsl(220,10%,54%)" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(220,10%,54%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} />
                    <Line type="monotone" dataKey="predictability" stroke="hsl(152,60%,36%)" strokeWidth={2} dot={{ r: 4 }} name="Predictability %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base font-semibold">Sprint Delivery ({currentPI?.label})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sprintData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "hsl(220,10%,54%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,54%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} />
                    <Bar dataKey="planned" fill="hsl(220,10%,74%)" radius={[5, 5, 0, 0]} name="Planned" />
                    <Bar dataKey="delivered" fill="hsl(152,60%,36%)" radius={[5, 5, 0, 0]} name="Delivered" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risks */}
        {programRisks.length > 0 && (
          <Card className="mt-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Risks & Blockers</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {programRisks.map(risk => (
                  <div key={risk.id} onClick={() => navigate(`/risk/${risk.id}`)} className="flex items-start gap-3 p-3 sm:p-4 rounded-xl hover:bg-muted/40 cursor-pointer transition-colors">
                    <UserAvatar initials={risk.ownerInitials} name={risk.owner} />
                    <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-muted-foreground/80 font-mono">{risk.id}</span>
                        <StatusBadge className={severityColor(risk.severity)}>{risk.severity}</StatusBadge>
                        <StatusBadge className="bg-muted text-muted-foreground">{mitigationLabel(risk.mitigationStatus)}</StatusBadge>
                      </div>
                      <p className="text-sm sm:text-base font-medium text-foreground">{risk.title}</p>
                      <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                        <span className="text-xs text-muted-foreground/80 flex items-center gap-1"><Clock className="h-3 w-3" />{risk.targetResolutionDate}</span>
                        <span className="text-xs text-muted-foreground/80">· {risk.owner}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <ProgramRoadmap roadmap={program.roadmap} />
        </div>

        {/* Progress */}
        <Card className="mt-8">
          <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Overall Progress</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={program.progress} className="h-2 flex-1" />
              <span className="text-xl font-bold text-foreground">{program.progress}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProgramDetail;
