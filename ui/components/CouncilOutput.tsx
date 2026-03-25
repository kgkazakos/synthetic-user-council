"use client";

interface CouncilOutputProps {
  summary: {
    councilSummary: string;
    blindSpots: string[];
    challengedAssumptions: string[];
    suggestedQuestions: string[];
    segmentsToPrioritise: string[];
  };
}

function Section({
  title,
  items,
  numbered = false,
  accent = false,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-medium text-muted uppercase tracking-widest">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span
              className={`
                mt-0.5 flex-shrink-0 text-xs font-medium
                ${accent ? "text-ink" : "text-stone-300"}
              `}
            >
              {numbered ? `${i + 1}.` : "—"}
            </span>
            <span
              className={`text-sm leading-relaxed ${accent ? "text-ink font-medium" : "text-ink/80"}`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CouncilOutput({ summary }: CouncilOutputProps) {
  return (
    <div className="persona-card bg-white border border-border rounded-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-ink px-6 py-4">
        <p className="text-xs font-medium text-canvas/60 uppercase tracking-widest">
          Council Report
        </p>
        <h2 className="mt-1 font-serif text-lg text-canvas leading-snug">
          Synthesis
        </h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Summary */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-muted uppercase tracking-widest">
            Summary
          </p>
          <p className="text-sm text-ink leading-relaxed font-serif italic text-base">
            {summary.councilSummary}
          </p>
        </div>

        <div className="border-t border-border" />

        {/* Blind Spots */}
        <Section
          title="Blind Spots Identified"
          items={summary.blindSpots}
          numbered
          accent
        />

        <div className="border-t border-border" />

        {/* Challenged Assumptions */}
        <Section
          title="Challenged Assumptions"
          items={summary.challengedAssumptions}
          numbered
        />

        <div className="border-t border-border" />

        {/* Suggested Questions */}
        <div className="space-y-3">
          <h3 className="text-[11px] font-medium text-muted uppercase tracking-widest">
            Suggested Questions for Your Real User Study
          </h3>
          <ul className="space-y-2.5">
            {summary.suggestedQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-0.5 flex-shrink-0 text-xs font-medium text-stone-300">
                  {i + 1}.
                </span>
                <span className="text-sm leading-relaxed text-ink/80 italic">
                  {q}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border" />

        {/* Segments */}
        <Section
          title="Segments to Prioritise in Recruitment"
          items={summary.segmentsToPrioritise}
          numbered
        />

        {/* Footer */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted italic">
            Use this to design a better study with real users — not to replace them.
          </p>
        </div>
      </div>
    </div>
  );
}
