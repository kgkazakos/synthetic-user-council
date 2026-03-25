"use client";

import type { PersonaResponse, Archetype } from "@/lib/prompts";

interface PersonaCardProps {
  persona: PersonaResponse;
  index: number;
  isLoading?: boolean;
}

const ARCHETYPE_CONFIG: Record<
  Archetype,
  { color: string; border: string; badge: string; description: string }
> = {
  "Power User": {
    color: "text-amber-700",
    border: "border-l-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    description: "High engagement · High expectations",
  },
  "Casual User": {
    color: "text-sky-700",
    border: "border-l-sky-400",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    description: "Surface engagement · Low friction tolerance",
  },
  Skeptic: {
    color: "text-slate-600",
    border: "border-l-slate-400",
    badge: "bg-slate-50 text-slate-600 border-slate-200",
    description: "Resistant · Trust deficit",
  },
  "Edge Case User": {
    color: "text-violet-700",
    border: "border-l-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    description: "Unusual context · System limits",
  },
  "Lost Beginner": {
    color: "text-emerald-700",
    border: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "No mental model · Clarity failures",
  },
};

export function PersonaCardSkeleton({ archetype }: { archetype: Archetype }) {
  const config = ARCHETYPE_CONFIG[archetype];
  return (
    <div
      className={`
        bg-white border border-border border-l-4 ${config.border}
        rounded-sm p-6 space-y-4
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`
              text-xs font-medium px-2.5 py-1 rounded-full border
              ${config.badge}
            `}
          >
            {archetype}
          </span>
          <span className="text-xs text-muted">{config.description}</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <div className="pulse-dot w-1.5 h-1.5 rounded-full bg-stone-300" />
          <div className="pulse-dot w-1.5 h-1.5 rounded-full bg-stone-300" />
          <div className="pulse-dot w-1.5 h-1.5 rounded-full bg-stone-300" />
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="h-3 bg-stone-100 rounded w-full animate-pulse" />
        <div className="h-3 bg-stone-100 rounded w-5/6 animate-pulse" />
        <div className="h-3 bg-stone-100 rounded w-4/6 animate-pulse" />
      </div>
    </div>
  );
}

export default function PersonaCard({ persona, index }: PersonaCardProps) {
  const config = ARCHETYPE_CONFIG[persona.archetype];

  return (
    <div
      className={`
        persona-card
        bg-white border border-border border-l-4 ${config.border}
        rounded-sm p-6 space-y-5
      `}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className={`
            text-xs font-medium px-2.5 py-1 rounded-full border
            ${config.badge}
          `}
        >
          {persona.archetype}
        </span>
        <span className="text-xs text-muted">{config.description}</span>
      </div>

      {/* Reaction */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-muted uppercase tracking-widest">
          Reaction
        </p>
        <p className="text-sm text-ink leading-relaxed">{persona.reaction}</p>
      </div>

      {/* Key Concern */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-muted uppercase tracking-widest">
          What you're missing
        </p>
        <p className={`text-sm leading-relaxed font-medium ${config.color}`}>
          {persona.keyConcern}
        </p>
      </div>

      {/* Challenge */}
      <div className="pt-1 border-t border-border">
        <p className="text-sm text-muted italic leading-relaxed">
          &ldquo;{persona.challengeToResearcher}&rdquo;
        </p>
      </div>
    </div>
  );
}
