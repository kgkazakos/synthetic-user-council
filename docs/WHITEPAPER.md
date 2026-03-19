# Synthetic User Council: A Multi-Agent Framework for Surfacing Researcher Blind Spots Before User Studies

**Kostas Kazakos, PhD**  
Computing and Information Systems (HCI), University of Melbourne  
*Personal research project. Not affiliated with current employer.*  
March 2026

---

## Abstract

User research is shaped as much by what researchers fail to ask as by what participants fail to say. Before a single interview is conducted, the framing of a research question, the assumptions embedded in a discussion guide, and the segments chosen for recruitment determine what insights are possible. This paper introduces the **Synthetic User Council** — a multi-agent AI system that generates five archetypal synthetic user personas to challenge researcher assumptions before real user studies begin. The Synthetic User Council takes a research brief as input and returns a structured challenge to that brief: blind spots, challenged assumptions, and sharper interview questions for real user studies. Given a research brief, the system produces a structured debate between personas representing distinct relationships to a product, synthesising the exchange into an actionable report: blind spots in the research framing, challenged assumptions, sharper interview questions, and recruitment priorities. Demonstrated across four diverse product domains — a project management tool, a consumer fintech identity verification flow, an internal developer deployment pipeline, and an enterprise HR performance review platform — the council consistently surfaces non-obvious blind spots that empirically grounded research questions would miss. A cross-project validation using the CausalTrack Say-Do Gap detection methodology (Kazakos, 2026) finds that synthetic personas exhibit behavioral cue patterns consistent with their archetype, including hesitation, contradiction, and emotional complexity, suggesting they model realistic human psychological states rather than generic text outputs. The system is positioned explicitly as a research augmentation tool: it helps researchers ask better questions of real users, not replace them.

---

## 1. Introduction

The most dangerous moment in user research is not when a participant says something unexpected. It is the moment before the study begins, when a researcher writes a discussion guide that is confidently, invisibly wrong.

Research questions embed assumptions. Discussion guides embed hypotheses. Recruitment criteria embed definitions of who matters. These choices are made before any data is collected, and they shape everything that follows. A researcher who frames an onboarding study around complexity will find complexity. A researcher who frames an identity verification study around privacy discomfort will find privacy discomfort. The real reasons users behave as they do — social anxiety, algorithmic inaccessibility, strategic avoidance of automated scoring systems — remain invisible unless the research design was built to find them.

Traditional mitigations exist: pilot testing, discussion guide reviews, stakeholder walkthroughs. But these processes are slow, expensive, and dependent on having access to colleagues who think differently. For most researchers operating under real-world time and budget constraints, the discussion guide is written alone, reviewed briefly, and deployed as-is.

This paper describes the **Synthetic User Council**, a system designed to fill that gap. The council is a CLI tool that takes a research brief — a research question, product context, target audience, and optional existing assumptions — and returns a structured challenge to that brief. Five synthetic user personas, each representing a different archetypal relationship to the product, respond to the research framing, debate each other's positions, and collectively surface what the brief is missing.

The system is explicitly not a replacement for real user research. Synthetic personas do not have lived experiences, cannot describe emotions they have not been prompted to consider, and are not representative of any actual user population. The council's purpose is narrower and more useful: to function as a rigorous devil's advocate before the researcher sets foot in a real interview.

The contribution of this paper is threefold. First, we describe the design and architecture of the Synthetic User Council system. Second, we demonstrate its outputs across four diverse product domains, showing that the council surfaces domain-specific, non-obvious blind spots in all four cases. Third, we present a cross-project validation using the CausalTrack behavioral analysis methodology, finding that synthetic personas exhibit realistic behavioral cue signatures — a foundational requirement for any trust placed in their outputs.

---

## 2. Background and Related Work

### 2.1 The Say-Do Gap in User Research

