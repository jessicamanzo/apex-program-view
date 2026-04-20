import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Zap, Shield, Target, ArrowRight, CheckCircle2, BookOpen, Lightbulb } from "lucide-react";

const sections = [

  {
    icon: BookOpen,
    color: "text-rose-600",
    bg: "bg-muted/30 border-border",
    title: "About This Portfolio",
    content: [
      "This dashboard represents a fictional portfolio for Nova Systems, a simulated Series C AI/SaaS company scaling its ML platform to enterprise customers. The scenario is constructed to illustrate real program management challenges I have encountered across my career in SaaS, infrastructure, and platform delivery.",
      "The central story is a pattern I have seen repeatedly in organizations scaling AI products: a platform deployment gated on a compliance dependency, cascading into downstream programs, with revenue at risk. The decisions shown in the trade-off panel reflect how I would actually approach those conversations with engineering leaders and executives.",
      "Several panels in this tool use AI-generated insights — the executive summary diagnosis, the risk pattern analysis, and the program health narrative. These are generated from the underlying program data, the same way I would design an AI layer in a real portfolio tool. The AI handles the synthesis. The TPM owns the decision. That is the model I would bring to any team building AI-augmented program management.",
      "I built this to demonstrate how I think, not just what I know. If you want to go deeper on any scenario, I am happy to walk through my reasoning.",
    ],
  },
  {
    icon: Lightbulb,
    color: "text-rose-600",
    bg: "bg-muted/30 border-border",
    title: "What I'd Change About This Portfolio",
    content: [
      "If this were a real engagement I'd build this differently. The current dependency graph is static. In practice I'd want it live-updating from Jira or Linear, with velocity forecasts recomputed nightly. The stakeholder alignment matrix works well for a portfolio view but misses the informal influence dynamics that actually determine whether a decision sticks.",
      "I'd also add a 'cost of delay' column to the risk register. Every risk row currently shows severity and mitigation status, but the question executives actually care about is: if this stays unresolved for another two weeks, what does it cost us? That number changes the conversation.",
      "The predictability formula I use (Delivery% × 0.50 + Scope Stability × 0.35 + Quality Adj ±10) is a good starting point but I'd calibrate the weights based on actual data from 2–3 PIs before using it to drive decisions. The formula is directionally right. The coefficients need to earn their place.",
    ],
  },
  {
    icon: Users,
    color: "text-blue-600",
    bg: "bg-muted/30 border-border",
    title: "My Philosophy: Servant Leadership in Practice",
    content: [
      "I think of my role as a conduit, not a gatekeeper. My job is to get the right information to the right people fast enough that they can act on it. Development teams are closest to the work, and they surface the most important signals early. My job is to amplify those signals, not filter them.",
      "When a program is at risk, my first move is always to get the impacted stakeholders in the same room, or the same Slack thread, with the people who have the context to resolve it. I don't wait for the weekly status meeting. Blocking issues age poorly. The longer a team is stuck, the more momentum is lost, and the more expensive the recovery becomes.",
      "I have a bias toward transparency over comfort. A clear status with a hard truth serves leaders better than a polished update that hides a real problem. Good decisions need accurate information, and accurate information is something I can always provide.",
    ],
  },
  {
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-muted/30 border-border",
    title: "When a Program Is at Risk: My Process",
    content: [
      "The first thing I do is distinguish between a signal and a blocker. A signal is something trending in the wrong direction: declining velocity, scope creep, a dependency starting to slip. A blocker is something that has stopped a team from moving. They require different responses.",
      "For signals, I bring them into the open early, quantify the trajectory, and start a conversation with the program team about mitigation options before they escalate. For blockers, I move faster. I identify who has the authority and context to resolve the block, bring them together, and remove any process friction that's slowing the conversation down.",
      "I decide what to escalate based on two questions: Does this impact another team's timeline? Has the team been technically blocked for more than one sprint without a clear resolution path? If yes to either, I escalate. Not to create alarm, but because the people who can help deserve to know.",
    ],
  },
  {
    icon: Target,
    color: "text-emerald-600",
    bg: "bg-muted/30 border-border",
    title: "How I Present to Executives",
    content: [
      "I lead with status, risk, and decision, in that order. Executives are time-constrained. The first 60 seconds of any briefing should answer: where are we, what is threatening the outcome, and what do I need from you? Everything else is supporting detail.",
      "I never bring a problem without a recommended path forward. When I escalate a blocker, I come with at least two options quantified by their impact on schedule, budget, and customer commitments. I give my recommendation and my reasoning. Leaders can disagree, but they should never have to ask what I think we should do.",
      "I also believe in closing the loop. After a decision is made, I make sure the teams affected know what was decided and why. Visibility into the decision-making process builds trust with development teams. They are more likely to surface risks early when they believe the information will be acted on.",
    ],
  },
  {
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-muted/30 border-border",
    title: "SAFe & PMI: How I Apply Both",
    content: [
      "I use SAFe as my operating model for cross-team coordination: PI Planning, ART ceremonies, predictability metrics, and dependency management are the heartbeat of how I run programs. The PI cadence creates natural forcing functions for alignment: teams commit to what they can deliver, we measure against those commitments, and we use that data to have honest conversations about capacity and priority.",
      "I layer PMI methodology on top of SAFe for governance and risk management. Formal risk registers, stakeholder management matrices, and structured change control are not bureaucracy. They are the mechanisms that keep a program recoverable when things go sideways. And things always go sideways.",
      "The combination matters most in AI and infrastructure programs, where technical uncertainty is high and downstream dependencies are complex. SAFe gives you the cadence and visibility. PMI gives you the discipline to manage what you can't control.",
    ],
  },
];

