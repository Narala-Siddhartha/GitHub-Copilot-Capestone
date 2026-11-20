---
story: US-001
phase: 3-design-review
status: awaiting_approval
date: 2026-11-17
author: design-reviewer
---
# Design Review — US-001

## 1. Review Summary
**Decision: REJECTED.** The architecture maps all 25 REQ/NFR/BR items to logical components and ADRs, but mapping is not proof of feasibility. The complete-results capability required by NFR-001 is explicitly unverified, and the proposed provider integration and host-stack binding remain unresolved. These are material coverage/completeness gaps, not facts supplied by the human's “defaults / proceed with assumptions” response. Findings: 0 Critical, 2 High, 3 Medium, 0 Low.

## 2. Review Scope
- Reviewed: `01-requirements.md` (2026-11-17; phase 1 approved per artifact/workflow status) and `02-architecture.md` (2026-11-17; phase 2 approved per workflow status).
- Workflow preconditions: phases 1 and 2 are `approved`; phase 3 is recorded as `awaiting_approval` by this review. Phase 4 remains `pending`.
- Review areas: requirements completeness; component responsibilities; scalability; performance; security; authentication/authorization; data integrity/consistency; error handling/resilience; API design; integration dependencies; deployment/operational readiness; maintainability/technical debt; cost/technology complexity.
- Architecture sections 1–13 and ADR-001–003 were reviewed. No mandatory architecture section is absent.
- Not verified from the supplied artifacts: the actual search provider and pagination/completeness contract, catalog source/IDs, application stack/platform, deployed authn/z and transport/logging controls, telemetry behavior, or performance-test environment. These are recorded as findings/open questions, not assumed facts.
- The human's “defaults / proceed with assumptions” response to the architecture questions is recorded as acceptance to carry the architecture's explicitly labeled assumptions and associated uncertainty as assumptions/risk treatment. It does not supply detail-specific answers to OQ-1–OQ-5, select a stack/provider, or establish that any such system exists or has a capability.

Review-area observations:
1. **Requirements completeness:** all identifiers have a logical mapping; NFR-001 feasibility remains blocked by unknown provider completeness.
2. **Component responsibilities:** the controls/state/coordinator/engine/adapter/renderer split is understandable and generally requirement-driven. Ownership of final empty/error presentation could be clarified, but this is not independently blocking.
3. **Scalability:** no new service or scaling tier is proposed; the specified target is bounded to 1,000 properties. Larger-set behavior is outside the stated target.
4. **Performance:** a ≤1 s p95 target and measurement intent are stated; platform, provider latency, and test conditions are unconfirmed.
5. **Security:** logical controls are stated in §9, but actual inherited controls and integration behavior cannot be verified.
6. **Authentication/authorization:** the design requires provider access scope to be preserved; the real provider/session behavior is unknown.
7. **Data integrity/consistency:** exact matching, request identities, complete responses, and atomic commits are specified; end-to-end completeness is unverified.
8. **Error handling/resilience:** typed failures, retained criteria, no partial commits, and empty-vs-error distinction are specified.
9. **API design:** contracts are stack-neutral, with criteria IDs, completeness indication, request identity, and normalized errors; transport and concrete provider contract are deferred.
10. **Integration dependencies:** provider/catalog are stated but unverified; this is a high-risk unresolved dependency.
11. **Deployment/operational readiness:** no unsupported infrastructure is added, but host/deployment/observability details cannot be bound until the host is identified.
12. **Maintainability/technical debt:** boundaries and decision deferrals are documented; no confirmed technical-debt issue found beyond unresolved contracts.
13. **Cost/technology complexity:** no new framework, service, database, cache, or deployment unit is justified or proposed. No over-engineering finding is warranted by the artifact.

## 3. Findings