A foundational challenge in user research is the gap between what participants report and what they actually experience. Nisbett and Wilson (1977) established that people have limited introspective access to their own cognitive processes; what they say about their behavior is often a post-hoc rationalisation rather than an accurate account. In product research contexts, this manifests as participants reporting satisfaction with products they abandon, or attributing their behavior to causes that do not match the behavioral evidence.

CausalTrack (Kazakos, 2026) introduced an audio-based methodology for detecting say-do gaps in user research interviews, using multimodal AI analysis to extract behavioral cues — hesitations, pauses, emotional tone shifts, contradictions — that signal discrepancies between verbal reports and underlying experience. Across a dataset of 50 synthetic interviews, CausalTrack detected an 80-point say-do consistency gap between user segments, demonstrating that behavioral audio analysis can surface hidden friction that self-report measures miss.

The Synthetic User Council extends this research agenda upstream: rather than detecting gaps in collected data, it attempts to prevent the research design from creating gaps in the first place.

### 2.2 Synthetic Personas in Research

The use of personas as research tools has a long history in HCI and product design (Cooper, 1999; Pruitt and Adlin, 2006). Traditional personas are constructed from prior research data and used to communicate findings. More recently, researchers have explored AI-generated personas as tools for rapid hypothesis exploration (Salminen et al., 2022), finding that language model-generated personas can represent diverse user perspectives at scale.

However, a persistent concern with AI-generated personas is their tendency toward agreeableness — producing outputs that confirm rather than challenge researcher assumptions (Argyle et al., 2023). The Synthetic User Council addresses this directly through explicit prompt design: each persona is instructed to find genuine disagreements with the research framing, and the debate mechanism pairs personas with opposing archetypes to maximise productive tension.

### 2.3 Human-Centered AI in Research

Shneiderman's Human-Centered AI framework (2022) argues that AI systems are most effective when they amplify human judgment rather than replace it. This principle directly informs the design of the Synthetic User Council. The system's output — blind spots, challenged assumptions, suggested interview questions — is designed to feed into human judgment, not to substitute for it. The researcher decides which insights are relevant. The researcher conducts real user studies. The researcher interprets findings and makes product decisions.

This positioning distinguishes the council from approaches that attempt to simulate user research outcomes directly (e.g., synthetic survey respondents, automated usability testing). The council is a preparation tool, not a research instrument.

---

## 3. System Design

### 3.1 Overview

The Synthetic User Council is a Python CLI application. The researcher provides a research brief and receives a structured council report. The full pipeline comprises four stages: persona generation, initial response collection, multi-agent debate, and report synthesis.

```
Research Brief
      ↓
Persona Generation (Gemini)
      ↓
Initial Responses × 5 personas
      ↓
Debate Exchanges × 3 pairings
      ↓
Council Report (Gemini synthesis)
      ↓
Actionable output: blind spots, challenged assumptions,
suggested questions, recruitment priorities
```

All stages are powered by Gemini via the `google.genai` SDK. Session outputs are saved to JSON for downstream analysis and cross-project integration.

### 3.2 Research Brief

The researcher provides four fields:

- **Research question:** The primary question the study aims to answer
- **Product context:** Description of the product and the situation being investigated
- **Target audience:** Who the study intends to recruit
- **Existing assumptions** *(optional)*: Current hypotheses and planned interview questions

The optional assumptions field is particularly valuable — it makes the research framing explicit and gives the council a direct target for its challenges.

### 3.3 The Five Archetypes

The council always generates exactly five personas, one per archetype. The archetypes were selected to cover the spectrum of user engagement and to ensure productive debate tension:

| Archetype | Role in the Council |
|---|---|
| **Power User** | High engagement, high expectations. Reveals advanced pain points and workflow assumptions the researcher takes for granted. |
| **Casual User** | Surface engagement, low tolerance for friction. Reveals onboarding failures and cognitive load issues. |
| **Skeptic** | Resistant to the product or category. Reveals adoption barriers, trust deficits, and unexamined value propositions. |
| **Edge Case User** | Unusual context that exposes system limits. Reveals accessibility failures, non-standard workflows, and integration gaps. |
| **Lost Beginner** | No prior mental model. Reveals clarity failures, anxiety-inducing language, and assumed knowledge. |

