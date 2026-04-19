# ProgramIQ — Architecture & Design Decisions

Built by Jessica Manzo · Senior Technical Program Manager

## Why This Exists

This is a portfolio dashboard, not a template. Every panel was chosen to answer a specific question a hiring manager or executive might ask. This document explains those choices.

## Stack

React + TypeScript + Vite + Tailwind CSS + Recharts + shadcn/ui

I chose this stack because it mirrors what most modern SaaS companies run for internal tooling. TypeScript keeps the data contracts honest. Recharts handles the chart heavy-lifting without heavy dependencies. shadcn/ui gives production-quality components without locking me into a component library I cannot customize.

## Why These Panels, In This Order

**Today's Focus** — The first thing any TPM does each morning is answer: what is on fire and what decision needs to be made today? This panel forces that discipline.

**KPI Cards** — Active Programs, Avg Velocity, Current PI, Open Risks, Predictability. These are the five numbers I would put on a wall screen in a program war room. Not more, not fewer.

**Decision Support (Trade-Offs)** — The hardest part of a TPM's job is not tracking work. It is structuring decisions. This panel shows three real trade-offs with quantified revenue, schedule, cost, and risk impact — the format I use when escalating to an executive team.

**Budget Tracking** — Spend vs. plan at the portfolio level. I built this because every program I have managed eventually surfaces a budget conversation, and having the data structured for that conversation before it happens is the difference between being reactive and being prepared.

**Portfolio Health & Execution** — Donut chart + PI performance + sprint velocity per program. The donut filters the whole dashboard — clicking "Blocked" scopes every downstream panel to blocked programs only. This is the interaction pattern I wanted because it mirrors how I actually investigate a portfolio problem.

**Dependency Network** — SVG-rendered, hand-computed layout. I built this from scratch rather than using a graph library because the positioning matters: blocked programs should read as visually central, not algorithmically placed. The critical path (red dashed) is the most important thing on this chart and it is annotated as such.

**Predictability & Forecasting** — SAFe predictability formula broken down by component, plus P10-P90 completion bands. I included the formula because showing the math is more credible than showing a number.

**Stakeholder Alignment** — Sign-off matrix across all programs and stakeholders. In practice, a blocked stakeholder approval chain is often the real reason a program is at risk — not execution. This panel makes that visible.

## Data Design

All data lives in `src/data/portfolioDataV2.ts`. Single source of truth. Every component reads from here — nothing is hardcoded at the component level.

The `portfolioData.ts` file still exists from an earlier iteration but is not imported by anything active. It will be removed in a cleanup pass.

Each program has two predictability values:
- `p.predictability` — current PI predictability (the SAFe metric: what we committed vs. what we delivered)
- `pi.predictability` — historical PI-level record

The dashboard uses `p.predictability` everywhere for consistency. The `avgPredictability` export on the data object is computed from `p.predictability` values and equals 78%.

## What I Would Build Differently

If this were a real production tool:
- Data would live in a database with a proper API layer, not a TypeScript file
- The dependency graph would be live-updated from Jira/Linear
- Velocity forecasts would recompute nightly from sprint actuals
- The stakeholder alignment matrix would integrate with DocuSign or equivalent for real sign-off tracking
- The predictability formula weights (0.50, 0.35, ±10) would be calibrated from 2-3 actual PIs of data before being used for decisions

## Simulated Data

All Nova Systems data is fictional. The scenario — ML platform deployment blocked by SOC 2 compliance dependency, cascading to three downstream programs with $3.2M Q2 ARR at risk — is a realistic composite of patterns I have seen in AI/SaaS organizations scaling to enterprise.

The numbers are internally consistent: velocity values, sprint data, PI predictability, budget burn, and risk severity all cross-reference correctly across every panel.