| ID | Severity | Area | Related REQ/NFR/component | Architecture change required? |
|----|----------|------|---------------------------|-------------------------------|
| DRF-001 | High | Requirements completeness / integration | NFR-001; REQ-003, REQ-005, REQ-006, REQ-009; Search Results Adapter; ADR-001 | yes |
| DRF-002 | High | Integration / deployment readiness | REQ-001, REQ-012; NFR-003, NFR-004, NFR-006; ADR-003 | yes |
| DRF-003 | Medium | Performance | NFR-003; Filter Coordinator, Search Results Adapter; ADR-001/003 | yes |
| DRF-004 | Medium | Security / authn-z / privacy | NFR-005, NFR-006; Search Results Adapter; ADR-001/003 | yes |
| DRF-005 | Medium | Accessibility / component contract | NFR-004; Filter Controls and Empty/Error Presentation; Existing Results Renderer | yes |

### DRF-001 — Complete-result guarantee is conditional on an unknown provider
- **Description:** The architecture requires complete results and rejects pagination/truncation, but does not establish that the existing page/provider can return the complete current-search set or perform criteria-aware search with completeness guarantees. The architecture itself labels NFR-001 and related requirements blocked. Until the integration mode and its completeness contract are confirmed, the central filtering behavior cannot be shown to satisfy the requirement that no matching property be omitted.
- **Evidence:** `02-architecture.md` §§1, 5, 7, 12 (ADR-001 remains proposed pending OQ-1), 13 (R-01 and “Blocked requirements”); `01-requirements.md` §6 NFR-001 and §§5/8 REQ-003, REQ-005, REQ-006, REQ-009.
- **Related requirement or component:** NFR-001; REQ-003, REQ-005, REQ-006, REQ-009; Search Results Adapter; ADR-001.
- **Severity:** High.
- **Impact:** A loaded-page-only or silently truncated implementation could omit matching properties, violating correctness and the business purpose. This is a potential outcome if the provider lacks the required capability; it is not a claim that the provider currently truncates results.
- **Recommended resolution:** Confirm the actual provider and pagination/search contract, then have the architect select and document an execution mode whose completeness can be demonstrated for the current search context. Retain the prohibition on partial commits and define how completeness is established. Re-review after the dependency and ADR-001 are resolved.
- **Architecture change required:** yes.

### DRF-002 — Host stack and integration binding remain unresolved
- **Description:** The architecture leaves the application stack, target platform, UI system, provider contract, deployment, and observability unspecified; ADR-003 is still proposed and OQ-2 remains open. This prevents confirmation that the proposed logical components can be integrated into the actual application and that the deployment/security/accessibility assumptions correspond to the real host. The requirements-phase response does not select a technology or identify an application/provider.
- **Evidence:** `02-architecture.md` §§1, 7, 10–12 (ADR-003 proposed; OQ-2), 13 (R-02); the requirements’ ASM-017 in `01-requirements.md` §11 explicitly defers technology choice to phase 2. No stack/provider fact is established by the human response recorded in this review scope.
- **Related requirement or component:** REQ-001, REQ-012; NFR-003, NFR-004, NFR-006; ADR-003 and the existing search page/provider boundary.
- **Severity:** High.
- **Impact:** Design feasibility, provider integration, release/deployment fit, and verification environment are unknown; implementation planning against this abstraction risks substantial rework or an incompatible integration.
- **Recommended resolution:** Identify the actual application/host and provider from authoritative project evidence, bind the design to their existing interfaces and operational controls, and resolve ADR-003/OQ-2. Do not infer a stack from framework folders or the human's assumptions response.
- **Architecture change required:** yes.

### DRF-003 — NFR-003 performance acceptance conditions are not testable yet
- **Description:** The ≤1 second p95/1,000-property target is carried through, but the architecture does not define the measurement boundary or representative platform/provider conditions. ADR-001 permits either local or provider-side filtering, whose latency profiles differ; OQ-4 explicitly leaves the test conditions open. A test result would therefore not yet have an agreed meaning.
- **Evidence:** `01-requirements.md` §6 NFR-003 and §8 AC-N003-1; `02-architecture.md` §§10, 12 (ADR-001/003), and OQ-4.
- **Related requirement or component:** NFR-003; Filter Coordinator, Search Results Adapter; ADR-001/003.
- **Severity:** Medium.
- **Impact:** The design could appear to meet the target under a narrow local-only measurement while failing end-to-end, or be judged against inconsistent environments. This is uncertainty, not a claim that the target will fail.
- **Recommended resolution:** Record the supported host/test conditions and whether timing is end-to-end from filter interaction through render (including provider time where applicable); then specify a reproducible p95 verification approach consistent with the fixed requirement.
- **Architecture change required:** yes.