Each persona is generated fresh from the research brief — grounded in the specific product context, target audience, and domain. A Power User in a fintech brief is a sophisticated multi-app financial optimizer; a Power User in a developer tooling brief is a Tech Lead who built the system being studied. Generic persona generation is explicitly penalised in the prompt design.

### 3.4 Debate Mechanism

Following initial responses, the system runs three structured debate exchanges between opposing archetypes:

- Power User challenges Casual User
- Skeptic challenges Edge Case User
- Lost Beginner challenges Power User

Each challenger is instructed to find a genuine contradiction or blind spot in the target's position — not to agree, not to soften, not to seek consensus. This design choice directly addresses the agreeableness problem documented in prior AI persona research.

### 3.5 Report Synthesis

The council report synthesises all persona responses and debate exchanges into five outputs:

1. **Council Summary:** Three short sentences, one key finding each
2. **Blind Spots:** 3-5 specific gaps in the research framing
3. **Challenged Assumptions:** 2-4 assumptions the council pushed back on directly
4. **Suggested Questions:** 5-8 actual interview questions for real user studies
5. **Segments to Prioritise:** 2-3 user types to recruit and why

The report is explicitly oriented toward the researcher's next action: talking to real users with better questions.

---

## 4. Demonstration Results

The Synthetic User Council was run on four research briefs spanning distinct product domains. All briefs used real-world research scenarios with recognisable drop-off or avoidance behaviours. No specific organisations or commercial products are named.

### 4.1 Brief 1: Project Management Tool Onboarding

**Research question:** Why do users abandon the onboarding flow before completing their first project?

**Researcher's planned question:** "What made it difficult to invite your teammates?"

**Key blind spots surfaced:**

The council challenged the fundamental framing of "abandonment." The Power User persona identified that technical evaluators deliberately bypass onboarding flows to stress-test APIs and integration capabilities — completing the wizard is not their success metric. The Skeptic surfaced a finding the researcher had not considered: the invitation step is perceived as a trigger for per-seat billing, causing users to deliberately halt before inviting colleagues during a free trial. The Edge Case User identified that repository connection requirements create hard blockers for users without administrative credentials — a segment the researcher's brief had not acknowledged.

**Sharpest suggested question:**
*"Walk me through what goes through your mind when a trial tool asks for code repository permissions."*

This question is structurally different from the researcher's planned question. It is specific, behaviorally grounded, and open — it does not embed the assumption that the experience was difficult.

---

### 4.2 Brief 2: Consumer Fintech Identity Verification

**Research question:** Why do users start but never complete the identity verification process?

**Researcher's planned question:** "What made you uncomfortable about the verification process?"

**Key blind spots surfaced:**

The council identified four blind spots absent from the brief. First, physical context: the Casual User persona noted that the selfie requirement is functionally unusable on public transit — the drop-off is situational, not attitudinal. Second, hardware accessibility: the Edge Case User identified that strict capture algorithms are physically impossible for users with tremors or low-quality front cameras. Third, legal anxiety: the Lost Beginner persona surfaced that compliance-oriented warning language on the camera screen causes first-time users to fear permanent account blocks or fraud flags — interpreting a UX warning as a legal threat. Fourth, the value exchange: the Power User identified that biometric demands precede any demonstration of product value, inverting the trust-building sequence.

The researcher's planned question ("What made you *uncomfortable*?") embeds a specific emotional frame — discomfort — that would direct participants toward privacy concerns while obscuring situational, accessibility, and anxiety-driven explanations.

**Sharpest suggested question:**
*"Tell me about where you were and what you were doing the last time you opened a financial app to make a quick payment."*

---

### 4.3 Brief 3: Internal Developer Deployment Pipeline

