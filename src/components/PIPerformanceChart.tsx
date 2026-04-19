import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import portfolioData from "@/data/portfolioDataV2";

export function PIPerformanceChart() {
  const { programs } = portfolioData;

  const piLabels = ["PI 24.1", "PI 24.2"];
  const data = piLabels.map(label => {
    let planned = 0, delivered = 0;
    programs.forEach(p => {
      const pi = p.pis.find(pi => pi.label === label);
      if (pi) { planned += pi.plannedSP; delivered += pi.deliveredSP; }
    });
    const predictability = planned > 0 ? Math.round((delivered / planned) * 100) : 0;
    return { pi: label, Planned: planned, Delivered: delivered, predictability };
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">PI Performance — Planned vs Delivered</CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">Story points committed versus delivered per Program Increment</p>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="pi" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => {
                  const d = data.find(d => d.pi === label);
                  return `${label} — Predictability: ${d?.predictability}%`;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Planned" fill="#94A3B8" radius={[5, 5, 0, 0]} name="Planned (SP)" />
              <Bar dataKey="Delivered" fill="#22C55E" radius={[5, 5, 0, 0]} name="Delivered (SP)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
