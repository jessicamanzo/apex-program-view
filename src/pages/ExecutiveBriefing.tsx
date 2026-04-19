import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ArrowRight, TrendingDown, DollarSign, Calendar, Printer } from "lucide-react";
import portfolioData from "@/data/portfolioDataV2";
import { useNavigate } from "react-router-dom";

export default function ExecutiveBriefing() {
  const navigate = useNavigate();
  const { programs, risks, tradeOffs, currentPI, currentPIWeek, totalPIWeeks, avgPredictability, totalBudget, totalForecast } = portfolioData;

  const blocked = programs.filter(p => p.health === "blocked");
  const atRisk = programs.filter(p => p.health === "at-risk");
  const onTrack = programs.filter(p => p.health === "on-track");
  const criticalRisks = risks.filter(r => r.severity === "critical");
  const budgetVariance = totalBudget - totalForecast;
  const overBudget = budgetVariance < 0;

  const fmt = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1)}M` : `$${v}K`;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <DashboardLayout>
      <div className="max-w-[960px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Briefing header */}
        <div className="flex items-start justify-between flex-wrap gap-3 border-b pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Nova Systems · Executive Briefing</p>
            <h1 className="text-2xl font-bold text-foreground mt-1">Portfolio Status — {currentPI}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Week {currentPIWeek} of {totalPIWeeks} · {today}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors print:hidden"
            >
              <Printer className="h-3.5 w-3.5" />
              Export for meeting
            </button>

          </div>
        </div>

        {/* So-what lede */}
        <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 px-5 py-4">
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            This briefing covers <strong>1 blocked program</strong> cascading into <strong>4 at-risk programs</strong>.
            {" "}$3.2M in Q2 ARR depends on resolving the SOC 2 auditor dependency before May 15.
            {" "}A decision on the audit acceleration option is needed from CTO + CFO this week.
          </p>
        </div>

        {/* ── SECTION 1: STATUS ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">01 · Status</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "On Track", value: onTrack.length, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 },
              { label: "At Risk", value: atRisk.length, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800", icon: AlertTriangle },
              { label: "Blocked", value: blocked.length, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800", icon: AlertTriangle },
              { label: "Predictability", value: `${avgPredictability}%`, color: avgPredictability >= 85 ? "text-emerald-600" : avgPredictability >= 70 ? "text-amber-600" : "text-red-600", bg: "bg-muted/40", icon: TrendingDown },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</span>
                  <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                </div>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Program status list */}
          <div className="mt-3 rounded-xl border bg-card overflow-hidden">
            {programs.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 px-4 py-2.5 ${i < programs.length - 1 ? "border-b" : ""}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${p.health === "on-track" ? "bg-emerald-500" : p.health === "at-risk" ? "bg-amber-500" : "bg-red-500"}`} />
                <span className="text-sm font-medium flex-1">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.manager}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  p.health === "on-track" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" :
                  p.health === "at-risk" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
                  "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}>
                  {p.health === "on-track" ? "On Track" : p.health === "at-risk" ? "At Risk" : "Blocked"}
                </span>
                <span className="text-xs text-muted-foreground w-16 text-right">{p.predictability}% pred.</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: RISK ───────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">02 · Risk</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* The main story callout */}
          <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 mb-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-800 dark:text-red-300 mb-1">Primary Blocker — Critical Path at Risk</p>
                <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
                  <strong>ML Platform Reliability</strong> cannot deploy to production until <strong>Security & Compliance</strong> completes the SOC 2 Type II audit.
                  This single dependency is cascading into <strong>AI Feature Delivery</strong> and <strong>Enterprise Customer Onboarding</strong>,
                  threatening <strong>$3.2M in Q2 ARR</strong> tied to a May 15 enterprise activation SLA.
                </p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-2 font-medium">
                  Root cause: External auditor scheduling conflict. Auditor has no availability until Q3 under current plan.
                </p>
              </div>
            </div>
          </div>

          {/* Critical risks */}
          <div className="space-y-2">
            {criticalRisks.map(r => (
              <div key={r.id} className="rounded-lg border bg-card px-4 py-3 flex items-start gap-3">
                <span className="text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0 mt-0.5">Critical</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.impact}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{r.programName}</span>
              </div>
            ))}
          </div>

          {/* Budget callout */}
          <div className={`mt-3 rounded-lg border px-4 py-3 flex items-center gap-3 ${overBudget ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200" : "bg-muted/30"}`}>
            <DollarSign className={`h-4 w-4 shrink-0 ${overBudget ? "text-amber-600" : "text-muted-foreground"}`} />
            <div className="flex-1">
              <span className="text-sm font-medium">Portfolio budget: {fmt(totalBudget)} allocated · {fmt(Math.abs(budgetVariance))} {overBudget ? "projected overrun" : "projected under"}</span>
            </div>
            <span className={`text-xs font-semibold ${overBudget ? "text-amber-700" : "text-emerald-600"}`}>
              Forecast: {fmt(totalForecast)}
            </span>
          </div>
        </div>

        {/* ── SECTION 3: DECISION NEEDED ───────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">03 · Decision Needed</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            {portfolioData.tradeOffs.map(t => {
              const rec = t.recommendedOption === "a" ? t.option_a : t.option_b;
              const urgencyColor = t.urgency === "immediate" ? "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200" :
                t.urgency === "this-week" ? "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200" :
                "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200";
              return (
                <div key={t.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${urgencyColor}`}>
                        {t.urgency === "immediate" ? "Immediate" : t.urgency === "this-week" ? "This Week" : "This PI"}
                      </span>
                      <span className="text-sm font-bold">{t.title}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{t.decision}</p>
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Recommended: {rec.label}</span>
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">{rec.description}</p>
                    <div className="flex gap-4 mt-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {rec.revenueImpact !== 0 && <span>Revenue: {rec.revenueImpact > 0 ? "+" : ""}{rec.revenueImpact > 0 ? `$${rec.revenueImpact}M` : `-$${Math.abs(rec.revenueImpact)}M`}</span>}
                      {rec.scheduleImpact !== 0 && <span>Schedule: {rec.scheduleImpact > 0 ? `+${rec.scheduleImpact}w` : `${rec.scheduleImpact}w`}</span>}
                      {rec.costImpact !== 0 && <span>Cost: +${rec.costImpact}K</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 4: MILESTONES ────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">04 · Key Milestones This PI</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="rounded-xl border bg-card overflow-hidden">
            {programs.flatMap(p =>
              p.roadmap
                .filter(r => r.status === "in-progress")
                .flatMap(r => r.milestones.map(m => ({ program: p.name, ...m })))
            ).sort((a, b) => { const order: Record<string,number> = { blocked: 0, "at-risk": 1, "on-track": 2, completed: 3 }; const so = (order[a.status] ?? 2) - (order[b.status] ?? 2); return so !== 0 ? so : a.targetDate.localeCompare(b.targetDate); }).slice(0, 8).map((m, i, arr) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-2.5 ${i < arr.length - 1 ? "border-b" : ""}`}>
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground w-20 shrink-0">
                  {new Date(m.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="text-sm flex-1">{m.name}</span>
                <button onClick={() => { const p = portfolioData.programs.find(prog => prog.name === m.program); if(p) navigate(`/program/${p.id}`); }} className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors">{m.program.split(" ").slice(0, 2).join(" ")}</button>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  m.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                  m.status === "on-track" ? "bg-emerald-100 text-emerald-700" :
                  m.status === "at-risk" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {m.status === "on-track" ? "On Track" : m.status === "at-risk" ? "At Risk" : m.status === "blocked" ? "Blocked" : "Done"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPLICIT ASK ─────────────────────────────────────── */}
        <div className="rounded-xl border-2 border-foreground/10 bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">What I Need From This Meeting</p>
          <div className="space-y-2">
            {[
              { who: "CTO + CFO", ask: "Decision on Option A (engage premium audit firm at $340K) to accelerate SOC 2 by 3 weeks. Without this, May 15 enterprise activation is at risk." },
              { who: "CTO", ask: "Priority call: approve ML infra retention packages for 2 at-risk engineers before end of week. Loss of either adds 6–8 weeks to production timeline." },
              { who: "CPO", ask: "Confirm scope freeze on AI Feature Delivery — no new feature additions until ML Platform unblocks. Teams need a clear hold signal." },
            ].map(item => (
              <div key={item.who} className="flex gap-3 items-start">
                <span className="text-[10px] font-bold bg-foreground/10 rounded px-1.5 py-0.5 shrink-0 mt-0.5 uppercase tracking-wide">{item.who}</span>
                <p className="text-xs text-foreground/85 leading-relaxed">{item.ask}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="border-t pt-4 text-xs text-muted-foreground">
          <span>Nova Systems · {currentPI} · Week {currentPIWeek} of {totalPIWeeks} · Simulated portfolio · Fictional data</span>
        </div>

      </div>
    </DashboardLayout>
  );
}
