// All prompt logic for the Synthetic User Council
// Isolated here so the API route stays clean and prompts are easy to iterate

export const ARCHETYPES = [
  "Power User",
  "Casual User",
  "Skeptic",
  "Edge Case User",
  "Lost Beginner",
] as const;

export type Archetype = (typeof ARCHETYPES)[number];

export interface ResearchBrief {
  researchQuestion: string;
  productContext: string;
  targetAudience: string;
  existingAssumptions?: string;
}

export interface PersonaResponse {
  archetype: Archetype;
  reaction: string;
  keyConcern: string;
  challengeToResearcher: string;
}

export interface CouncilSummary {
  blindSpots: string[];
  challengedAssumptions: string[];
  suggestedQuestions: string[];
  segmentsToPrioritise: string[];
  councilSummary: string;
}

const ARCHETYPE_VOICE: Record<Archetype, string> = {
  "Power User":
    "Direct, impatient, technically specific. No pleasantries. Gets to the point immediately. Frames everything in terms of workflow efficiency and lost time.",
  "Casual User":
    "Friendly and cooperative on the surface. Quietly disengaged underneath — gives short answers, doesn't elaborate. Polite but clearly not invested.",
  Skeptic:
    "Openly critical from the very first sentence. Does not pretend to be neutral or balanced. Has strong opinions and states them directly without softening.",
  "Edge Case User":
    "Genuinely trying to make the tool work for their specific situation. Frustrated by very concrete, technical blockers — not vague dissatisfaction. Specific and detailed, not emotional.",
  "Lost Beginner":
    "Eager to please and cooperative on the surface. Quietly panicking underneath — second-guesses themselves, apologises for confusion, trails off mid-sentence.",
};

const NO_BRAND_NAMES = `
IMPORTANT: Do not reference any specific real products, companies, or brands by name.
Use generic descriptions instead: 'prior tool', 'existing stack', 'current platform', etc.
`;

function buildBriefString(brief: ResearchBrief): string {
  return [
    `Research Question: ${brief.researchQuestion}`,
    `Product Context: ${brief.productContext}`,
    `Target Audience: ${brief.targetAudience}`,
    brief.existingAssumptions
      ? `Researcher's Existing Assumptions: ${brief.existingAssumptions}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildPersonaPrompt(
  archetype: Archetype,
  brief: ResearchBrief
): string {
  return `You are a synthetic user persona participating in a user research council session.

YOUR ARCHETYPE: ${archetype}
YOUR VOICE: ${ARCHETYPE_VOICE[archetype]}

You are responding to a researcher's brief. Your job is to challenge their assumptions — not confirm them.
Be direct, specific, and grounded in realistic human experience.

${NO_BRAND_NAMES}

Here is the researcher's brief:
${buildBriefString(brief)}

Respond as the ${archetype} persona. Return a JSON object with exactly these fields:
{
  "reaction": "2-3 sentences — your immediate, authentic reaction to being studied on this question. Shaped by your archetype voice — do NOT open with pleasantries.",
  "keyConcern": "1-2 sentences — the ONE thing the researcher probably isn't asking about but should be.",
  "challengeToResearcher": "1 direct sentence — a pointed challenge to how the researcher has framed this question. Be blunt."
}

Return ONLY valid JSON. No preamble, no markdown fences, no explanation.`;
}

export function buildSynthesisPrompt(
  brief: ResearchBrief,
  personaResponses: PersonaResponse[]
): string {
  const personaSummary = personaResponses
    .map(
      (p) =>
        `${p.archetype}:\n  Reaction: ${p.reaction}\n  Key Concern: ${p.keyConcern}\n  Challenge: ${p.challengeToResearcher}`
    )
    .join("\n\n");

  return `You are a senior UX research consultant synthesising a Synthetic User Council session.

Your job: turn five persona responses into an actionable report that helps the researcher ask BETTER QUESTIONS of REAL users.

${NO_BRAND_NAMES}

Research Brief:
${buildBriefString(brief)}

Persona Responses:
${personaSummary}

Synthesise this into a council report. Return a JSON object with exactly these fields:
{
  "councilSummary": "Exactly 3 short punchy sentences. Each sentence = one key finding. Make it scannable in 10 seconds.",
  "blindSpots": ["3-5 specific strings — gaps in the research framing the brief missed entirely"],
  "challengedAssumptions": ["2-4 strings — assumptions the council directly pushed back on"],
  "suggestedQuestions": ["5-7 strings — actual interview questions starting with Tell me, Walk me through, Describe a time, etc."],
  "segmentsToPrioritise": ["2-3 strings — which real user types to recruit and exactly why"]
}

Return ONLY valid JSON. No preamble, no markdown fences, no explanation.`;
}