### DRF-004 — Security/privacy inheritance is not verifiable at the unresolved boundary
- **Description:** Section 9 specifies sound logical safeguards (catalog-ID validation, safe query mechanisms, safe rendering, user-scoped authorization, protected transport, and no sensitive logging). However, the actual provider/session, transport, error/telemetry behavior, and existing policies are unknown and represented as assumptions. The architecture therefore cannot yet demonstrate that those controls are available and correctly inherited at the adapter boundary. This is a completeness finding, not a confirmed vulnerability.
- **Evidence:** `02-architecture.md` §§7, 9 (controls depend on existing provider/stack), 13 (ASM-003/006 and R-07), and OQ-5; `01-requirements.md` §6 NFR-005.
- **Related requirement or component:** NFR-005, NFR-006; Search Results Adapter; ADR-001/003.
- **Severity:** Medium.
- **Impact:** **Potential risk:** if the actual provider does not enforce the existing user's access scope, or existing telemetry records criteria/property data, results or preference data could be exposed beyond the intended boundary. No such behavior is established by the reviewed artifacts.
- **Recommended resolution:** Verify the real integration's authentication/authorization scope, protected transport, parameterized query mechanism, safe error handling, secret handling, and logging/telemetry fields. Have the architect record concrete inherited controls and any required boundary changes; do not introduce a new identity or storage system without need.
- **Architecture change required:** yes.

### DRF-005 — Accessibility requirement lacks a host-bound interaction contract
- **Description:** The architecture commits to WCAG 2.1 AA and keyboard operation, but leaves the UI system unselected and does not specify enough control/state behavior to make the required empty/error and multi-select interactions verifiable (for example, accessible names/states, focus behavior, and announcement of result/empty/error updates). This is a design completeness gap; no accessibility defect in an existing implementation is alleged.
- **Evidence:** `01-requirements.md` §6 NFR-004 and §8 AC-N004-1; `02-architecture.md` §§5, 9, 11 (UI stack proposed) and OQ-2.
- **Related requirement or component:** NFR-004; Filter Controls and Empty/Error Presentation; Existing Results Renderer; ADR-003.
- **Severity:** Medium.
- **Impact:** The implementation may not provide a testable path to the explicit keyboard/WCAG acceptance criteria, particularly for immediate result updates and empty/error states.
- **Recommended resolution:** Once the host/UI system is identified, document the accessible interaction and state/announcement contract for filter controls, clear action, and result/empty/error transitions, and identify how WCAG 2.1 AA and keyboard-only acceptance will be verified.
- **Architecture change required:** yes.

## 4. Risk Assessment

| Risk | Likelihood | Impact | Related findings |
|------|------------|--------|------------------|
| Provider cannot supply complete matching results for the current search context. | Unknown; dependency is unverified | High: NFR-001 and result correctness may be impossible without a changed integration/contract | DRF-001 |
| Actual host/provider differs from the stack-neutral assumptions. | Unknown; host not identified | High: integration, deployment, and verification rework | DRF-002 |
| The 1-second p95 target cannot be measured consistently or met on the actual path. | Unknown until conditions/provider are known | Medium/High: performance criterion cannot be validated | DRF-003 |
| Existing provider/session or telemetry controls do not match the stated security/privacy assumptions. | Unknown; no evidence of a defect | High privacy/access impact if the potential risk materializes | DRF-004 |
| Accessible semantics of the eventual host controls do not meet WCAG/keyboard acceptance. | Unknown until host/UI system is known | Medium/High: exclusion or acceptance failure | DRF-005 |

Independent requirements coverage check:

The mapping below was rebuilt from `01-requirements.md` §§5–7 against component responsibilities and decisions in `02-architecture.md` §§5, 7–8, and 12. It is not copied from the architect's matrix. “Match” compares logical traceability, not demonstrated feasibility. In particular, mapped-but-conditional does not close DRF-001/002/003/004/005.

| REQ/NFR/BR | Reviewer's mapping | Architect's mapping | Match? |
|------------|--------------------|---------------------|--------|
| REQ-001 | Filter Controls; Existing Results Renderer | Filter Controls/Empty/Error Presentation; Existing Results Renderer; ADR-003 proposed | Yes; host binding open |
| REQ-002 | Filter Controls; Page-scoped Filter State | Filter Controls/Empty/Error Presentation; Page-scoped Filter State; ADR-002/003 proposed | Yes |
| REQ-003 | Exact-match Engine; Coordinator; Adapter | Exact-match Filter Engine; Filter Coordinator; Search Results Adapter; ADR-001 proposed | Yes; completeness conditional |
| REQ-004 | Filter Controls; Page-scoped Filter State | Filter Controls/Empty/Error Presentation; Page-scoped Filter State; ADR-002/003 proposed | Yes |
| REQ-005 | Exact-match Engine; Coordinator; Results Renderer | Exact-match Filter Engine; Filter Coordinator; Existing Results Renderer; ADR-001 proposed | Yes; completeness conditional |
| REQ-006 | Exact-match Engine; Coordinator; Adapter | Exact-match Filter Engine; Filter Coordinator; Search Results Adapter; ADR-001 proposed | Yes; completeness conditional |
| REQ-007 | Engine/Coordinator; empty-state presentation; Results Renderer | Filter Controls/Empty/Error Presentation; Coordinator; Existing Results Renderer; ADR-001 proposed | Yes |
| REQ-008 | Filter Controls/state; clear-all and empty-state presentation | Filter Controls/Empty/Error Presentation; Page-scoped Filter State; ADR-002 | Yes |
| REQ-009 | Coordinator; Adapter; Results Renderer | Filter Coordinator; Search Results Adapter; Existing Results Renderer; ADR-001/002 | Yes; complete restoration conditional |
| REQ-010 | Coordinator; immutable SearchContext/Adapter | Filter Coordinator; Search Results Adapter; ADR-001 proposed | Yes |
| REQ-011 | Page-scoped Filter State | Page-scoped Filter State; ADR-002 | Yes |
| REQ-012 | Controls; State; Coordinator | Filter Controls/Empty/Error Presentation; Filter Coordinator; ADR-001/003 proposed | Yes |
| REQ-013 | Page-scoped Filter State; Coordinator; Adapter | Page-scoped Filter State; Filter Coordinator; Search Results Adapter; ADR-001/002 | Yes |
| REQ-014 | Filter Controls; Exact-match Engine | Exact-match Filter Engine; Filter Controls/Empty/Error Presentation; ADR-001 proposed | Yes |
| REQ-015 | Exact-match Engine using canonical catalog IDs | Exact-match Filter Engine; ADR-001 proposed | Yes |
| REQ-016 | Exact-match Engine with missing/unrecognized-value exclusion | Exact-match Filter Engine; ADR-001 proposed | Yes |
| NFR-001 | Complete-set Adapter contract; Engine/Coordinator atomic commit | Engine; Coordinator; Adapter; Results Renderer; ADR-001 proposed | **Partial:** mapped, but provider completeness explicitly blocked |
| NFR-002 | Volatile Page-scoped Filter State | Page-scoped Filter State; ADR-002 | Yes |
| NFR-003 | End-to-end measurement for Engine/Coordinator/Adapter | Engine; Coordinator; Adapter; ADR-001/003 proposed | **Partial:** mapped, actual platform and measurement conditions open |
| NFR-004 | Keyboard-operable accessible Controls/Renderer and state announcements | Filter Controls/Empty/Error Presentation; Existing Results Renderer; ADR-003 proposed | **Partial:** requirement mapped, interaction contract/host unverified |
| NFR-005 | Ephemeral State; Adapter telemetry/logging boundary | Page-scoped Filter State; Search Results Adapter; ADR-002/003 proposed | **Partial:** controls described, inherited telemetry unverified |
| NFR-006 | Adapter typed failure; Coordinator atomic error state; Controls presentation | Filter Coordinator; Search Results Adapter; Filter Controls/Empty/Error Presentation; ADR-001 proposed | Yes; provider/host binding open |
| BR-001 | Exact-match Engine: AND selected amenities | Exact-match Filter Engine; ADR-001 proposed | Yes |
| BR-002 | Exact-match Engine/Coordinator: intersection of categories | Exact-match Filter Engine; Filter Coordinator; ADR-001 proposed | Yes |
| BR-003 | Immutable SearchContext; State/Coordinator/Adapter preserve context | Filter Coordinator; Page-scoped Filter State; Search Results Adapter; ADR-001/002 | Yes |

