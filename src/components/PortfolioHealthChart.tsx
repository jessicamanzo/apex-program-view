import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Program, FilterOption } from "@/types/portfolio";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { STATUS_COLORS } from "@/components/StatusHelpers";

interface PortfolioHealthChartProps {
  programs: Program[];
  onSegmentClick?: (filter: FilterOption) => void;
  activeFilter?: FilterOption;
}

const HEALTH_MAP: Record<string, FilterOption> = {
  "On Track": "on-track",
  "At Risk": "at-risk",
  "Blocked": "blocked",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
      <span className="font-semibold text-foreground">{value} Program{value > 1 ? "s" : ""} {name}</span>
      <span className="block text-xs text-muted-foreground mt-0.5">Click to filter</span>
    </div>
  );
};

export function PortfolioHealthChart({ programs, onSegmentClick, activeFilter }: PortfolioHealthChartProps) {
  const navigate = useNavigate();
  const onTrack = programs.filter(p => p.health === "on-track").length;
  const atRisk = programs.filter(p => p.health === "at-risk").length;
  const blocked = programs.filter(p => p.health === "blocked").length;

  const data = [
    { name: "On Track", value: onTrack, color: STATUS_COLORS.onTrack },
    { name: "At Risk", value: atRisk, color: STATUS_COLORS.atRisk },
    { name: "Blocked", value: blocked, color: STATUS_COLORS.blocked },
  ].filter(d => d.value > 0);

  const handleClick = useCallback((_: any, index: number) => {
    if (!onSegmentClick) return;
    const segment = data[index];
    const filterValue = HEALTH_MAP[segment.name];
    if (filterValue) {
      onSegmentClick(activeFilter === filterValue ? "all" : filterValue);
    }
  }, [data, onSegmentClick, activeFilter]);

  const isSegmentActive = (name: string) => {
    if (!activeFilter || activeFilter === "all") return false;
    return HEALTH_MAP[name] === activeFilter;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Portfolio Health Distribution</CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Click a segment to filter programs by health status
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={3}
                  dataKey="value"
                  onClick={handleClick}
                  style={{ cursor: onSegmentClick ? "pointer" : "default" }}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color}
                      stroke={isSegmentActive(entry.name) ? entry.color : "none"}
                      strokeWidth={isSegmentActive(entry.name) ? 3 : 0}
                      opacity={activeFilter && activeFilter !== "all" && !isSegmentActive(entry.name) ? 0.3 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2 sm:space-y-3">
            {data.map((d) => {
              const segPrograms = programs.filter(p =>
                d.name === "On Track" ? p.health === "on-track" :
                d.name === "At Risk" ? p.health === "at-risk" : p.health === "blocked"
              );
              const isActive = isSegmentActive(d.name);
              return (
                <div key={d.name} className={`transition-all duration-200 ${activeFilter && activeFilter !== "all" && !isActive ? "opacity-35" : "opacity-100"}`}>
                  <button
                    onClick={() => {
                      if (!onSegmentClick) return;
                      const filterValue = HEALTH_MAP[d.name];
                      onSegmentClick(activeFilter === filterValue ? "all" : filterValue);
                    }}
                    className={`flex items-center gap-2 mb-1 ${onSegmentClick ? "cursor-pointer hover:opacity-80" : ""}`}
                  >
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-sm font-bold text-foreground">{d.value} {d.name}</span>
                    {isActive && <span className="text-[10px] text-muted-foreground">· click to clear</span>}
                  </button>
                  <div className="pl-4 space-y-0.5">
                    {segPrograms.map(p => (
                      <button
                        key={p.id}
                        onClick={() => navigate(`/program/${p.id}`)}
                        className="block text-[11px] text-muted-foreground hover:text-foreground transition-colors text-left"
                      >
                        → {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
