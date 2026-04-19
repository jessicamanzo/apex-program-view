import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, FileDown, Copy, Send, Mail, Check, Loader2 } from "lucide-react";
import { StatusBadge, STATUS_COLORS } from "@/components/StatusHelpers";
import portfolioData from "@/data/portfolioData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

function generateSummary() {
  const { programs, risks, currentPI, currentPIWeek, totalPIWeeks, avgVelocity, avgPredictability } = portfolioData;
  const blocked = programs.filter(p => p.health === "blocked");
  const atRisk = programs.filter(p => p.health === "at-risk");
  const onTrack = programs.filter(p => p.health === "on-track");
  const criticalRisks = risks.filter(r => r.severity === "critical");
  const highRisks = risks.filter(r => r.severity === "high");
  const decliningPrograms = programs.filter(p => p.velocityChange < -5);
  const blockedDeps = programs.flatMap(p => p.dependencies.filter(d => d.status === "blocked"));
  const atRiskDeps = programs.flatMap(p => p.dependencies.filter(d => d.status === "at-risk"));

  const piParts = currentPI.match(/(\d+)\.(\d+)/);
  const nextPI = piParts ? `PI ${piParts[1]}.${parseInt(piParts[2]) + 1}` : "next PI";

  const confidencePct = Math.round(
    (avgPredictability * 0.5) + ((onTrack.length / programs.length) * 100 * 0.3) + ((1 - criticalRisks.length / Math.max(risks.length, 1)) * 100 * 0.2)
  );
  const confidence = confidencePct >= 85 ? "High" as const : confidencePct >= 70 ? "Medium" as const : "Low" as const;

  const affectedByBlockers = new Set(blockedDeps.map(d => d.to));
  const downstreamCount = programs.filter(p =>
    p.dependencies.some(d => affectedByBlockers.has(d.to) || blockedDeps.some(bd => bd.from === p.name))
  ).length;

  const atRiskWithLowScope = atRisk.filter(p => p.healthDimensions.scopeStability < 75);

  return {
    date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    confidencePct,
    confidence,
    avgPredictability,
    snapshot: blocked.length > 0
      ? `Portfolio predictability remains at ${avgPredictability}%, below the 85% SAFe target, while execution predictability declines to ${confidencePct}% (${confidence}) when adjusted for active dependency and risk signals. ${blocked.length} program${blocked.length > 1 ? "s are" : " is"} blocked with ${criticalRisks.length} critical risk${criticalRisks.length !== 1 ? "s" : ""} and ${blockedDeps.length} blocked dependency chain${blockedDeps.length !== 1 ? "s" : ""} requiring immediate executive attention. ${onTrack.length} of ${programs.length} programs remain on track, but cascading dependency risk threatens ${nextPI} trajectory.`
      : atRisk.length > 0
      ? `Portfolio predictability remains at ${avgPredictability}%, below the 85% SAFe target, while execution predictability declines to ${confidencePct}% (${confidence}) when adjusted for active dependency and risk signals. ${atRisk.length} program${atRisk.length > 1 ? "s" : ""} at risk, ${onTrack.length} of ${programs.length} on track. Current trend puts ${currentPI} commitments at risk without immediate course correction.`
      : `Portfolio predictability remains at ${avgPredictability}% — above the 85% SAFe benchmark. Execution predictability is at ${confidencePct}% (${confidence}). All ${programs.length} programs on track. Current trajectory supports on-time delivery through ${nextPI}.`,
    riskDriverLead: blockedDeps.length > 0
      ? `Primary root cause: ${blockedDeps.length} unresolved cross-program dependency chain${blockedDeps.length !== 1 ? "s" : ""} blocking downstream delivery across ${downstreamCount} program${downstreamCount !== 1 ? "s" : ""}.`
      : criticalRisks.length > 0
      ? `Primary root cause: ${criticalRisks.length} critical risk${criticalRisks.length !== 1 ? "s" : ""} concentrated in programs with declining velocity and scope instability.`
      : decliningPrograms.length > 0
      ? `Primary root cause: capacity constraints and scope changes driving velocity decline in ${decliningPrograms.length} program${decliningPrograms.length !== 1 ? "s" : ""}.`
      : "No material risk drivers identified this week.",
    riskDrivers: [
      ...(blockedDeps.length > 0 ? [`Blocked dependency chain${blockedDeps.length > 1 ? "s" : ""}: ${blockedDeps.map(d => `${d.from} → ${d.to}`).join(", ")}`] : []),
      ...(atRiskDeps.length > 0 ? [`${atRiskDeps.length} at-risk dependency relationship${atRiskDeps.length > 1 ? "s" : ""} may escalate: ${atRiskDeps.map(d => `${d.from} → ${d.to}`).join(", ")}`] : []),
      ...(criticalRisks.length > 0 ? [`${criticalRisks.length} critical risk${criticalRisks.length > 1 ? "s" : ""}: ${criticalRisks.slice(0, 3).map(r => `${r.title} (${r.programName})`).join("; ")}`] : []),
      ...(highRisks.length > 0 ? [`${highRisks.length} high-severity risk${highRisks.length > 1 ? "s" : ""} under monitoring`] : []),
      ...(decliningPrograms.length > 0 ? [`Velocity decline in ${decliningPrograms.map(p => `${p.name} (${p.velocityChange}%)`).join(", ")}`] : []),
      ...(atRiskWithLowScope.length > 0 ? [`${atRiskWithLowScope.map(p => p.name).join(", ")} — scope stability below 75%, schedule variance negative`] : []),
    ],
    deliveryTrends: [
      `Average velocity: ${avgVelocity} SP/sprint (${decliningPrograms.length > 0 ? "declining" : "stable"} trend)`,
      `Portfolio predictability: ${avgPredictability}% (${avgPredictability >= 85 ? "above" : "below"} 85% SAFe target)`,
      `Execution predictability: ${confidencePct}% (${confidence}) — drops from ${avgPredictability}% when adjusted for dependency chain risk, indicating systemic delivery exposure`,
      `${onTrack.length}/${programs.length} programs on track, ${atRisk.length} at risk, ${blocked.length} blocked`,
      `${currentPI} is in Week ${currentPIWeek} of ${totalPIWeeks} — ${blocked.length > 0 ? "critical window for recovery" : "on pace for planned delivery"}`,
      `Open risks: ${risks.length} total (${criticalRisks.length} critical, ${highRisks.length} high)`,
    ],
    impact: blocked.length > 0
      ? [
          `If unresolved within 48 hours, ${blocked[0].name} delay will cascade to ${blocked[0].dependencies.length} dependent program${blocked[0].dependencies.length !== 1 ? "s" : ""}`,
          `If blockers persist through this sprint, expect 4–6 week schedule impact on ${nextPI} milestones`,
          `If no action is taken, execution predictability will drop below 55% within 2 sprints`,
        ]
      : decliningPrograms.length > 0
      ? [
          `If velocity decline continues, ${currentPI} delivery will be reduced by ~15–20%`,
          `If unaddressed this sprint, execution predictability will fall below 70%, putting ${nextPI} commitments at risk`,
          `If resources are not reallocated within 48 hours, at-risk programs will escalate to blocked status`,
        ]
      : [
          `Current trajectory supports on-time delivery for all ${currentPI} commitments`,
          `No material schedule risk identified for ${nextPI} planning`,
        ],
    actions: blocked.length > 0
      ? [
          { urgency: "Next 24 Hours", action: `Escalate ${blocked[0].name} blockers to VP Engineering — requires cross-team dependency resolution` },
          { urgency: "Next 48 Hours", action: `Conduct emergency cross-program dependency workshop with all ${blocked.length} blocked program lead${blocked.length > 1 ? "s" : ""}` },
          { urgency: "This Week", action: `Re-sequence ${nextPI} scope to absorb delay buffer. Reduce scope for non-critical features` },
          { urgency: "This Sprint", action: `Reallocate 2–3 engineers from ${onTrack[0]?.name || "stable programs"} to accelerate blocker resolution` },
        ]
      : atRisk.length > 0
      ? [
          { urgency: "Next 48 Hours", action: `Schedule risk review for ${atRisk.map(p => p.name).join(", ")} — assess root cause of velocity decline` },
          { urgency: "This Week", action: "Freeze scope changes for at-risk programs. Prioritize existing commitments over new features" },
          { urgency: "This Sprint", action: "Reallocate capacity from stable programs to stabilize at-risk delivery" },
        ]
      : [
          { urgency: "This Week", action: `Begin ${nextPI} planning preparation. Ensure backlog refinement is 2 sprints ahead` },
          { urgency: "Ongoing", action: "Maintain current cadence and monitoring. No intervention required" },
        ],
    programs: programs.map(p => ({
      name: p.name,
      health: p.health,
      predictability: p.predictability,
      velocity: p.velocity,
      velocityChange: p.velocityChange,
      riskCount: p.riskCount,
    })),
    totalRisks: risks.length,
    criticalRiskCount: criticalRisks.length,
    highRiskCount: highRisks.length,
    blockedDepCount: blockedDeps.length,
    atRiskDepCount: atRiskDeps.length,
  };
}