**Coverage conclusion:** all 16 REQ, 6 NFR, and 3 BR have an identifiable logical implementation mapping (25 total). No identifier is omitted from the independent mapping. However, the traceability matrix alone does not establish that the architecture can satisfy requirements: NFR-001 and the related completeness-dependent REQs are explicitly blocked pending provider verification; NFR-003/004/005 are not yet verifiable against an identified host and environment. These are the material gaps behind the rejection.

**Security assessment (mandatory):**
- **Trust boundaries:** `02-architecture.md` §9 identifies control events entering the page, criteria crossing the adapter/provider boundary, and provider/catalog data returning. It directs validation of provider data and catalog values. The actual provider and runtime are unidentified, so the real boundary and data flow cannot be verified.
- **Authentication/authorization:** §7 and §9 say existing authentication/authorization applies and require the provider to enforce the user's access scope without elevation. This is an appropriate logical requirement, but the actual session propagation and provider enforcement are not evidenced (DRF-004). No new privileged endpoint or identity mechanism is proposed.
- **Data protection:** §8–9 prohibit new durable filter storage, criteria analytics, sensitive logs, and require existing protected transport. Criteria are described as ephemeral. Actual transport, browser/provider telemetry, and inherited logging behavior remain unknown; no evidence supports claiming data is currently exposed.
- **Injection surfaces:** criteria are catalog IDs, unknown IDs are rejected, query construction must use the provider's safe mechanism, and labels/error details must not be interpreted as markup (§7, §9). No free-form query or user-controlled endpoint is specified. The actual query binding and rendering implementation cannot be checked until the host/provider is known.
- **SSRF and secret handling:** no user-controlled provider URL, new endpoint, credential, or secret-management component is specified in §§7–9. No SSRF or secret-handling vulnerability is evidenced by the design. The architecture relies on existing provider configuration and secrets controls, which need confirmation with the actual integration.
- **Overall:** no confirmed security vulnerability is identified from these artifacts. DRF-004 is a completeness/potential-risk finding because the security controls are requirements on an unknown integration, not evidence that they are absent or defective.

## 5. Recommended Changes

| # | Change | Resolves | Significant decision? (needs human agreement) |
|---|--------|----------|-----------------------------------------------|
| 1 | Verify the actual search provider/catalog and document a complete-results contract; resolve ADR-001 and identify how pagination/completeness is guaranteed. | DRF-001 | Yes, if provider capability requires choosing or changing the integration mode |
| 2 | Identify the existing application/host and bind ADR-003 to its stack, platform, deployment, and established interfaces; do not infer these from the defaults response. | DRF-002 | Yes |
| 3 | Define reproducible end-to-end p95 measurement conditions on the selected host/provider, preserving the NFR-003 threshold. | DRF-003 | No, unless proposed conditions conflict with the approved requirement |
| 4 | Verify and record actual authn/z scope, transport, safe query/rendering, secrets, and telemetry/logging behavior at the selected adapter boundary. | DRF-004 | Yes if existing controls are insufficient or a new boundary is proposed |
| 5 | Specify accessible control and state-transition behavior on the selected UI system, including keyboard-only and empty/error/result update verification. | DRF-005 | No, unless a product/UI behavior decision is needed |