const frameworks = [
  { label: "SAFe 6.0", detail: "PI Planning · ART Ceremonies · Predictability Metrics · Dependency Management" },
  { label: "PMI / PMP", detail: "Risk Register · Stakeholder Matrix · Change Control · Earned Value" },
  { label: "Agile / Scrum", detail: "Sprint Cadence · Velocity Tracking · Backlog Management · Retrospectives" },
  { label: "OKRs", detail: "Portfolio alignment to company objectives and key results" },
];

export default function MyApproach() {
  return (
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Header */}
        <div className="border-b pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Nova Systems · Senior Technical Program Manager</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">My Approach</h1>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl">
            Servant leader with 8+ years in SaaS, infrastructure, and AI/ML platform delivery. SAFe 6.0 and PMI/PMP practitioner.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.title} className={`border ${section.bg}`}>
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-white/60 dark:bg-black/20`}>
                    <section.icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <h2 className="text-base font-bold text-foreground">{section.title}</h2>
                </div>
                <div className="space-y-3">
                  {section.content.map((para, i) => (
                    <p key={i} className="text-sm text-foreground/85 leading-relaxed">{para}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real example */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Real Example · Anonymized</span>
          </div>
          <h2 className="text-base font-bold text-foreground mb-3">How I Unblocked a $2M Revenue Dependency</h2>
          <div className="space-y-2">
            <p className="text-sm text-foreground/85 leading-relaxed"><strong>Situation:</strong> A platform migration was 6 weeks behind. Three downstream product teams were blocked. Engineering leadership didn't know the severity because each team had been absorbing the delay individually rather than escalating.</p>
            <p className="text-sm text-foreground/85 leading-relaxed"><strong>What I did:</strong> I mapped the full dependency chain, quantified the revenue exposure (two enterprise contracts with activation SLAs), and brought a cross-functional war room together within 48 hours. I came with two options and a recommendation, not just a status update.</p>
            <p className="text-sm text-foreground/85 leading-relaxed"><strong>Outcome:</strong> Leadership chose to run a parallel-track approach that I'd costed out , more expensive short-term, which avoided the contract breach. Both customers activated on time. The dependency mapping I created became the standard for PI planning going forward.</p>
            <p className="text-sm text-muted-foreground italic mt-2">This mirrors the Nova Systems scenario exactly. <Link to="/" className="underline text-blue-600 hover:text-blue-800">The trade-off panel on the dashboard</Link> shows how I would have framed that executive conversation.</p>
          </div>
        </div>

        {/* Framework badges */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Frameworks & Methodologies</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {frameworks.map((f) => (
                <div key={f.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border">
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{f.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
