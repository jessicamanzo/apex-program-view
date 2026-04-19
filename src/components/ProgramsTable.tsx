import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Program, FilterOption } from "@/types/portfolio";
import { UserAvatar } from "@/components/UserAvatar";
import { StatusBadge, healthColor, healthLabel, healthDot, milestoneColor } from "@/components/StatusHelpers";
import { Progress } from "@/components/ui/progress";
import { FilterBar } from "@/components/FilterBar";

interface ProgramsTableProps {
  programs: Program[];
  highlightProgram?: string;
  activeFilter?: FilterOption;
  onFilterChange?: (filter: FilterOption) => void;
}

const HEALTH_ORDER: Record<string, number> = { "blocked": 0, "at-risk": 1, "on-track": 2 };
type SortKey = "health" | "velocity" | "predictability" | "name";

export function ProgramsTable({ programs, highlightProgram, activeFilter, onFilterChange }: ProgramsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("health");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronUp className="h-3 w-3 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 opacity-70" /> : <ChevronDown className="h-3 w-3 opacity-70" />;
  };

  const sorted = [...programs].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "health") cmp = HEALTH_ORDER[a.health] - HEALTH_ORDER[b.health];
    else if (sortKey === "velocity") cmp = a.velocity - b.velocity;
    else if (sortKey === "predictability") cmp = a.predictability - b.predictability;
    else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    return sortDir === "asc" ? cmp : -cmp;
  });
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Programs Overview</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground/80 mt-0.5">All active programs with health, delivery metrics, and upcoming milestones</p>
          </div>
          {activeFilter !== undefined && onFilterChange && (
            <FilterBar active={activeFilter} onChange={onFilterChange} />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 sm:px-6">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Program</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Manager</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-[100px]">Health</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide text-center">Risks</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Progress</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide text-center">Predictability</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Next Milestone</TableHead>
                <TableHead className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-[110px]">Milestone Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((p) => (
                <TableRow
                  key={p.id}
                  id={`program-${p.id}`}
                  onClick={() => navigate(`/program/${p.id}`)}
                  className={`cursor-pointer hover:bg-muted/50 transition-all duration-300 border-border/30 ${highlightProgram === p.id ? "bg-amber-50/60 ring-1 ring-amber-300/50 animate-fade-in" : ""}`}
                >
                  <TableCell className="font-semibold text-foreground text-sm py-3.5">{p.name}</TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <UserAvatar initials={p.managerInitials} name={p.manager} />
                      <span className="text-sm text-foreground">{p.manager}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <StatusBadge className={healthColor(p.health)}>
                      <span className={`w-1.5 h-1.5 rounded-full ${healthDot(p.health)}`} />
                      {healthLabel(p.health)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-center py-3.5">
                    <span className={`text-sm font-semibold ${p.riskCount > 3 ? "text-red-700" : "text-foreground"}`}>{p.riskCount}</span>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2.5 w-28">
                      <Progress value={p.progress} className="h-1.5" />
                      <span className="text-[11px] text-foreground w-8 font-medium">{p.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3.5">
                    <span className={`text-sm font-semibold ${p.predictability >= 85 ? "text-emerald-700" : p.predictability >= 70 ? "text-amber-700" : "text-red-700"}`}>
                      {p.predictability}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-foreground py-3.5">{p.nextMilestone}</TableCell>
                  <TableCell className="py-3.5">
                    <StatusBadge className={milestoneColor(p.milestoneHealth)}>
                      {p.milestoneHealth === "on-track" ? "On Track" : p.milestoneHealth === "at-risk" ? "At Risk" : p.milestoneHealth === "blocked" ? "Blocked" : "Completed"}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden space-y-3">
          {sorted.map((p) => (
            <div
              key={p.id}
              id={`program-${p.id}`}
              onClick={() => navigate(`/program/${p.id}`)}
              className={`p-4 rounded-xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-all ${highlightProgram === p.id ? "bg-amber-50/60 ring-1 ring-amber-300/50" : "bg-card"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{p.name}</span>
                <StatusBadge className={healthColor(p.health)}>
                  <span className={`w-1.5 h-1.5 rounded-full ${healthDot(p.health)}`} />
                  {healthLabel(p.health)}
                </StatusBadge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <UserAvatar initials={p.managerInitials} name={p.manager} />
                <span className="text-xs text-muted-foreground">{p.manager}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Risks</p>
                  <p className={`text-sm font-bold ${p.riskCount > 3 ? "text-red-700" : "text-foreground"}`}>{p.riskCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Pred.</p>
                  <p className={`text-sm font-bold ${p.predictability >= 85 ? "text-emerald-700" : p.predictability >= 70 ? "text-amber-700" : "text-red-700"}`}>{p.predictability}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Progress</p>
                  <p className="text-sm font-bold text-foreground">{p.progress}%</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{p.nextMilestone}</span>
                  <StatusBadge className={milestoneColor(p.milestoneHealth)}>
                    {p.milestoneHealth === "on-track" ? "On Track" : p.milestoneHealth === "at-risk" ? "At Risk" : p.milestoneHealth === "blocked" ? "Blocked" : "Completed"}
                  </StatusBadge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
