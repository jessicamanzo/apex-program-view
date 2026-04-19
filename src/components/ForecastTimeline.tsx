import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ProgramV2 } from "@/types/portfolio";
import { Calendar, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

interface ForecastTimelineProps {
  programs: ProgramV2[];
}

function parseDate(iso: string): Date {
  return new Date(iso);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function dateDiff(a: string, b: string): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / (1000 * 60 * 60 * 24));
}

export function ForecastTimeline({ programs }: ForecastTimelineProps) {
  const navigate = useNavigate();
  // Determine axis span: min(low) to max(high)
  const allDates = programs.flatMap(p => [p.forecast.confidenceLow, p.forecast.completionDate, p.forecast.confidenceHigh]);
  const minDate = allDates.reduce((a, b) => a < b ? a : b);
  const maxDate = allDates.reduce((a, b) => a > b ? a : b);
  const totalDays = dateDiff(minDate, maxDate) || 1;

  const pctPos = (iso: string) => Math.max(0, Math.min(100, (dateDiff(minDate, iso) / totalDays) * 100));

  // Generate month labels
  const start = parseDate(minDate);
  const end = parseDate(maxDate);
  const monthLabels: { label: string; pct: number }[] = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur <= end) {
    const pct = pctPos(cur.toISOString().slice(0, 10));
    monthLabels.push({
      label: cur.toLocaleDateString("en-US", { month: "short" }),
      pct,
    });
    cur.setMonth(cur.getMonth() + 1);
  }

  const sorted = [...programs].sort((a, b) =>
    a.forecast.completionDate.localeCompare(b.forecast.completionDate)
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Completion Forecasts</CardTitle>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-8 h-2 rounded-sm bg-blue-200 inline-block" /> P10–P90 range
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-foreground inline-block" /> Likely date
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeline axis */}
        <div className="relative mb-1 h-5">
          {monthLabels.map(m => (
            <span
              key={m.label}
              className="absolute text-[9px] text-muted-foreground transform -translate-x-1/2"
              style={{ left: `${m.pct}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Axis line */}
        <div className="relative mb-4">
          <div className="w-full h-px bg-border" />
        </div>

        {/* Program rows */}
        <div className="space-y-3">
          {sorted.map((p) => {
            const low = pctPos(p.forecast.confidenceLow);
            const mid = pctPos(p.forecast.completionDate);
            const high = pctPos(p.forecast.confidenceHigh);
            const onTrack = p.forecast.onTrack;
            const velocityGap = p.forecast.velocityRequired - p.forecast.currentVelocity;

            return (
              <div key={p.id} className="group cursor-pointer hover:bg-muted/30 rounded-lg -mx-2 px-2 transition-colors" onClick={() => navigate(`/program/${p.id}`)}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-44 shrink-0">
                    <div className="flex items-center gap-1.5">
                      {onTrack
                        ? <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        : <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />
                      }
                      <span className="text-[11px] font-medium leading-tight">{p.name}</span>
                    </div>
                  </div>

                  {/* Gantt bar area */}
                  <div className="flex-1 relative h-6">
                    {/* CI range band */}
                    <div
                      className="absolute top-1 h-4 rounded-sm opacity-30"
                      style={{
                        left: `${low}%`,
                        width: `${high - low}%`,
                        background: onTrack ? "#3b82f6" : "#ef4444",
                      }}
                    />
                    {/* Likely date marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 rounded-full"
                      style={{
                        left: `${mid}%`,
                        background: onTrack ? "#1d4ed8" : "#dc2626",
                      }}
                    />
                    {/* Date label */}
                    <span
                      className="absolute top-0 text-[9px] font-semibold transform -translate-x-1/2 whitespace-nowrap"
                      style={{
                        left: `${mid}%`,
                        color: onTrack ? "#1d4ed8" : "#dc2626",
                        top: mid > 80 ? "auto" : 0,
                        bottom: mid > 80 ? 0 : "auto",
                      }}
                    >
                      {formatDate(p.forecast.completionDate)}
                    </span>
                  </div>
                </div>

                {/* Velocity indicator */}
                <div className="flex items-center gap-2 ml-38 pl-[152px]">
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <TrendingUp className={`h-2.5 w-2.5 ${velocityGap > 0 ? "text-red-400" : "text-emerald-400"}`} />
                    <span>
                      Needs <strong>{p.forecast.velocityRequired} SP/sprint</strong> · Currently at <strong>{p.forecast.currentVelocity} SP</strong>
                      {velocityGap > 0
                        ? <span className="text-red-500 ml-1">({velocityGap} SP gap)</span>
                        : <span className="text-emerald-500 ml-1">(buffer: {Math.abs(velocityGap)} SP)</span>
                      }
                    </span>
                    <span className="mx-1 text-border">·</span>
                    <span>P10: {formatDate(p.forecast.confidenceLow)} · P90: {formatDate(p.forecast.confidenceHigh)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-3 border-t flex items-center gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">{programs.filter(p => p.forecast.onTrack).length}</strong> programs on track for target date
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">{programs.filter(p => !p.forecast.onTrack).length}</strong> programs need velocity increase or scope relief
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
