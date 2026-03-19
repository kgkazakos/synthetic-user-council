# Example Output: Internal Developer Deployment Pipeline

**Research Question:** Why do engineers bypass the company's approved deployment pipeline and deploy directly to production?

**Researcher's planned question:** "When do you feel the pipeline gets in your way?"

---

## Council Summary

The deployment pipeline is fundamentally broken rather than merely slow. Misconfigured compliance scanners and hardcoded resource limits actively reject valid code. Senior developers frequently use admin access to rescue blocked junior engineers — they are not the originators of the problem.

---

## Blind Spots Identified

1. The researcher is only looking at who executes the bypass — senior engineers — ignoring that junior engineers frequently request these bypasses when blocked by tests they cannot fix themselves.
2. Assuming all deployments are lightweight web services, missing that heavy data science workloads cause the pipeline to crash from out-of-memory errors.
3. Failing to recognise that developers cannot diagnose their own builds because error logs are opaque and proprietary.
4. Not distinguishing between flaky end-to-end tests blocking frontend updates and misconfigured compliance scanners blocking legacy microservices — these are different problems with different solutions.

---

## Challenged Assumptions

1. Engineers bypass the pipeline primarily to save time during urgent incidents — many bypasses are responses to broken infrastructure, not impatience.
2. The pipeline functions correctly and the sole friction is the 45-minute wait — the pipeline may be actively rejecting valid code.
3. The engineers executing the bypass are the ones who originated the deployment problem — often they are helping someone else.

---

## Suggested Questions for Your Real User Study

1. Walk me through the last time a deployment failed in the pipeline. What was the exact error message, and how did you figure out what it meant?
2. Tell me about a time you had to ask a senior engineer to use their admin credentials to deploy your code.
3. Describe a recent situation where your code was blocked by a compliance or security scanner. How did you resolve it?
4. How do you handle deployments for non-standard workloads within the current pipeline constraints?
5. When an unrelated test fails during your deployment, what is your standard process for getting the code to production?
6. Looking back at the last time admin credentials were used to deploy — what would the pipeline have needed to do differently for the standard path to work?

---

## Segments to Prioritise

1. **Junior and mid-level engineers without admin credentials** — to understand how often they are blocked by flaky tests and cryptic error logs.
2. **Engineers maintaining legacy microservices** — to map specific compliance false positives that mandate manual overrides.
3. **Data scientists handling large computational workloads** — to investigate pipeline resource limit crashes and artifact size constraints.
