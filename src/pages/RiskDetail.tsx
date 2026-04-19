import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, severityColor, mitigationLabel } from "@/components/StatusHelpers";
import { UserAvatar } from "@/components/UserAvatar";
import portfolioData from "@/data/portfolioDataV2";
import { ArrowLeft, AlertTriangle, Clock, FileText, User, Target, Calendar } from "lucide-react";

const RiskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const risk = portfolioData.risks.find(r => r.id === id);

  if (!risk) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Risk not found</p>
          <Button variant="ghost" onClick={() => navigate("/")} className="mt-4"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const mitigationColor = risk.mitigationStatus === "mitigated" ? "bg-success text-success-foreground" : risk.mitigationStatus === "in-progress" ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground";

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mt-1"><ArrowLeft className="h-4 w-4" /></Button>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-mono">{risk.id}</span>
              <StatusBadge className={severityColor(risk.severity)}>{risk.severity}</StatusBadge>
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight mt-3">{risk.title}</h1>
          </div>
        </div>

        {/* Description */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><FileText className="h-4 w-4" />Description</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-base text-muted-foreground/90 leading-relaxed">{risk.description}</p>
          </CardContent>
        </Card>

        {/* Impact & Mitigation */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3"><Target className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium text-muted-foreground uppercase">Impact</span></div>
              <p className="text-base text-foreground leading-relaxed">{risk.impact}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium text-muted-foreground uppercase">Mitigation Status</span></div>
              <StatusBadge className={mitigationColor}>{mitigationLabel(risk.mitigationStatus)}</StatusBadge>
            </CardContent>
          </Card>
        </div>

        {/* Owner, Resolution, Created */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3"><User className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium text-muted-foreground uppercase">Owner</span></div>
              <div className="flex items-center gap-2">
                <UserAvatar initials={risk.ownerInitials} name={risk.owner} />
                <div>
                  <span className="text-sm font-medium text-foreground">{risk.owner}</span>
                  <p className="text-[11px] text-muted-foreground">Program Manager</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium text-muted-foreground uppercase">Target Resolution</span></div>
              <span className="text-sm text-foreground">{risk.targetResolutionDate}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium text-muted-foreground uppercase">Created</span></div>
              <span className="text-sm text-foreground">{risk.createdDate}</span>
            </CardContent>
          </Card>
        </div>

        {/* Associated Program */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3"><span className="text-xs font-medium text-muted-foreground uppercase">Associated Program</span></div>
            <button onClick={() => navigate(`/program/${risk.programId}`)} className="text-sm font-medium text-primary hover:underline">{risk.programName}</button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RiskDetail;