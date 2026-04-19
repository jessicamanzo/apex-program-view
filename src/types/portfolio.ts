export type HealthStatus = "on-track" | "at-risk" | "blocked";
export type RiskSeverity = "critical" | "high" | "medium" | "low";
export type MitigationStatus = "not-started" | "in-progress" | "mitigated";
export type MilestoneStatus = "completed" | "on-track" | "at-risk" | "blocked";
export type PIStatus = "completed" | "in-progress" | "planned";

export interface HealthDimensions {
  deliveryVsCommitment: number; // 0-100
  scheduleVariance: number; // negative = behind
  scopeStability: number; // 0-100
  riskSeverityScore: number; // 0-100 (lower = better)
  dependencyBlockerScore: number; // 0-100 (lower = better)
  defectTrend: number; // negative = improving
}

export interface SprintData {
  sprint: string;
  planned: number;
  delivered: number;
  velocity: number;
}

export interface PIData {
  id: string;
  label: string;
  status: PIStatus;
  plannedSP: number;
  deliveredSP: number;
  predictability: number;
  sprints: SprintData[];
}

export interface Milestone {
  name: string;
  status: MilestoneStatus;
  dependency?: string;
  targetDate: string;
}

export interface RoadmapPI {
  pi: string;
  status: PIStatus;
  milestones: Milestone[];
}

export interface Dependency {
  from: string;
  to: string;
  description: string;
  status: HealthStatus;
}

export interface Risk {
  id: string;
  title: string;
  severity: RiskSeverity;
  programId: string;
  programName: string;
  description: string;
  owner: string;
  ownerInitials: string;
  mitigationStatus: MitigationStatus;
  targetResolutionDate: string;
  impact: string;
  createdDate: string;
}

export interface Program {
  id: string;
  name: string;
  manager: string;
  managerInitials: string;
  health: HealthStatus;
  healthDimensions: HealthDimensions;
  progress: number;
  nextMilestone: string;
  milestoneHealth: MilestoneStatus;
  riskCount: number;
  predictability: number;
  velocity: number;
  velocityChange: number;
  defectTrend: number;
  pis: PIData[];
  roadmap: RoadmapPI[];
  dependencies: Dependency[];
  description: string;
}

export interface PortfolioData {
  programs: Program[];
  risks: Risk[];
  currentPI: string;
  currentPIWeek: number;
  totalPIWeeks: number;
  avgVelocity: number;
  avgVelocityChange: number;
  avgPredictability: number;
}

export type FilterOption = "all" | "on-track" | "at-risk" | "blocked" | "critical-risks" | "impacted";

// ── v2: Budget & Resource ──────────────────────────────────────────────────
export interface BudgetData {
  totalBudget: number;        // $K
  spent: number;              // $K to date
  forecast: number;           // $K projected at completion
  variance: number;           // $K (negative = over budget)
  headcount: number;          // allocated FTE
  headcountUtilization: number; // 0-100%
  monthlyBurn: MonthlyBurn[];
}

export interface MonthlyBurn {
  month: string;
  planned: number;
  actual: number;
  forecast?: number;
}

// ── v2: Stakeholder ────────────────────────────────────────────────────────
export type SignOffStatus = "approved" | "pending" | "changes-requested" | "not-reviewed";

export interface Stakeholder {
  name: string;
  role: string;
  initials: string;
  signOff: SignOffStatus;
  lastActivity: string;
  comment?: string;
}

// ── v2: Trade-off Scenarios ────────────────────────────────────────────────
export interface TradeOffScenario {
  id: string;
  title: string;
  programId: string;
  programName: string;
  decision: string;
  option_a: TradeOffOption;
  option_b: TradeOffOption;
  recommendedOption: "a" | "b";
  urgency: "immediate" | "this-week" | "this-pi";
}

export interface TradeOffOption {
  label: string;
  revenueImpact: number;    // $M
  scheduleImpact: number;   // weeks (positive = delay)
  riskChange: number;       // -100 to +100 (positive = more risk)
  costImpact: number;       // $K
  description: string;
}

// ── v2: Predictability Formula ─────────────────────────────────────────────
export interface PredictabilityBreakdown {
  deliveryAccuracy: number;   // 0-100
  commitmentChange: number;   // 0-100 (scope stability factor)
  defectAdjustment: number;   // -10 to +10 (quality factor)
  confidenceInterval: [number, number];  // [low, high]
  trend: "improving" | "stable" | "degrading";
  trendData: { pi: string; value: number }[];
}

// ── v2: Forecast ──────────────────────────────────────────────────────────
export interface ForecastData {
  completionDate: string;        // ISO
  confidenceLow: string;         // ISO - P10
  confidenceHigh: string;        // ISO - P90
  remainingWeeks: number;
  velocityRequired: number;      // SP/sprint needed to hit date
  currentVelocity: number;
  onTrack: boolean;
}

// ── v2: Extended Program ───────────────────────────────────────────────────
export interface ProgramV2 extends Program {
  budget: BudgetData;
  stakeholders: Stakeholder[];
  predictabilityBreakdown: PredictabilityBreakdown;
  forecast: ForecastData;
  tradeOffs?: TradeOffScenario[];
}

// ── v2: Portfolio Extended ─────────────────────────────────────────────────
export interface PortfolioDataV2 extends PortfolioData {
  programs: ProgramV2[];
  tradeOffs: TradeOffScenario[];
  totalBudget: number;
  totalSpent: number;
  totalForecast: number;
  budgetVariance: number;
}