## 6. Accepted Risks

| Risk / finding | Accepted by | Date | Rationale |
|----------------|-------------|------|-----------|
| Requirements-phase assumptions ASM-003–ASM-019 in `01-requirements.md` §11, including the stated filter semantics, persistence, performance/accessibility/privacy/reliability defaults. | Human user (response: “defaults / proceed with assumptions”) | 2026-11-17 | The response accepts these documented defaults as assumptions; it does not add new requirement values. |
| Architecture assumptions ASM-001–ASM-007 in `02-architecture.md` §Assumptions and the uncertainty in architecture OQ-1–OQ-5. | Human user (response: “defaults / proceed with assumptions”) | 2026-11-17 | Recorded as acceptance to proceed with the documented assumptions/risks, not as answers to the questions or facts about a provider, stack, catalog, platform, or controls. In particular, this does not demonstrate provider completeness or satisfy DRF-001–005; those findings remain open for design approval. |

## 7. Open Questions
- **OQ-1 (architecture; high):** Which actual search page/provider serves this flow, and does it provide complete matching results across pagination or an exact criteria-aware completeness guarantee? How is completeness signaled?
- **OQ-2 (architecture; high):** What existing application repository, stack, target platform, UI/accessibility system, deployment, and observability policy does this feature extend? The human's requirements defaults response does not supply these facts.
- **OQ-3 (architecture; medium):** What is the authoritative catalog and canonical ID format, and are IDs stable across requests?
- **OQ-4 (architecture; medium):** What supported browser/device/network and timing boundary define verification of the unchanged ≤1 s p95/1,000-property target?
- **OQ-5 (architecture/security; medium):** What actual provider authn/z, transport, safe query, secret, logging, and telemetry controls are inherited, and do they exclude criteria and property-level data as required?
- **Accessibility (from DRF-005):** What host control semantics and announcement/focus behavior will satisfy keyboard-only and WCAG 2.1 AA acceptance?

## 8. Final Review Decision
**REJECTED**

Rationale: The design has a reasonable logical decomposition and explicit correctness/security/error-handling principles, but an approved design must be actionable and its requirements coverage must be credible. NFR-001 and the core completeness-dependent filtering requirements remain blocked by an unknown provider capability (DRF-001); the application stack and integration boundary are also unknown (DRF-002). Performance, inherited security/privacy controls, and accessibility cannot yet be verified against a real host (DRF-003–005). Approval would treat unresolved assumptions as facts and could allow implementation planning against a design whose central requirement may not be satisfiable.

Conditions to resolve before re-review:
1. Resolve DRF-001 by verifying provider completeness and recording the selected, complete-result integration contract.
2. Resolve DRF-002 by identifying and binding the design to the actual host/provider.
3. Address DRF-003–005 with host-bound performance, security/privacy, and accessibility evidence/design details.
4. The Solution Architect updates `02-architecture.md` after any significant human decisions; the architecture is then re-reviewed. No change to `01-requirements.md` or `02-architecture.md` was made as part of this review.

## Assumptions
- **ASM-020:** The human's recorded “defaults / proceed with assumptions” response is treated as acceptance to carry the documented phase-1 and architecture assumptions as assumptions/risk treatment, not as factual resolution of architecture OQ-1–OQ-5. **Risk note:** Treating the response as broader acceptance could leave material unknowns unresolved; the rejected decision and open questions remain controlling.
- **ASM-021:** No provider, catalog, application stack, platform, or operational/security capability is inferred from that response. **Risk note:** These integration and control details remain unknown, limiting confidence in feasibility and inherited safeguards.
- **ASM-022:** No implementation, deployment, or testing facts are inferred from the proposed architecture. **Risk note:** Without verified host and test evidence, implementation fit and the stated performance, security, and accessibility properties cannot be confirmed.

## Revision History
| Date | Change | Reason |
|------|--------|--------|
| 2026-11-17 | Initial independent design review; recorded five findings and rejected pending resolution of completeness and host-bound design gaps. | Phase 3 review of US-001 |
