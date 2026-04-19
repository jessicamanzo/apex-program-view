export function HeroBanner() {
  return (
    <section className="w-full border-l-2 border-l-[hsl(210,70%,34%)] bg-[hsl(210,60%,98%)] border-b border-border/30 px-6 lg:px-10 py-5">
      <div className="max-w-7xl mx-auto space-y-1.5">
        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[hsl(210,70%,34%)]">
          Featured Project
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          AI Program Management Portfolio Demo
        </h1>
        <p className="text-sm text-foreground/75 max-w-3xl leading-relaxed">
          A simulated enterprise dashboard demonstrating portfolio health tracking, risk visibility, and AI-driven executive reporting — built with SAFe and PMI-aligned methodologies.
        </p>
        <p className="text-xs text-muted-foreground">
          Created by Jessica Manzo · Senior Technical Program Manager
        </p>
      </div>
    </section>
  );
}
