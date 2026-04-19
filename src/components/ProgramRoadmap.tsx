import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoadmapPI } from "@/types/portfolio";
import { StatusBadge, milestoneColor } from "@/components/StatusHelpers";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface ProgramRoadmapProps {
  roadmap: RoadmapPI[];
}

export function ProgramRoadmap({ roadmap }: ProgramRoadmapProps) {
  const piStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-success" />;
    if (status === "in-progress") return <Clock className="h-5 w-5 text-warning" />;
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const piStatusLabel = (status: string) => {
    if (status === "completed") return "Completed";
    if (status === "in-progress") return "In Progress";
    return "Planned";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold">Program Roadmap</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-7">
          {roadmap.map((pi, idx) => (
            <div key={pi.pi} className="relative">
              {idx < roadmap.length - 1 && (
                <div className="absolute left-[9px] top-7 bottom-0 w-px bg-border/60" />
              )}
              <div className="flex items-center gap-3 mb-3">
                {piStatusIcon(pi.status)}
                <div>
                  <span className="text-sm font-bold text-foreground">{pi.pi}</span>
                  <span className="text-[11px] text-muted-foreground ml-2 font-medium">{piStatusLabel(pi.status)}</span>
                </div>
              </div>
              <div className="ml-8 space-y-2">
                {pi.milestones.map((m) => (
                  <div key={m.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-2 w-2 rounded-full shrink-0 ${
                        m.status === "completed" ? "bg-success" :
                        m.status === "on-track" ? "bg-success/70" :
                        m.status === "at-risk" ? "bg-warning" : "bg-danger"
                      }`} />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground">{m.name}</p>
                        {m.dependency && (
                          <p className="text-[11px] text-muted-foreground">Depends on: {m.dependency}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] text-muted-foreground">{m.targetDate}</span>
                      <StatusBadge className={milestoneColor(m.status)}>
                        {m.status === "on-track" ? "On Track" : m.status === "at-risk" ? "At Risk" : m.status === "blocked" ? "Blocked" : "Completed"}
                      </StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
