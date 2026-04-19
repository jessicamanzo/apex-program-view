import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { ProgramV2 } from "@/types/portfolio";
import { Target, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PredictabilityDetailProps {
  programs: ProgramV2[];
}

const TREND_ICON: Record<string, React.ElementType> = {
  improving: TrendingUp,
  stable: Minus,
  degrading: TrendingDown,
};

const TREND_COLOR: Record<string, string> = {
  improving: "text-emerald-600",
  stable: "text-blue-500",
  degrading: "text-red-500",
};

const FORMULA_TOOLTIP = `Predictability = (Delivery Accuracy × 0.5) + (Scope Stability × 0.35) + Quality Adjustment (±10)

• Delivery Accuracy: Delivered SP ÷ Planned SP × 100
• Scope Stability: 100 − scope change % during PI
• Quality Adjustment: Defect trend bonus/penalty
• Confidence interval: ±1σ across last 4 PIs`;

// Build a multi-program trend dataset across PI labels
function buildTrendData(programs: ProgramV2[]) {
  const piLabels = ["PI 23.3", "PI 23.4", "PI 24.1", "PI 24.2"];
  return piLabels.map(pi => {
    const row: Record<string, number | string> = { pi };
    programs.forEach(p => {
      const pt = p.predictabilityBreakdown.trendData.find(d => d.pi === pi);
      if (pt) row[p.name.split(" ").slice(0,3).join(" ")] = pt.value;
    });
    return row;
  });
}

const PROGRAM_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

export function PredictabilityDetail({ programs }: PredictabilityDetailProps) {
  const navigate = useNavigate();
  const trendData = buildTrendData(programs);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Predictability Analysis</CardTitle>
          <UITooltip>
            <TooltipTrigger asChild>
              <button className="ml-1">
                <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs whitespace-pre-line">
              {FORMULA_TOOLTIP}
            </TooltipContent>
          </UITooltip>
        </div>
      </CardHeader>
      <CardContent>
        {/* Formula breakdown */}
        <div className="bg-muted/30 rounded-lg p-3 mb-4 text-xs">
          <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-2">Formula</p>
          <div className="font-mono text-xs text-foreground/80 leading-relaxed">
            Predictability = (Delivery% × 0.50) + (Scope Stability × 0.35) + Quality Adj. (±10)
          </div>
        </div>

        {/* Per-program breakdown */}
        <div className="space-y-2 mb-5">
          {programs.map((p, i) => {
            const b = p.predictabilityBreakdown;
            const TrendIcon = TREND_ICON[b.trend];
            const color = PROGRAM_COLORS[i % PROGRAM_COLORS.length];

            return (
              <div key={p.id} className="rounded-lg border border-border/50 p-2.5 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => navigate(`/program/${p.id}`)}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-xs font-semibold">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground">
                      CI: [{b.confidenceInterval[0]}%, {b.confidenceInterval[1]}%]
                    </span>
                    <TrendIcon className={`h-3.5 w-3.5 ${TREND_COLOR[b.trend]}`} />
                    <span className="text-sm font-bold" style={{ color }}>
                      {p.predictability}%
                    </span>
                  </div>
                </div>
                {/* Mini breakdown bars */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Delivery", value: b.deliveryAccuracy, weight: "50%" },
                    { label: "Scope", value: b.commitmentChange, weight: "35%" },
                    { label: "Quality adj.", value: b.defectAdjustment + 50, weight: "15%" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                        <span>{item.label}</span>
                        <span className="font-medium">
                          {item.label === "Quality adj."
                            ? `${b.defectAdjustment > 0 ? "+" : ""}${b.defectAdjustment}`
                            : `${item.value}%`}
                        </span>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(item.value, 100)}%`,
                            background: item.value >= 85 ? "#10b981" : item.value >= 70 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trend chart */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Predictability Trend — Last 4 PIs
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={trendData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <XAxis dataKey="pi" tick={{ fontSize: 9, fill: "currentColor" }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 9, fill: "currentColor" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} formatter={(v: number) => [`${v}%`]} />
              <ReferenceLine y={85} stroke="#10b981" strokeDasharray="4,2" strokeOpacity={0.6} label={{ value: "85% target", fontSize: 9, fill: "#10b981", position: "right" }} />
              {programs.map((p, i) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={p.name.split(" ").slice(0,3).join(" ")}
                  stroke={PROGRAM_COLORS[i % PROGRAM_COLORS.length]}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
