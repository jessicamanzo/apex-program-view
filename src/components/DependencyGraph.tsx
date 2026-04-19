import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgramV2 } from "@/types/portfolio";
import { GitBranch } from "lucide-react";

interface Node {
  id: string;
  name: string;
  health: string;
  x: number;
  y: number;
  r: number;
}

interface Edge {
  from: string;
  to: string;
  status: string;
  label: string;
  isCriticalPath: boolean;
}

interface DependencyGraphProps {
  programs: ProgramV2[];
}

const HEALTH_COLORS: Record<string, string> = {
  "on-track": "#10b981",
  "at-risk": "#f59e0b",
  "blocked": "#ef4444",
};

const EDGE_COLORS: Record<string, string> = {
  "on-track": "#10b981",
  "at-risk": "#f59e0b",
  "blocked": "#ef4444",
};

// Critical path: Security & Compliance → ML Platform → AI Feature Delivery → Enterprise Customer Onboarding
const CRITICAL_PATH_PAIRS = [
  ["Security & Compliance", "ML Platform Reliability"],
  ["ML Platform Reliability", "AI Feature Delivery"],
  ["AI Feature Delivery", "Enterprise Customer Onboarding"],
];

const CRITICAL_PATH_NODES = new Set([
  "Security & Compliance",
  "ML Platform Reliability",
  "AI Feature Delivery",
  "Enterprise Customer Onboarding",
]);

const abbrev = (name: string) => {
  const words = name.split(" ");
  if (words.length === 1) return name.slice(0, 4);
  return words.map(w => w[0]).join("").toUpperCase();
};

export function DependencyGraph({ programs }: DependencyGraphProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    const N = programs.length;
    const cx = 380, cy = 215, rx = 255, ry = 165;
    const blockedIdx = programs.findIndex(p => p.health === "blocked");

    const nodes: Node[] = programs.map((p, i) => {
      const offset = blockedIdx >= 0 ? (i - blockedIdx + N) % N : i;
      const angle = (offset / N) * Math.PI * 2 - Math.PI / 2;
      return {
        id: p.id,
        name: p.name,
        health: p.health,
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
        r: 28,
      };
    });

    const edges: Edge[] = [];
    programs.forEach(p => {
      p.dependencies.forEach(dep => {
        const fromNode = nodes.find(n => n.name === dep.from);
        const toNode = nodes.find(n => n.name === dep.to);
        if (fromNode && toNode) {
          const isCriticalPath = CRITICAL_PATH_PAIRS.some(
            ([a, b]) => fromNode.name === a && toNode.name === b
          );
          edges.push({ from: fromNode.id, to: toNode.id, status: dep.status, label: dep.description, isCriticalPath });
        }
      });
    });

    return { nodes, edges };
  }, [programs]);

  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Dependency Network</CardTitle>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5 font-semibold text-red-600">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-red-500 border-dashed" />
              Critical Path
            </span>
            {[["on-track", "On Track"], ["at-risk", "At Risk"], ["blocked", "Blocked"]].map(([k, label]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: HEALTH_COLORS[k] }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <svg viewBox="0 0 760 470" className="w-full" style={{ minHeight: 360 }}>
          <defs>
            {Object.entries(EDGE_COLORS).map(([k, c]) => (
              <marker key={k} id={`arrow-${k}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={c} />
              </marker>
            ))}
            <marker id="arrow-critical" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            const from = getNode(e.from);
            const to = getNode(e.to);
            if (!from || !to) return null;

            const dx = to.x - from.x, dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / dist, uy = dy / dist;
            const x1 = from.x + ux * from.r;
            const y1 = from.y + uy * from.r;
            const x2 = to.x - ux * to.r;
            const y2 = to.y - uy * to.r;

            const isHighlighted = hovered === e.from || hovered === e.to;
            const color = e.isCriticalPath ? "#ef4444" : (EDGE_COLORS[e.status] || "#94a3b8");

            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color}
                strokeWidth={e.isCriticalPath ? 3 : isHighlighted ? 2.5 : 1.5}
                strokeDasharray={e.status === "blocked" ? "6,3" : e.status === "at-risk" ? "4,2" : "none"}
                strokeOpacity={hovered && !isHighlighted ? 0.2 : e.isCriticalPath ? 1 : 0.85}
                markerEnd={e.isCriticalPath ? "url(#arrow-critical)" : `url(#arrow-${e.status})`}
                style={{ transition: "stroke-opacity 0.15s" }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const prog = programs.find(p => p.id === node.id);
            if (!prog) return null;
            const isHov = hovered === node.id;
            const isCritical = CRITICAL_PATH_NODES.has(node.name);
            const color = HEALTH_COLORS[node.health];

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(`/program/${node.id}`)}
              >
                {/* Critical path outer ring */}
                {isCritical && (
                  <circle
                    r={node.r + 8}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={1}
                    strokeOpacity={0.35}
                    strokeDasharray="3,3"
                  />
                )}
                <circle
                  r={isHov ? node.r + 4 : node.r}
                  fill={color}
                  fillOpacity={0.15}
                  stroke={isCritical ? "#ef4444" : color}
                  strokeWidth={isCritical ? 2.5 : isHov ? 2.5 : 2}
                  style={{ transition: "all 0.15s" }}
                />
                <text textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="700" fill={color}>
                  {abbrev(node.name)}
                </text>
                <text y={node.r + 11} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity={0.8}>
                  {node.name.split(" ").slice(0, 2).join(" ")}
                </text>
                {node.name.split(" ").length > 2 && (
                  <text y={node.r + 23} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity={0.8}>
                    {node.name.split(" ").slice(2).join(" ")}
                  </text>
                )}
                <text
                  y={-node.r - 8}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  fill={prog.predictability >= 85 ? "#10b981" : prog.predictability >= 70 ? "#f59e0b" : "#ef4444"}
                >
                  {prog.predictability}% pred.
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover detail */}
        {hovered && (() => {
          const prog = programs.find(p => p.id === hovered);
          if (!prog) return null;
          const inDeps = prog.dependencies.length;
          const outDeps = programs.flatMap(p => p.dependencies).filter(d => d.to === prog.name).length;
          return (
            <div className="absolute bottom-4 left-4 bg-card border rounded-lg px-4 py-3 shadow-lg text-xs max-w-xs z-10">
              <p className="font-semibold text-sm mb-1">{prog.name}</p>
              <p className="text-muted-foreground mb-1">{prog.description.slice(0, 80)}…</p>
              <div className="flex gap-4 mt-2">
                <span>⬆ <strong>{outDeps}</strong> upstream</span>
                <span>⬇ <strong>{inDeps}</strong> downstream</span>
                <span>🎯 <strong>{prog.predictability}%</strong></span>
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
