"use client";

import { useState } from "react";
import type { ResearchBrief } from "@/lib/prompts";

interface BriefFormProps {
  onSubmit: (brief: ResearchBrief) => void;
  isLoading: boolean;
}

export default function BriefForm({ onSubmit, isLoading }: BriefFormProps) {
  const [brief, setBrief] = useState<ResearchBrief>({
    researchQuestion: "",
    productContext: "",
    targetAudience: "",
    existingAssumptions: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brief.researchQuestion || !brief.productContext || !brief.targetAudience) return;
    onSubmit(brief);
  }

  const fields: {
    key: keyof ResearchBrief;
    label: string;
    placeholder: string;
    required: boolean;
    hint?: string;
  }[] = [
    {
      key: "researchQuestion",
      label: "Research Question",
      placeholder: "Why do users abandon onboarding before completing their first project?",
      required: true,
    },
    {
      key: "productContext",
      label: "Product Context",
      placeholder: "A project management tool for software teams. Onboarding involves connecting a code repo and inviting teammates. Drop-off is highest at the invite step.",
      required: true,
    },
    {
      key: "targetAudience",
      label: "Target Audience",
      placeholder: "Software engineers and engineering managers at startups (5–50 people). Mix of technical and semi-technical users.",
      required: true,
    },
    {
      key: "existingAssumptions",
      label: "Your Existing Assumptions",
      placeholder: "We think users drop off because inviting teammates feels premature. We planned to ask: 'What made it difficult to invite teammates?'",
      required: false,
      hint: "Optional but recommended — the council will challenge these directly.",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor={field.key}
              className="text-sm font-medium text-ink tracking-wide"
            >
              {field.label}
              {field.required && (
                <span className="ml-1 text-stone-400">*</span>
              )}
            </label>
            {field.hint && (
              <span className="text-xs text-muted italic">{field.hint}</span>
            )}
          </div>
          <textarea
            id={field.key}
            rows={field.key === "productContext" ? 3 : 2}
            value={brief[field.key] ?? ""}
            onChange={(e) =>
              setBrief((prev) => ({ ...prev, [field.key]: e.target.value }))
            }
            placeholder={field.placeholder}
            required={field.required}
            disabled={isLoading}
            className="
              w-full px-4 py-3 rounded-sm
              bg-white border border-border
              text-sm text-ink font-sans
              placeholder:text-stone-300
              focus:outline-none focus:ring-1 focus:ring-ink/30 focus:border-ink/40
              disabled:opacity-50 disabled:cursor-not-allowed
              resize-none transition-colors duration-150
              leading-relaxed
            "
          />
        </div>
      ))}

      <div className="pt-2">
        <button
          type="submit"
          disabled={
            isLoading ||
            !brief.researchQuestion ||
            !brief.productContext ||
            !brief.targetAudience
          }
          className="
            w-full py-3.5 px-6
            bg-ink text-canvas
            text-sm font-medium tracking-widest uppercase
            rounded-sm
            hover:bg-ink/90 active:scale-[0.99]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-ink/30 focus:ring-offset-2 focus:ring-offset-canvas
          "
        >
          {isLoading ? "Convening the Council…" : "Convene the Council"}
        </button>
      </div>
    </form>
  );
}