**Research question:** Why do engineers bypass the company's approved deployment pipeline and deploy directly to production?

**Researcher's planned question:** "When do you feel the pipeline gets in your way?"

**Key blind spots surfaced:**

The council fundamentally reframed the research question. The researcher's hypothesis was that the pipeline is too slow. The council identified that the pipeline may be broken: the Power User persona surfaced that compliance scanners throw false positives for legacy microservices; the Edge Case User identified that the pipeline infrastructure cannot physically handle large machine learning workloads, crashing from out-of-memory errors rather than timing out. The Lost Beginner persona — a senior engineer new to the company — identified that opaque error logging makes self-diagnosis impossible, forcing engineers to request admin bypasses from colleagues rather than fix their own deployments.

The council also challenged the researcher's assumption about who is driving bypasses: senior engineers with admin credentials are often executing bypasses on behalf of junior colleagues who lack permissions, not on behalf of themselves.

**Sharpest suggested question:**
*"Walk me through the last time a deployment failed in the pipeline. What was the exact error message, and how did you figure out what it meant?"*

---

### 4.4 Brief 4: Enterprise HR Performance Review Platform

**Research question:** Why do managers skip the standardised performance review templates and write their own freeform reviews instead?

**Researcher's planned question:** "What do you find limiting about the current review format?"

**Key blind spots surfaced:**

The council's most significant finding was strategic rather than usability-driven. The Power User persona identified that experienced managers are deliberately withholding structured data from the platform to prevent calibration algorithms from mathematically downgrading their top performers in forced distribution curves. This is not a usability complaint — it is an informed strategic response to how the backend system uses submitted data. Asking managers what they find "limiting" would never surface this.

The Edge Case User identified that the template's metrics are designed exclusively for client-facing billable staff, making them inapplicable to internal operations teams — a segment the HR team had not acknowledged. The Lost Beginner persona identified severe anxiety among newly promoted managers who default to freeform reviews not out of preference but out of fear of making a technical mistake that affects a direct report's compensation.

**Sharpest suggested question:**
*"Tell me about your understanding of how the data in these performance reviews is used by HR after you hit submit."*

---

### 4.5 Cross-Domain Pattern

Across all four briefs, a consistent pattern emerged: **the researcher's planned question was framed around the researcher's hypothesis rather than the participant's experience.** In every case, the planned question would have confirmed the existing assumption while leaving the actual driver of behavior unexamined. The council's suggested questions are consistently behaviorally grounded, temporally specific, and free of embedded assumptions.

---

## 5. P1-P2 Bridge: Behavioral Validation of Synthetic Personas

A foundational concern with any synthetic persona system is whether the personas model psychologically realistic human states or simply produce plausible text. If personas are only surface-level credible, the blind spots they surface may reflect the prompting architecture rather than genuine human complexity.

To investigate this, we applied the CausalTrack behavioral analysis methodology (Kazakos, 2026) to synthetic persona audio. Each persona's research brief response was expanded into a 300-400 word spoken monologue using archetype-specific voice instructions, converted to audio via text-to-speech synthesis, and uploaded to Gemini for behavioral cue extraction. Say-Do Consistency Scores were calculated using a blended formula: 60% weight on Gemini's alignment judgment, 40% weight on positive sentiment ratio.

### 5.1 Voice Design

A critical design decision was the use of archetype-specific voice instructions to prevent all personas from defaulting to a generic polite interview template. Without these instructions, preliminary runs produced convergent monologue structures — every persona opened with courtesy phrases and followed the same surface-cooperative-then-honest arc. The voice instructions enforce authentic archetype differentiation from the first sentence:

- **Power User:** Direct, impatient, technically specific. No pleasantries.
- **Skeptic:** Openly critical from the first sentence. Does not pretend to be neutral.
- **Lost Beginner:** Eager to please on the surface, quietly panicking underneath.

### 5.2 Results

