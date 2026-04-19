import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { ProgramV2 } from "@/types/portfolio";
import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BudgetPanelProps {
  programs: ProgramV2[];
  totalBudget: number;
  totalSpent: number;
  totalForecast: number;
}

const fmt = (v: number) =>
  v >= 1000 ? `$${(v / 1000).toFixed(1)}M` : `$${v}K`;

const pct = (a: number, b: number) => Math.round((a / b) * 100);

export function BudgetPanel({ programs, totalBudget, totalSpent, totalForecast }: BudgetPanelProps) {
  const navigate = useNavigate();
  const budgetVariance = totalBudget - totalForecast;
  const overBudget = budgetVariance < 0;

  // Build portfolio-level monthly burn by summing all programs
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const portfolioBurn = months.map(month => {
    let planned = 0, actual = 0, forecast = 0;
    programs.forEach(p => {
      const m = p.budget.monthlyBurn.find(b => b.month === month);
      if (m) {
        planned += m.planned;
        if (m.actual !== undefined) actual += m.actual;
        if (m.forecast !== undefined) forecast += m.forecast;
      }
    });
    return { month, planned, actual: actual || undefined, forecast: forecast || undefined };
  });

  // Programs sorted by variance (worst first)
  const sorted = [...programs].sort((a, b) => a.budget.variance - b.budget.variance);

  const totalHeadcount = programs.reduce((s, p) => s + p.budget.headcount, 0);
  const avgUtilization = Math.round(
    programs.reduce((s, p) => s + p.budget.headcountUtilization, 0) / programs.length
  );

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Budget & Resource Tracking</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "Total Portfolio Budget",
              value: fmt(totalBudget),
              sub: `${fmt(totalSpent)} spent (${pct(totalSpent, totalBudget)}%)`,
              icon: DollarSign,
              color: "text-foreground",
            },
            {
              label: "Forecast at Completion",
              value: fmt(totalForecast),
              sub: overBudget ? `${fmt(Math.abs(budgetVariance))} over budget` : `${fmt(budgetVariance)} under budget`,
              icon: overBudget ? TrendingUp : TrendingDown,
              color: overBudget ? "text-red-600" : "text-emerald-600",
            },
            {
              label: "Total Headcount",
              value: `${totalHeadcount} FTE`,
              sub: `Across ${programs.length} programs`,
              icon: Users,
              color: "text-foreground",
            },
            {
              label: "Avg Utilization",
              value: `${avgUtilization}%`,
              sub: avgUtilization >= 90 ? "At capacity — monitor burn" : avgUtilization >= 75 ? "Healthy utilization" : "Under-utilized — reallocate?",
              icon: TrendingUp,
              color: avgUtilization >= 90 ? "text-amber-600" : "text-emerald-600",
            },
          ].map(kpi => (
            <div key={kpi.label} className="bg-muted/40 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{kpi.label}</span>
                <kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} />
              </div>
              <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Burn chart */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Portfolio Monthly Burn ($K)</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={portfolioBurn} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="gradPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "currentColor" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "currentColor" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 6 }}
                  formatter={(v: number, name: string) => [`$${v}K`, name]}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="planned" name="Planned" stroke="#94a3b8" strokeWidth={1.5} fill="url(#gradPlanned)" dot={false} />
                <Area type="monotone" dataKey="actual" name="Actual" stroke="#3b82f6" strokeWidth={2} fill="url(#gradActual)" dot={{ r: 3 }} connectNulls />
                <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5,3" fill="url(#gradForecast)" dot={false} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Per-program variance table */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Program Budget Variance</p>
            <div className="space-y-1.5">
              {sorted.map(p => {
                const pctSpent = pct(p.budget.spent, p.budget.totalBudget);
                const over = p.budget.variance < 0;
                return (
                  <div key={p.id} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/program/${p.id}`)}>
                    <div className="w-28 shrink-0">
                      <p className="text-[10px] font-medium truncate">{p.name.split(" ")[0]} {p.name.split(" ")[1] ?? ""}</p>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-1.5 relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(pctSpent, 100)}%`,
                          background: over ? "#ef4444" : "#3b82f6",
                        }}
                      />
                    </div>
                    <div className={`text-[10px] font-semibold w-16 text-right shrink-0 ${over ? "text-red-600" : "text-emerald-600"}`}>
                      {over ? "−" : "+"}{fmt(Math.abs(p.budget.variance))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Over budget</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Under budget</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
