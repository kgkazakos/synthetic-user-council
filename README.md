# Synthetic User Council

**"Synthetic personas help you ask better questions of real users."**

A multi-agent AI system that challenges researcher assumptions before user studies begin.

---

## The Problem

The most dangerous moment in user research is not when a participant says something unexpected. It is the moment before the study begins — when a researcher writes a discussion guide that is confidently, invisibly wrong.

Research questions embed assumptions. Discussion guides embed hypotheses. The Synthetic User Council is a pre-study preparation tool that surfaces those assumptions before the first interview is scheduled.

---

## What It Does

You submit a research brief. A council of 5 synthetic user personas debates your research framing, challenges your assumptions, and surfaces blind spots — so when you sit down with real users, you ask sharper questions.

**Input:** Research question + product context + target audience + existing assumptions

**Output:**
- Blind spots in your research framing
- Challenged assumptions (the things you didn't know you believed)
- Sharper interview questions for real user studies
- Recruitment priorities — which user segments matter most

---

## Example: Performance Review Platform

**Researcher's planned question:**
> "What do you find limiting about the current review format?"

**What the council surfaced:**
> Experienced managers are deliberately withholding structured data from the platform to prevent calibration algorithms from mathematically downgrading their top performers in forced distribution curves.

**Council's suggested question:**
> "Tell me about your understanding of how the data in these performance reviews is used by HR after you hit submit."

The researcher's question would have confirmed the usability hypothesis. The council's question surfaces the actual driver of behavior.

---

## The Five Archetypes

Every council includes one persona per archetype:

| Archetype | What they reveal |
|---|---|
| **Power User** | Advanced pain points, workflow assumptions |
| **Casual User** | Onboarding failures, cognitive load |
| **Skeptic** | Adoption barriers, trust deficits |
| **Edge Case User** | Accessibility failures, integration limits |
| **Lost Beginner** | Clarity failures, anxiety-inducing language |

Each persona is generated fresh from your brief — grounded in your specific product, domain, and audience.

---

## Demonstrated Across 4 Domains

| Domain | Researcher's hypothesis | What the council found |
|---|---|---|
| **PM tool onboarding** | Users overwhelmed by setup steps | Invitation step triggers per-seat billing anxiety; technical users bypass wizard intentionally |
| **Fintech ID verification** | Selfie feels invasive | Social context (public transit), hardware accessibility, legal anxiety from compliance language |
| **Developer pipeline** | Pipeline too slow (45 min) | Pipeline broken by false positives; opaque error logs; junior engineers requesting senior bypasses |
| **HR performance reviews** | Templates too rigid | Strategic data starvation to protect top performers from calibration algorithms |

In every case, the researcher's planned question would have confirmed the hypothesis while leaving the actual driver of behavior invisible.

---

## P1-P2 Bridge: Behavioral Validation

A key question for any synthetic persona system: do synthetic personas model realistic human psychological states, or just produce plausible text?

To investigate, we applied the [CausalTrack](https://github.com/kgkazakos/causaltrack) Say-Do Gap methodology to synthetic persona audio. Each persona's response was expanded into a spoken monologue, converted to audio via TTS, and analysed by Gemini for behavioral cues — hesitations, pauses, contradictions.

**Finding: Say-do gap is predicted by emotional complexity, not expertise level.**

| Archetype | Say-Do Score (avg, 2 runs) | Pattern |
|---|---|---|
| Edge Case User | ~44% | Direct — names specific blockers precisely |
| Power User | ~40% | Consistent frustration, zero surface compliance |
| Lost Beginner | ~21% | High hesitations, high pauses — anxiety masked as cooperation |
| Casual User | ~18% | Surface compliance masking disengagement |
| Skeptic | ~9% | Performative cooperation masking deep rejection |

*Scores vary across runs due to model non-determinism. Directional pattern is consistent across two independent runs.*

Personas whose concern can be named directly score higher (smaller gap). Personas with emotionally complex concerns score lower (larger gap). This mirrors CausalTrack's findings on real user interview data — suggesting synthetic personas exhibit behavioral cue patterns — hesitations, contradictions, pauses — consistent with their archetype. Whether those patterns fully replicate real human behavior is an open question the future work section of the whitepaper addresses directly.

**Score spread: ~39 points** (CausalTrack P1 reference: 79.8 points between user segments)

---

## Human Agency Statement

This tool is designed to augment human researchers, not replace them.

**What the AI does:**
- Generates personas grounded in your product context
- Challenges your research framing from 5 perspectives
- Surfaces blind spots and unasked questions
- Suggests sharper interview questions

**What only humans do:**
- Define the research question
- Judge which blind spots are relevant
- Conduct real user studies
- Interpret findings in context
- Make product decisions

The researcher remains the decision-maker. The council is preparation, not research.

---

## Whitepaper

Full methodology, results, and validation:
[docs/WHITEPAPER.md](docs/WHITEPAPER.md)

---

## Example Outputs

Council reports and bridge analysis across all 4 domains:
[examples/](examples/)

---

## Part of Computational Product Research 2026

This project is part of a portfolio exploring how AI can augment human researchers while preserving human judgment, ethics, and accountability.

**P1:** [CausalTrack](https://github.com/kgkazakos/causaltrack) — Detecting Say-Do Gaps in User Research Interviews  
**P2:** Synthetic User Council — Surfacing Researcher Blind Spots Before User Studies

---

## Citation

```
Kazakos, K. (2026). Synthetic User Council: A Multi-Agent Framework for
Surfacing Researcher Blind Spots Before User Studies.
Personal research whitepaper. github.com/kgkazakos/synthetic-user-council
```

---

*Personal research project. Not affiliated with current employer.*  
*© 2026 Kostas Kazakos, PhD | University of Melbourne*  
*Licensed under [CC BY-NC 4.0](LICENSE)*