Running the bridge on the project management tool brief across two independent runs produced the following pattern:

| Archetype | Run 1 Score | Run 2 Score | Avg | Behavioral Pattern |
|---|---|---|---|---|
| Edge Case User | 35.0% | 53.0% | 44.0% | Specific blockers, direct articulation |
| Power User | 32.0% | 48.0% | 40.0% | Consistent frustration, zero surface compliance |
| Lost Beginner | 24.0% | 19.0% | 21.5% | High hesitations (6-8), high pauses (5-6) |
| Casual User | 15.7% | 20.4% | 18.1% | Surface compliance masking disengagement |
| Skeptic | 9.0% | 9.0% | 9.0% | Performative cooperation masking deep rejection |

**Score spread: 35-44 points across two runs** (P1 reference: 79.8 points between user segments).

### 5.3 Finding: Emotional Complexity Predicts Say-Do Gaps

The original hypothesis was that satisfaction level would predict say-do consistency — satisfied users scoring high, dissatisfied users scoring low. The data did not support this. Instead, **emotional complexity predicts say-do gap magnitude**, independent of satisfaction or expertise level.

Personas whose concern can be named directly (Edge Case User: "the integration doesn't support my architecture"; Power User: "this workflow doesn't handle my team's velocity") score higher — there is no gap between what they say and what they mean. Personas whose concern is emotionally complex (Skeptic: performative cooperation masking deep distrust; Lost Beginner: surface eagerness masking anxiety) score lower — the surface behavior diverges from the underlying state.

This finding has implications for real user research. It suggests that the most misleading interview participants are not the unsatisfied ones — they are the ones whose dissatisfaction is emotionally complex enough that it does not surface in direct verbal responses. The council's design, which forces each persona to articulate both a surface reaction and an underlying concern, is therefore capturing a psychologically meaningful distinction.

The Skeptic's consistent floor score of 9.0% across both runs, and across multiple brief domains, is particularly notable. A Skeptic says cooperative things ("I'm happy to help with your research") while meaning the opposite ("I have no intention of changing my behavior"). This is a specific form of say-do gap — not confusion or complexity, but deliberate performance. CausalTrack detects it. Synthetic personas exhibit it.

---

## 6. Human Agency Statement

The Synthetic User Council is designed to augment human researchers, not replace them.

**What the AI does:**
- Generates synthetic personas grounded in the product context
- Challenges the research framing from five archetypal perspectives
- Surfaces blind spots and unasked questions
- Suggests sharper interview questions for real user studies

**What only humans do:**
- Define the research question and its strategic purpose
- Judge which blind spots are relevant to their specific context
- Conduct real user studies with actual participants
- Interpret findings in light of organizational context
- Make product decisions and take accountability for outcomes

The researcher remains the decision-maker. The council is a tool for improving the quality of questions brought to real users — it does not and cannot replace the insights that come from real human participants.

---

## 7. Limitations

**Synthetic personas are not real users.** They do not have lived experiences, cannot report genuine emotions, and are not statistically representative of any user population. They are computational approximations of archetypal user perspectives, generated from a research brief. Insights should be treated as hypotheses to be tested, not findings to be reported.

**The system is sensitive to brief quality.** A vaguely written brief produces vague personas. The council rewards researchers who have already done the work of articulating their assumptions clearly — it amplifies existing specificity rather than compensating for its absence.

**Archetype coverage is fixed.** The five archetypes cover a useful range of user relationships to a product, but they do not cover every relevant perspective. Domain-specific user types — clinical users, regulated users, institutional buyers — may not be well-represented by any of the five archetypes. Researchers should treat the council as a starting point for perspective generation, not a complete map.

**Behavioral validation is preliminary.** The P1-P2 bridge demonstrates that synthetic personas exhibit behavioral cue patterns consistent with their archetype. This supports a claim of psychological plausibility but does not constitute empirical validation against real user behavior. A formal comparison study between synthetic persona responses and matched real user interview data would be required to make stronger claims about realism.

