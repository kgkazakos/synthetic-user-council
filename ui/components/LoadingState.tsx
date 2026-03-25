"use client";

import type { Archetype } from "@/lib/prompts";

interface LoadingStateProps {
  currentArchetype: Archetype | null;
  completedArchetypes: Archetype[];
  isSynthesising: boolean;
}

const ALL_ARCHETYPES: Archetype[] = [
  "Power User",
  "Casual User",
  "Skeptic",
  "Edge Case User",
  "Lost Beginner",
];

export default function LoadingState({
  currentArchetype,
  completedArchetypes,
  isSynthesising,
}: LoadingStateProps) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium text-muted uppercase tracking-widest">
        {isSynthesising ? "Synthesising council report…" : "Convening council…"}
      </p>
      <div className="space-y-2">
        {ALL_ARCHETYPES.map((archetype) => {
          const isComplete = completedArchetypes.includes(archetype);
          const isActive = currentArchetype === archetype;

          return (
            <div key={archetype} className="flex items-center gap-3">
              <div
                className={`
                  w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                  transition-all duration-300
                  ${isComplete ? "bg-ink" : isActive ? "bg-ink/20" : "bg-stone-100"}
                `}
              >
                {isComplete && (
                  <svg
                    className="w-2.5 h-2.5 text-canvas"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" />
                )}
              </div>
              <span
                className={`
                  text-sm transition-colors duration-200
                  ${isComplete ? "text-ink" : isActive ? "text-ink font-medium" : "text-stone-300"}
                `}
              >
                {archetype}
              </span>
            </div>
          );
        })}

        {/* Synthesis step */}
        <div className="flex items-center gap-3 pt-1 border-t border-border mt-2">
          <div
            className={`
              w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
              transition-all duration-300
              ${isSynthesising ? "bg-ink/20" : "bg-stone-100"}
            `}
          >
            {isSynthesising && (
              <div className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" />
            )}
          </div>
          <span
            className={`text-sm ${isSynthesising ? "text-ink font-medium" : "text-stone-300"}`}
          >
            Synthesising report
          </span>
        </div>
      </div>
    </div>
  );
}
