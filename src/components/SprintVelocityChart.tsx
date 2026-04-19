import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import portfolioData from "@/data/portfolioDataV2";

const PROGRAM_COLORS = ["#ef4444", "#f59e0b", "#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#14b8a6", "#64748b"];

export function SprintVelocityChart() {
  const { programs } = portfolioData;

  // Build sprint data per program for PI 24.2
  const sprintLabels = ["S1", "S2", "S3", "S4"];
  const data = sprintLabels.map(sprint => {
    const row: Record<string, number | string> = { sprint };
    programs.forEach(p => {
      const pi = p.pis.find(pi => pi.status === "in-progress");
      const s = pi?.sprints.find(s => s.sprint === sprint);
      if (s) row[p.name.split(" ")[0]] = s.velocity;
    });
    return row;
  });

  // Short names for legend
  const programNames = programs.map(p => p.name.split(" ")[0]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold">Sprint Velocity by Program — PI 24.2</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">Story points delivered per sprint, per program · Blocked programs show velocity decline</p>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="sprint" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v: number, name: string) => [`${v} SP`, name]}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              {programNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={PROGRAM_COLORS[i % PROGRAM_COLORS.length]}
                  strokeWidth={name === "ML" ? 2.5 : 1.5}
                  dot={{ r: 2 }}
                  strokeDasharray={name === "ML" ? "4,2" : "none"}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">ML = ML Platform Reliability (blocked — velocity in freefall)</p>
      </CardContent>
    </Card>
  );
}