**Say-Do Score stability varies across runs.** Due to the probabilistic nature of large language model outputs, individual persona scores vary between runs. The directional pattern — Edge Case and Power User scoring higher than Skeptic and Lost Beginner — is consistent. Absolute score values should not be interpreted as precise measurements.

---

## 8. Future Work

**Formal replication study.** The most important next step is a randomised controlled trial comparing research discussion guides prepared with and without the council. The primary outcome measure is interview question quality, scored on specificity, assumption load, blind spot coverage, and actionability. A planned replication in collaboration with the University of Melbourne HCI group will address this.

**Validation against real user data.** Running the council on research briefs where ground-truth user data already exists would allow direct comparison between synthetic persona predictions and actual user findings. This would provide stronger evidence for or against the realism claims made in Section 5.

**Integration with real-time study design.** The current system operates as a pre-study preparation tool. An integration with discussion guide templates — where suggested questions are automatically formatted for use in an interview platform — would reduce the friction between council output and study execution.

**Extended archetype set.** Domain-specific archetypes (regulated user, institutional buyer, accessibility-dependent user) would extend the council's coverage for specialised research contexts.

---

## 9. Conclusion

Researcher blind spots are not a failure of skill — they are a structural feature of how research questions get formed. When a single person writes a discussion guide, they bring their own mental model of the user, their own hypothesis about the problem, and their own professional framing of what counts as a relevant question. No amount of rigor in data collection compensates for assumptions that were baked in before the first interview was scheduled.

The Synthetic User Council is a practical intervention at the moment of brief formation. By generating five archetypal challenges to a research framing — before the study begins, before the guide is written, before participants are recruited — the system surfaces the questions a researcher did not know they were not asking.

Across four diverse product domains, the council consistently identified non-obvious blind spots: algorithmic inaccessibility in a verification flow, strategic data withholding in a performance platform, infrastructure failures masquerading as impatience in a developer tool, and social context barriers invisible to a privacy-focused research frame. In each case, the council's suggested questions were demonstrably sharper than the researcher's planned questions — more specific, less assumption-laden, and more likely to surface the actual driver of user behavior.

The system is not a substitute for real user research. It is what the best critical colleague would give you if they had unlimited time, zero social friction, and five completely different perspectives on your product — before you walked into the field.

---

## References

Argyle, L.P., Busby, E., Fulda, N., Gubler, J., Rytting, C., & Wingate, D. (2023). Out of One, Many: Using Language Models to Simulate Human Samples. *Political Analysis*, 31(3), 337-351.

Cooper, A. (1999). *The Inmates Are Running the Asylum*. Sams Publishing.

Gray, M.L., & Suri, S. (2019). *Ghost Work: How to Stop Silicon Valley from Building a New Global Underclass*. Houghton Mifflin Harcourt.

Kazakos, K. (2026). *CausalTrack: Detecting Say-Do Gaps in User Research Interviews Using Multimodal Behavioral Analysis*. Personal research whitepaper. github.com/kgkazakos/causaltrack

Nisbett, R.E., & Wilson, T.D. (1977). Telling more than we can know: Verbal reports on mental processes. *Psychological Review*, 84(3), 231-259.

Pruitt, J., & Adlin, T. (2006). *The Persona Lifecycle: Keeping People in Mind Throughout Product Design*. Morgan Kaufmann.

Salminen, J., Guan, K., Jung, S.G., Chowdhury, S.A., & Jansen, B.J. (2022). A literature review of quantitative persona creation. *CHI Conference on Human Factors in Computing Systems*.

Shneiderman, B. (2022). *Human-Centered AI*. Oxford University Press.

---

*Personal research project. Not affiliated with current employer.*  
*© 2026 Kostas Kazakos. Licensed under CC BY-NC 4.0.*  
*This whitepaper is part of the Computational Product Research portfolio.*  
*github.com/kgkazakos*