function SummaryContent({ summary }: { summary: ReturnType<typeof generateSummary> }) {
  const confColor = summary.confidence === "High" ? "bg-emerald-50 text-emerald-800 border border-emerald-500/40"
    : summary.confidence === "Medium" ? "bg-amber-50 text-amber-800 border border-amber-500/40"
    : "bg-red-50 text-red-800 border border-red-500/40";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">Weekly Executive Summary</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{summary.date}</p>
          <p className="text-[11px] text-muted-foreground/80 mt-1 italic">Generated from current portfolio, program, risk, and dependency data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="text-xs text-muted-foreground font-semibold block">Execution Predictability</span>
            <span className="text-xl sm:text-2xl font-bold text-foreground">{summary.confidencePct}%</span>
          </div>
          <StatusBadge className={confColor}>{summary.confidence}</StatusBadge>
        </div>
      </div>

      <Card className="border-l-4" style={{ borderLeftColor: summary.confidence === "High" ? STATUS_COLORS.onTrack : summary.confidence === "Medium" ? STATUS_COLORS.atRisk : STATUS_COLORS.blocked }}>
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-sm font-bold text-foreground mb-2">Executive Snapshot</h3>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">{summary.snapshot}</p>
        </CardContent>
      </Card>

      {summary.riskDrivers.length > 0 && (
        <Card>
          <CardContent className="p-4 sm:p-5">
            <h3 className="text-sm font-bold text-foreground mb-2">What's Driving Risk</h3>
            <p className="text-xs sm:text-sm text-foreground/80 mb-3">{summary.riskDriverLead}</p>
            <ul className="space-y-2">
              {summary.riskDrivers.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] mt-1.5 sm:mt-2 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Delivery Trends</h3>
          <ul className="space-y-2">
            {summary.deliveryTrends.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-1.5 sm:mt-2 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Impact if Unresolved</h3>
          <ul className="space-y-2">
            {summary.impact.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] mt-1.5 sm:mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Recommended Actions</h3>
          <div className="space-y-3">
            {summary.actions.map((a, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3">
                <span className="text-[10px] font-bold text-white bg-foreground rounded px-2 py-0.5 shrink-0 self-start uppercase tracking-wider whitespace-nowrap">
                  {a.urgency}
                </span>
                <p className="text-xs sm:text-sm text-foreground">{a.action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 sm:p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Program Status Overview</h3>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-2">Program</th>
                  <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-2">Health</th>
                  <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-2">Portfolio Predictability</th>
                  <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-2">Velocity</th>
                  <th className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-2">Risks</th>
                </tr>
              </thead>
              <tbody>
                {summary.programs.map(p => (
                  <tr key={p.name} className="border-b border-border/30">
                    <td className="py-2.5 font-medium text-foreground">{p.name}</td>
                    <td className="py-2.5">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.health === "on-track" ? STATUS_COLORS.onTrack : p.health === "at-risk" ? STATUS_COLORS.atRisk : STATUS_COLORS.blocked }} />
                        <span className="text-foreground capitalize">{p.health === "on-track" ? "On Track" : p.health === "at-risk" ? "At Risk" : "Blocked"}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-center font-semibold" style={{ color: p.predictability >= 85 ? STATUS_COLORS.onTrack : p.predictability >= 70 ? STATUS_COLORS.atRisk : STATUS_COLORS.blocked }}>
                      {p.predictability}%
                    </td>
                    <td className="py-2.5 text-center text-foreground">
                      {p.velocity} SP
                      <span className={`ml-1 text-xs ${p.velocityChange >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        ({p.velocityChange >= 0 ? "+" : ""}{p.velocityChange}%)
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-foreground">{p.riskCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile card list */}
          <div className="sm:hidden space-y-3">
            {summary.programs.map(p => (
              <div key={p.name} className="p-3 rounded-lg border border-border/40 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.health === "on-track" ? STATUS_COLORS.onTrack : p.health === "at-risk" ? STATUS_COLORS.atRisk : STATUS_COLORS.blocked }} />
                    <span className="text-xs text-foreground capitalize">{p.health === "on-track" ? "On Track" : p.health === "at-risk" ? "At Risk" : "Blocked"}</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Pred.</p>
                    <p className="text-sm font-semibold" style={{ color: p.predictability >= 85 ? STATUS_COLORS.onTrack : p.predictability >= 70 ? STATUS_COLORS.atRisk : STATUS_COLORS.blocked }}>{p.predictability}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Velocity</p>
                    <p className="text-sm font-semibold text-foreground">{p.velocity} SP</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Risks</p>
                    <p className="text-sm font-semibold text-foreground">{p.riskCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function summaryToText(summary: ReturnType<typeof generateSummary>): string {
  let text = `WEEKLY EXECUTIVE SUMMARY\n${summary.date}\nGenerated from current portfolio, program, risk, and dependency data.\nExecution Predictability: ${summary.confidencePct}% (${summary.confidence})\n\n`;
  text += `EXECUTIVE SNAPSHOT\n${summary.snapshot}\n\n`;
  if (summary.riskDrivers.length > 0) {
    text += `WHAT'S DRIVING RISK\n${summary.riskDriverLead}\n${summary.riskDrivers.map(d => `• ${d}`).join("\n")}\n\n`;
  }
  text += `DELIVERY TRENDS\n${summary.deliveryTrends.map(t => `• ${t}`).join("\n")}\n\n`;
  text += `IMPACT IF UNRESOLVED\n${summary.impact.map(i => `• ${i}`).join("\n")}\n\n`;
  text += `RECOMMENDED ACTIONS\n${summary.actions.map(a => `[${a.urgency}] ${a.action}`).join("\n")}\n\n`;
  text += `PROGRAM STATUS\n${summary.programs.map(p => `${p.name}: ${p.health === "on-track" ? "On Track" : p.health === "at-risk" ? "At Risk" : "Blocked"} | Pred: ${p.predictability}% | Vel: ${p.velocity} SP (${p.velocityChange >= 0 ? "+" : ""}${p.velocityChange}%) | Risks: ${p.riskCount}`).join("\n")}`;
  return text;
}

const AISummary = () => {
  const [summary, setSummary] = useState<ReturnType<typeof generateSummary> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slackSent, setSlackSent] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [_emailSent, setEmailSent] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("Weekly Program Summary");
  const [emailBody, setEmailBody] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGenerate = () => {
    setGenerating(true);
    setSlackSent(false);
    setEmailSent(false);
    setTimeout(() => {
      const s = generateSummary();
      setSummary(s);
      setEmailBody(summaryToText(s));
      setGenerating(false);
    }, 1200);
  };

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summaryToText(summary));
    setCopied(true);
    toast({ title: "Copied to clipboard", description: "Summary copied in plain text format" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    if (!summary) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const text = summaryToText(summary);
    printWindow.document.write(`<html><head><title>Weekly Executive Summary</title><style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:40px;max-width:800px;margin:0 auto;color:#1a1a1a;line-height:1.6}h1{font-size:20px;margin-bottom:4px}pre{white-space:pre-wrap;font-family:inherit;font-size:13px}</style></head><body><pre>${text}</pre></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSlack = () => {
    setSlackSent(true);
    toast({ title: "Summary sent to Slack", description: "Posted to #program-ops channel" });
  };

  const handleEmailSend = () => {
    setEmailOpen(false);
    setEmailSent(true);
    toast({ title: "Email sent", description: `Summary sent to ${emailTo || "recipients"}` });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">AI Weekly Summary</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">AI-generated portfolio insights and recommendations for executive stakeholders</p>
        </div>

        {!summary && (
          <Card className="border-dashed">
            <CardContent className="p-8 sm:p-12 text-center">
              <Brain className="h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">Generate Executive Summary</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Analyze current portfolio data and generate a structured executive briefing with risk analysis, delivery trends, and prioritized recommendations.
              </p>
              <Button onClick={handleGenerate} disabled={generating} size="lg" className="gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                {generating ? "Analyzing portfolio data..." : "Generate AI Summary"}
              </Button>
            </CardContent>
          </Card>
        )}

        {summary && (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={handleGenerate} variant="outline" size="sm" className="gap-2" disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                Regenerate
              </Button>
              <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-2">
                <FileDown className="h-4 w-4" /> <span className="hidden sm:inline">Export</span> PDF
              </Button>
              <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button onClick={handleSlack} variant="outline" size="sm" className="gap-2" disabled={slackSent}>
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">{slackSent ? "Sent" : "Slack"}</span>
              </Button>
              <Button onClick={() => setEmailOpen(true)} variant="outline" size="sm" className="gap-2">
                <Mail className="h-4 w-4" /> <span className="hidden sm:inline">Email</span>
              </Button>
            </div>

            <div ref={summaryRef}>
              <SummaryContent summary={summary} />
            </div>
          </>
        )}

        <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
          <DialogContent className="sm:max-w-lg max-w-[calc(100vw-2rem)]">
            <DialogHeader>
              <DialogTitle>Send Summary via Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">To</label>
                <Input placeholder="recipient@company.com" value={emailTo} onChange={e => setEmailTo(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Subject</label>
                <Input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Body</label>
                <Textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={10} className="text-xs font-mono" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailOpen(false)}>Cancel</Button>
              <Button onClick={handleEmailSend} className="gap-2"><Mail className="h-4 w-4" /> Send Email</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AISummary;
