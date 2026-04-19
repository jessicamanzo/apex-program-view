import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgramV2, SignOffStatus } from "@/types/portfolio";
import { Users, CheckCircle2, Clock, XCircle, MinusCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StakeholderAlignmentProps {
  programs: ProgramV2[];
}

const STATUS_CONFIG: Record<SignOffStatus, { icon: React.ElementType; color: string; label: string }> = {
  approved: { icon: CheckCircle2, color: "text-emerald-600", label: "Approved" },
  pending: { icon: Clock, color: "text-amber-500", label: "Pending" },
  "changes-requested": { icon: XCircle, color: "text-red-500", label: "Changes Requested" },
  "not-reviewed": { icon: MinusCircle, color: "text-muted-foreground/50", label: "Not Reviewed" },
};

function SignOffPill({ status }: { status: SignOffStatus }) {
  const cfg = STATUS_CONFIG[status];
  return <cfg.icon className={`h-4 w-4 ${cfg.color}`} />;
}

// Gather all unique stakeholders across programs
function buildSignOffMatrix(programs: ProgramV2[]) {
  const stakeholderMap: Record<string, { name: string; role: string; initials: string }> = {};
  programs.forEach(p => {
    p.stakeholders.forEach(s => {
      if (!stakeholderMap[s.name]) {
        stakeholderMap[s.name] = { name: s.name, role: s.role, initials: s.initials };
      }
    });
  });
  return Object.values(stakeholderMap);
}

export function StakeholderAlignment({ programs }: StakeholderAlignmentProps) {
  const navigate = useNavigate();
  const stakeholders = buildSignOffMatrix(programs);

  // Overall stats
  const allSignOffs = programs.flatMap(p => p.stakeholders);
  const approvedCount = allSignOffs.filter(s => s.signOff === "approved").length;
  const pendingCount = allSignOffs.filter(s => s.signOff === "pending").length;
  const changesCount = allSignOffs.filter(s => s.signOff === "changes-requested").length;
  const notReviewedCount = allSignOffs.filter(s => s.signOff === "not-reviewed").length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Stakeholder Alignment</CardTitle>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            {[
              { count: approvedCount, color: "text-emerald-600", label: "Approved" },
              { count: pendingCount, color: "text-amber-500", label: "Pending" },
              { count: changesCount, color: "text-red-500", label: "Changes Req." },
              { count: notReviewedCount, color: "text-muted-foreground", label: "Not Reviewed" },
            ].map(s => (
              <span key={s.label} className={`font-semibold ${s.color}`}>{s.count} {s.label}</span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left font-semibold text-muted-foreground pb-2 pr-4 min-w-[200px]">Program</th>
                {stakeholders.map(s => (
                  <th key={s.name} className="text-center pb-2 px-1 min-w-[56px]">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold">
                        {s.initials}
                      </div>
                      <span className="text-[9px] text-muted-foreground leading-tight max-w-[52px] truncate">{s.role}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {programs.map(p => (
                <tr key={p.id} className="border-t border-border/40 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => navigate(`/program/${p.id}`)}>
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{
                          background:
                            p.health === "on-track" ? "#10b981" :
                            p.health === "at-risk" ? "#f59e0b" : "#ef4444",
                        }}
                      />
                      <span className="font-medium text-xs leading-snug">{p.name}</span>
                    </div>
                  </td>
                  {stakeholders.map(s => {
                    const sh = p.stakeholders.find(st => st.name === s.name);
                    if (!sh) {
                      return (
                        <td key={s.name} className="text-center py-2 px-1">
                          <span className="text-muted-foreground/20 text-lg">—</span>
                        </td>
                      );
                    }
                    return (
                      <td key={s.name} className="text-center py-2 px-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="flex items-center justify-center w-full">
                              <SignOffPill status={sh.signOff} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-xs">
                            <p className="font-semibold">{sh.name} · {STATUS_CONFIG[sh.signOff].label}</p>
                            <p className="text-muted-foreground text-[10px]">Last activity: {sh.lastActivity}</p>
                            {sh.comment && (
                              <p className="mt-1 italic text-[10px] flex items-start gap-1">
                                <MessageSquare className="h-3 w-3 shrink-0 mt-0.5" />
                                "{sh.comment}"
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-5 text-[10px] text-muted-foreground border-t pt-3">
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1">
              <v.icon className={`h-3 w-3 ${v.color}`} />
              {v.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
