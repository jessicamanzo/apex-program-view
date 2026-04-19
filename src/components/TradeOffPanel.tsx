import portfolioData from "@/data/portfolioDataV2";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TradeOffScenario } from "@/types/portfolio";
import { Scale, TrendingDown, TrendingUp, Clock, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TradeOffPanelProps {
  tradeOffs: TradeOffScenario[];
}

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  immediate: { label: "Immediate", color: "text-red-700", bg: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" },
  "this-week": { label: "This Week", color: "text-amber-700", bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800" },
  "this-pi": { label: "This PI", color: "text-blue-700", bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" },
};

function ImpactBar({ value, max, positive }: { value: number; max: number; positive: boolean }) {
  const pct = Math.abs(value / max) * 100;
  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${positive ? "bg-emerald-500" : "bg-red-500"}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function ImpactRow({ label, aVal, bVal, format, lowerIsBetter = false }:
  { label: string; aVal: number; bVal: number; format: (v: number) => string; lowerIsBetter?: boolean }) {
  const aWins = lowerIsBetter ? aVal <= bVal : aVal >= bVal;
  return (
    <div className="grid grid-cols-3 items-center text-xs py-1 border-b border-border/40 last:border-0">
      <div className={`font-medium text-right pr-3 ${aWins ? "text-emerald-600 font-semibold" : "text-foreground"}`}>
        {format(aVal)}
      </div>
      <div className="text-center text-[10px] text-muted-foreground font-medium">{label}</div>
      <div className={`font-medium text-left pl-3 ${!aWins ? "text-emerald-600 font-semibold" : "text-foreground"}`}>
        {format(bVal)}
      </div>
    </div>
  );
}

export function TradeOffPanel({ tradeOffs }: TradeOffPanelProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(tradeOffs[0]?.id ?? null);

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Decision Trade-Offs</CardTitle>
          <span className="ml-auto text-xs text-muted-foreground">Quantified impact • Decisions requiring leadership action</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tradeOffs.map(t => {
          const isOpen = expanded === t.id;
          const urgency = URGENCY_CONFIG[t.urgency];

          return (
            <div
              key={t.id}
              className={`rounded-xl border transition-all ${urgency.bg}`}
            >
              {/* Header */}
              <button
                className="w-full flex items-start gap-3 p-4 text-left"
                onClick={() => setExpanded(isOpen ? null : t.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-semibold ${urgency.color} border-current`}>
                      {urgency.label}
                    </Badge>
                    <button onClick={(e) => { e.stopPropagation(); const p = portfolioData.programs.find(p => p.id === t.programId); if(p) navigate(`/program/${p.id}`); }} className="text-[10px] text-blue-600 hover:underline">{t.programName} →</button>
                  </div>
                  <p className="text-sm font-semibold leading-snug">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.decision}</p>
                </div>
                <div className="shrink-0 mt-1">
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Detail */}
              {isOpen && (
                <div className="px-4 pb-4">
                  {/* Options header */}
                  <div className="grid grid-cols-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    <div className="text-right pr-3">
                      Option A {t.recommendedOption === "a" && <span className="text-emerald-600">★ Rec</span>}
                    </div>
                    <div className="text-center">vs.</div>
                    <div className="text-left pl-3">
                      Option B {t.recommendedOption === "b" && <span className="text-emerald-600">★ Rec</span>}
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="grid grid-cols-3 mb-3">
                    <div className={`text-right pr-3 text-xs font-semibold ${t.recommendedOption === "a" ? "text-emerald-700" : "text-foreground"}`}>
                      {t.option_a.label}
                    </div>
                    <div />
                    <div className={`text-left pl-3 text-xs font-semibold ${t.recommendedOption === "b" ? "text-emerald-700" : "text-foreground"}`}>
                      {t.option_b.label}
                    </div>
                  </div>

                  {/* Impact comparison table */}
                  <div className="bg-background/60 rounded-lg px-3 py-2 mb-3">
                    <ImpactRow
                      label="Revenue Impact"
                      aVal={t.option_a.revenueImpact}
                      bVal={t.option_b.revenueImpact}
                      format={v => v === 0 ? "$0" : `${v > 0 ? "+" : ""}$${Math.abs(v).toFixed(1)}M`}
                      lowerIsBetter={false}
                    />
                    <ImpactRow
                      label="Schedule Impact"
                      aVal={t.option_a.scheduleImpact}
                      bVal={t.option_b.scheduleImpact}
                      format={v => v === 0 ? "None" : `+${v}w delay`}
                      lowerIsBetter={true}
                    />
                    <ImpactRow
                      label="Risk Change"
                      aVal={t.option_a.riskChange}
                      bVal={t.option_b.riskChange}
                      format={v => v === 0 ? "Neutral" : `${v > 0 ? "+" : ""}${v} pts`}
                      lowerIsBetter={true}
                    />
                    <ImpactRow
                      label="Cost Impact"
                      aVal={t.option_a.costImpact}
                      bVal={t.option_b.costImpact}
                      format={v => v === 0 ? "$0" : `${v < 0 ? "−" : "+"}$${Math.abs(v)}K`}
                      lowerIsBetter={true}
                    />
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className={`rounded-lg p-2.5 ${t.recommendedOption === "a" ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800" : "bg-muted/50"}`}>
                      {t.recommendedOption === "a" && (
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold mb-1 text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> RECOMMENDED
                        </div>
                      )}
                      <p className="text-muted-foreground leading-relaxed">{t.option_a.description}</p>
                    </div>
                    <div className={`rounded-lg p-2.5 ${t.recommendedOption === "b" ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800" : "bg-muted/50"}`}>
                      {t.recommendedOption === "b" && (
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold mb-1 text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> RECOMMENDED
                        </div>
                      )}
                      <p className="text-muted-foreground leading-relaxed">{t.option_b.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
