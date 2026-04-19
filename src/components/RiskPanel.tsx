import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Risk } from "@/types/portfolio";
import { UserAvatar } from "@/components/UserAvatar";
import { StatusBadge, severityColor, mitigationLabel } from "@/components/StatusHelpers";
import { AlertTriangle, Clock } from "lucide-react";

interface RiskPanelProps {
  risks: Risk[];
  limit?: number;
}

export function RiskPanel({ risks, limit = 5 }: RiskPanelProps) {
  const navigate = useNavigate();
  const sorted = [...risks].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });
  const displayed = sorted.slice(0, limit);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            Risk & Blocking Issues
          </CardTitle>
          <span className="text-sm text-muted-foreground/80 font-semibold">{risks.length} total</span>
        </div>
        <p className="text-sm text-muted-foreground/80 mt-0.5">Top risks sorted by severity across all active programs</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {displayed.map((risk) => (
            <div
              key={risk.id}
              onClick={() => navigate(`/risk/${risk.id}`)}
              className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors duration-150 group"
            >
              <UserAvatar initials={risk.ownerInitials} name={risk.owner} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-muted-foreground font-mono">{risk.id}</span>
                  <StatusBadge className={severityColor(risk.severity)}>{risk.severity}</StatusBadge>
                </div>
                <p className="text-base font-medium text-foreground truncate group-hover:text-foreground/90 transition-colors">{risk.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-muted-foreground/80">{risk.programName}</span>
                  <span className="text-xs text-muted-foreground/80">· {mitigationLabel(risk.mitigationStatus)}</span>
                  <span className="text-xs text-muted-foreground/80 flex items-center gap-1">
                    <Clock className="h-3 w-3" />{risk.targetResolutionDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
