---
story: US-001
phase: 1-requirements
status: approved
date: 2026-11-17
author: requirements-analyst
---
# Requirements Specification — US-001

> DRAFT — awaiting approval. Clarification complete: the human answered all 17 Open Questions with "defaults / proceed with assumptions". Each default is logged as ASM-003 to ASM-019 ("default accepted by human") and each OQ is marked resolved. Values marked "(default)" were not in the story and must be confirmed or changed at approval.

## 1. Project Overview
Per the source, this story adds "Advanced filters" to an existing property search/browse experience. Users can refine results by (a) Amenities and (b) Property Type. Source: Jira EPMCDMETST-72234 (https://jiraeu.epam.com/browse/EPMCDMETST-72234).
System boundary: the property search results list and its filter controls. Property metadata creation/editing is outside the boundary.

## 2. Business Objective
Let a search user quickly find accommodations that match their preferences by narrowing property search results by amenities and property type. No business metric or target is stated (ASM-016).

## 3. User Story
**Source:** Jira EPMCDMETST-72234, saved at `docs/sdlc/stories/US-001/user-story.md`
> As a search user, I want to filter property search results by amenities and property type so that I can quickly find accommodations that match my preferences.

Acceptance criteria and Gherkin scenarios from the source are reproduced verbatim in `user-story.md` and are mapped in section 8.

## 4. Actors and Stakeholders
| Name | Type | Interest / interaction |
|------|------|------------------------|
| Search user | actor | Applies and clears advanced filters on the property search results |
| Property catalog / search data source | external system | Supplies the amenity and property type attributes of each property |
| Product owner / business | stakeholder | Not named in the source (ASM-016) |

## 5. Functional Requirements
| ID | Requirement ("The system shall …") | Source | Priority |
|----|-----------------------------------|--------|----------|
| REQ-001 | The system shall provide an "Advanced filters" capability on the property search results list. | US-001 | must |
| REQ-002 | The system shall let the user select one or more amenities as a filter, including "Free Wi-Fi" and "Breakfast included". | US-001 (AC1) | must |
| REQ-003 | When one or more amenities are selected, the system shall show only properties that have all of the selected amenities. | US-001 (AC1) | must |
| REQ-004 | The system shall let the user select a property type as a filter, including "Hotel" and "Villa". | US-001 (AC2) | must |
| REQ-005 | When a property type is selected, the system shall show only properties whose type matches the selection. | US-001 (AC2) | must |
| REQ-006 | When both amenity and property type filters are applied, the system shall show only properties that satisfy both the amenity criteria and the property type criteria. | US-001 (AC3) | must |
| REQ-007 | When no property matches the applied filters, the system shall display an explicit message that no results match the selected filters. | US-001 (AC4) | must |
| REQ-008 | When no property matches the applied filters, the system shall offer a clear-filters action. | US-001 (AC4) | must |
| REQ-009 | When the user clears all advanced filters, the system shall restore the unfiltered result set for the current search context. | US-001 (AC5) | must |
| REQ-010 | Applying or clearing advanced filters shall not change the underlying search inputs (e.g., destination, dates). | US-001 (AC5) | must |
| REQ-011 | The system shall retain the user's advanced filter selections while the user remains on the current search results page, until the user clears them (in-page state only; ASM-006). | US-001 (constraints) | should |
| REQ-012 | The system shall apply a filter selection or removal to the results immediately, without a separate "Apply" action (ASM-009). | ASM-009 | must |
| REQ-013 | When the user changes search inputs (destination, dates, etc.), the system shall keep the current filter selections and apply them to the new results (ASM-007). | ASM-007 | should |
| REQ-014 | The system shall allow selecting more than one property type; a property matches if its type equals any selected type (ASM-004). | ASM-004 | must |
| REQ-015 | The system shall match amenity and property type values by exact match against the catalog's values, with no synonym or fuzzy matching (ASM-005). | ASM-005 | must |
| REQ-016 | The system shall exclude from results any property with a missing or unrecognized property type when a property type filter is applied, and any property with missing amenity data when an amenity filter is applied (ASM-010). | ASM-010 | must |

## 6. Non-Functional Requirements
| ID | Category | Requirement (quantified) | Source |
|----|----------|--------------------------|--------|
| NFR-001 | Correctness / consistency | 100% of properties displayed after filtering shall satisfy all of the selected filter criteria, and 0 matching properties from the current search context shall be omitted. | US-001 ("filtering updates results consistently with the selected criteria") |
| NFR-002 | Persistence | Filter selections shall persist in-page only: retained until cleared or until the user leaves/refreshes the results page (0 selections stored beyond the page lifetime). Default, ASM-006. | US-001 / ASM-006 |
| NFR-003 | Performance | (default, ASM-011) For result sets of up to 1,000 properties, the updated results shall display within 1 second at the 95th percentile after a filter change. | ASM-011 |
| NFR-004 | Accessibility / usability | (default, ASM-012) Filter controls shall meet WCAG 2.1 Level AA and be operable by keyboard alone (100% of filter actions). Supported platform is the existing search page's platform; no new localization or device/browser requirement. | ASM-012 |
| NFR-005 | Security / privacy | (default, ASM-013) Filter selections shall not be persisted server-side or in the browser beyond the page lifetime, and no new analytics tracking or personal data collection shall be introduced (0 new data items). | ASM-013 |
| NFR-006 | Reliability | (default, ASM-014) If the data source fails during filtering, the system shall show an error message and keep the filter selections; results shown shall never be partially filtered (0 incorrect result sets displayed). No availability target beyond the existing search page. | ASM-014 |

NFR-003 to NFR-006 values are defaults accepted by the human, not derived from the story. They are flagged as assumptions and may be revised at approval.

## 7. Business Rules
| ID | Rule | Source | Enforced by |
|----|------|--------|-------------|
| BR-001 | A property matches an amenity filter only if it has every selected amenity (AND semantics). | US-001 (AC1) | REQ-003 |
| BR-002 | Amenity and property type criteria combine as an intersection (a property must satisfy both). | US-001 (AC3) | REQ-006 |
| BR-003 | Filtering operates within the current search context and never alters it. | US-001 (AC5) | REQ-009, REQ-010 |

## 8. Acceptance Criteria
### REQ-001
- **AC-001-1** (positive) — Given a user viewing a property search results list, When the page loads, Then the Advanced filters offering Amenities and Property Type is available.
- **AC-001-2** (negative) — Given no active search context or an already-empty unfiltered result set, When the user views the page, Then no filters are applied to any results and the existing empty/no-results behavior is shown unchanged (ASM-015).

### REQ-002
- **AC-002-1** (positive) — Given a results list with at least one property offering "Free Wi-Fi", When the user selects the "Free Wi-Fi" amenity, Then the selection is registered as an applied filter.
- **AC-002-2** (positive) — Given a results list, When the user selects "Breakfast included", Then the selection is registered as an applied filter.
- **AC-002-3** (boundary) — Given a results list, When the user selects two amenities, Then both are registered as applied filters.

### REQ-003
- **AC-003-1** (positive) — Given a results list with at least one property offering "Free Wi-Fi", When the user applies the "Free Wi-Fi" filter, Then only properties including "Free Wi-Fi" are shown.
- **AC-003-2** (positive) — Given properties A (Wi-Fi + Breakfast), B (Wi-Fi only) and C (Breakfast only), When the user selects both "Free Wi-Fi" and "Breakfast included", Then only A is shown.
- **AC-003-3** (negative) — Given a property with no amenities, When any amenity filter is applied, Then that property is not shown.

### REQ-004
- **AC-004-1** (positive) — Given a results list, When the user selects "Hotel", Then the selection is registered as an applied filter.
- **AC-004-2** (positive) — Given a results list, When the user selects "Villa", Then the selection is registered as an applied filter.
- **AC-004-3** (boundary) — Given a results list, When the user selects more than one property type, Then all selected types are registered as applied filters (ASM-004).

### REQ-012 to REQ-016
- **AC-012-1** (positive) — Given a results list, When the user selects or deselects any amenity or type option, Then results update without any further "Apply" action.
- **AC-013-1** (positive) — Given filters are applied, When the user changes the destination or dates and searches, Then the filter selections remain selected and are applied to the new results.
- **AC-014-1** (positive) — Given Hotel, Villa and Apartment properties, When the user selects "Hotel" and "Villa", Then Hotel and Villa properties are shown and Apartments are not.
- **AC-015-1** (negative) — Given a property with amenity "WiFi" and the filter "Free Wi-Fi", When the filter is applied, Then that property is not matched (exact match only).
- **AC-016-1** (negative) — Given a property with a missing type, When any property type filter is applied, Then that property is not shown.
- **AC-016-2** (negative) — Given a property with missing amenity data, When any amenity filter is applied, Then that property is not shown.

### REQ-005
- **AC-005-1** (positive) — Given a results list with at least one "Villa" and one "Hotel", When the user applies the type filter "Villa", Then only properties of type "Villa" are shown.
- **AC-005-2** (negative) — Given the "Villa" filter is applied, When results are displayed, Then no "Hotel" property is shown.

### REQ-006
- **AC-006-1** (positive) — Given a results list with multiple types and amenities, When the user applies the amenity "Breakfast included" and the type "Hotel", Then only properties that are "Hotel" and include "Breakfast included" are shown.
- **AC-006-2** (negative) — Given a "Villa" with "Breakfast included" and a "Hotel" without it, When the user applies "Breakfast included" and "Hotel", Then neither is shown.

### REQ-007
- **AC-007-1** (positive) — Given a results list, When the user applies filters that match no property, Then an explicit "no matching results" message is displayed.
- **AC-007-2** (negative) — Given filters that match at least one property, When results are displayed, Then the empty-state message is not shown.
- **AC-007-3** (boundary) — Given filters that match exactly one property, When results are displayed, Then that one property is shown and no empty state appears.

### REQ-008
- **AC-008-1** (positive) — Given the empty state is displayed, When the user views it, Then a clear-filters action is available.
- **AC-008-2** (positive) — Given the empty state is displayed, When the user activates clear-filters, Then all advanced filters are removed and results are restored (see REQ-009).

### REQ-009
- **AC-009-1** (positive) — Given one or more advanced filters are applied, When the user clears all of them, Then the results equal the unfiltered results for the current search context.
- **AC-009-2** (boundary) — Given exactly one filter is applied, When the user clears it, Then the full unfiltered result set is restored.
- **AC-009-3** (negative) — Given no filters are applied, When the user activates clear-all (if available), Then the results are unchanged.

### REQ-010
- **AC-010-1** (positive) — Given a search with destination D and dates T, When the user applies then clears advanced filters, Then D and T are unchanged.

### REQ-011
- **AC-011-1** (positive) — Given filters are applied, When the user continues within the same search session/page, Then the selections remain applied (in-page only; ASM-006).
- **AC-011-3** (boundary) — Given filters are applied, When the user refreshes the page or navigates away and back, Then the filters are not restored (ASM-006).
- **AC-011-2** (negative) — Given filters were cleared, When the user continues in the same session, Then they are not reapplied.

### NFR
- **AC-N001-1** — Given any combination of filters, When results are displayed, Then every shown property satisfies all selected criteria and none matching in the search context is missing.
- **AC-N002-1** — Given filters are applied, When the page is refreshed, Then no filter selection is restored and no selection is stored beyond the page lifetime.
- **AC-N003-1** — Given a result set of 1,000 properties, When a filter is changed, Then updated results are displayed within 1 second for at least 95% of measured interactions.
- **AC-N004-1** — Given the filter controls, When operated using only the keyboard, Then every filter action can be completed and the controls meet WCAG 2.1 AA.
- **AC-N005-1** — Given any filter use, When the user finishes, Then no filter selection is stored outside the page and no new analytics or personal data is collected.
- **AC-N006-1** — Given the data source fails during filtering, When the user changes a filter, Then an error message is shown, the selections are kept, and no partially filtered results are displayed.

## 9. Edge Cases
| # | Scenario | Expected behavior | Related REQ/AC |
|---|----------|-------------------|----------------|
| 1 | Property has zero amenities | Excluded when any amenity filter is applied | REQ-003 / AC-003-3 |
| 2 | Property type missing on a record | Excluded when a type filter is applied (ASM-010) | REQ-016 / AC-016-1 |
| 3 | Multiple property types selected | OR across types (ASM-004) | REQ-014 / AC-004-3, AC-014-1 |
| 4 | Filters leave zero results | Empty state with clear action | REQ-007, REQ-008 |
| 5 | Filter applied then search inputs changed | Filters kept and applied to new results (ASM-007) | REQ-013 / AC-013-1 |
| 6 | Amenity or type value has no matching properties in the results | Option stays visible and selectable, no counts shown; selecting it yields the empty state (ASM-008) | REQ-002, REQ-004, REQ-007 |
| 7 | Page refresh or navigation away and back | Filters not restored (ASM-006) | REQ-011 / AC-011-3 |
| 8 | Very large result set | Up to 1,000 properties within 1 s p95 (ASM-011) | NFR-003 / AC-N003-1 |

## 10. Dependencies
| Dependency | Type | Status |
|------------|------|--------|
| Existing property search/results page | system | Stated as existing; not verified |
| Property data including amenities and property type | data | Stated as precondition; not verified |
| Complete list of amenities and property types | data | Defaults to the values in the existing property catalog (ASM-003); list itself not yet confirmed |
| Active search context returning results | system | Stated as precondition |

## 11. Assumptions
Assumptions from the story text, not yet confirmed by the human, followed by defaults accepted by the human (ASM-003 to ASM-019, decision: "defaults / proceed with assumptions", given by the human user on 2026-11-17):
- **ASM-001** — Each property can have zero or more amenities and exactly one property type "or a clearly defined set" (source wording). Proposed by the story author. Risk: if the property type is multi-valued, REQ-005 and edge cases change (OQ-2, OQ-8).
- **ASM-002** — A property catalog exists and a results list is already available. Source: story. Risk: if not, the scope grows beyond filtering.
- **ASM-003** — (OQ-1) default accepted by human: selectable amenities and property types are the values present in the existing property catalog; "Free Wi-Fi", "Breakfast included", "Hotel", "Villa" are the minimum required options. Risk: list may be incomplete.
- **ASM-004** — (OQ-2) default accepted by human: multiple property types may be selected, combined with OR. Risk: story scenarios show single selection only.
- **ASM-005** — (OQ-3) default accepted by human: amenities combine with AND (per AC1); exact, case-sensitive match on catalog values; no synonyms.
- **ASM-006** — (OQ-4, OQ-17) default accepted by human: in-page persistence only; no persistence across refresh, navigation, tabs or sessions; not stored per user; filters are not in the URL and not shareable/bookmarkable.
- **ASM-007** — (OQ-5) default accepted by human, "reset-neutral" interpreted as: changing search inputs neither clears nor alters the filter selections; they are applied to the new results. Risk: "reset-neutral" interpretation to be confirmed.
- **ASM-008** — (OQ-6) default accepted by human: all options stay visible and enabled; no result counts shown.
- **ASM-009** — (OQ-7) default accepted by human: filters apply instantly on selection; no "Apply" button.
- **ASM-010** — (OQ-8) default accepted by human: properties with missing or invalid type or amenity data do not match an applicable filter and are excluded while that filter is applied; they appear when it is not applied.
- **ASM-011** — (OQ-9) default accepted by human: 1 s at p95 for up to 1,000 properties. Values chosen as a reasonable default, not from the story.
- **ASM-012** — (OQ-10) default accepted by human: WCAG 2.1 AA and keyboard operability; no new localization or device/browser requirements beyond the existing page.
- **ASM-013** — (OQ-11) default accepted by human: no server-side or browser storage of selections, no new analytics or personal data.
- **ASM-014** — (OQ-12) default accepted by human: error message with selections retained on data source failure; no new availability target.
- **ASM-015** — (OQ-13) default accepted by human: with no search context or an already-empty result set, filters have nothing to act on and existing behavior is unchanged.
- **ASM-016** — (OQ-14) default accepted by human: product owner and success metric not defined; the objective stays qualitative. Approver is the human who approves this phase.
- **ASM-017** — (OQ-15) default accepted by human: platform is whatever the existing search page already supports; technology choice deferred to phase 2.
- **ASM-018** — (OQ-16) default accepted by human: no additional Jira comments, attachments, links or designs exist beyond `user-story.md`. Not verified by the analyst.
- **ASM-019** — (OQ-17) default accepted by human: filter state is not reflected in the URL (see ASM-006).

## 12. Open Questions
| # | Question | Why it matters | Status | Answer + by whom |
|---|----------|----------------|--------|------------------|
| OQ-1 | What is the full list of selectable amenities and property types, and where do their values come from? "e.g." is used in the story. | Defines filter options and test data. | resolved | "defaults / proceed with assumptions" — human user. ASM-003 |
| OQ-2 | Can the user select more than one property type? If so, is it OR (any of the types) or something else? AC2 says "type(s)", whereas the scenarios show one. | Changes REQ-004/005 and AC-004-3. | resolved | Default accepted by human user. ASM-004 |
| OQ-3 | Amenity matching: AC1 says "all selected amenities" (AND). Is this confirmed for all amenities, or should some behave as OR? Is matching case-sensitive or synonym-aware (e.g., "WiFi" vs "Free Wi-Fi")? | BR-001 affects results and tests. | resolved | Default accepted by human user. ASM-005 |
| OQ-4 | Persistence scope: does "current search session/page" mean in-page state only, or survive refresh, navigation, new tabs, or login sessions? Is it stored per user or per browser? | Defines REQ-011 and NFR-002. | resolved | Default accepted by human user. ASM-006 |
| OQ-5 | If the user changes destination, dates or other search inputs, should the filters be kept or reset? | Edge case 5. | resolved | Default accepted by human user. ASM-007 |
| OQ-6 | Should filter options show result counts, or be hidden or disabled when no property matches? | Usability, edge case 6. | resolved | Default accepted by human user. ASM-008 |
| OQ-7 | Should filters apply instantly on selection or via an explicit "Apply" action? The story uses "applies" for both. | Changes triggers in the ACs. | resolved | Default accepted by human user. ASM-009 |
| OQ-8 | How should properties with missing or invalid type or amenity data be handled? | Data quality and edge case 2. | resolved | Default accepted by human user. ASM-010 |
| OQ-9 | Performance target for filter response (e.g., percentile and time) and the expected maximum result-set size? | NFR-003 cannot be quantified. | resolved | Default accepted by human user. ASM-011 |
| OQ-10 | Are accessibility (e.g., WCAG level), localization or device or browser support requirements applicable? | NFR-004. | resolved | Default accepted by human user. ASM-012 |
| OQ-11 | Are there security or privacy concerns (e.g., storing filter selections, analytics tracking)? | NFR-005. | resolved | Default accepted by human user. ASM-013 |
| OQ-12 | Are there reliability or availability expectations, or behavior if the data source fails during filtering? | NFR-006. | resolved | Default accepted by human user. ASM-014 |
| OQ-13 | Expected behavior when there is no active search context or the unfiltered result set is already empty? | Preconditions vs AC-001-2. | resolved | Default accepted by human user. ASM-015 |
| OQ-14 | Who is the product owner/approver, and is there a business success metric (e.g., filter usage or conversion)? | Stakeholders and objective. | resolved | Default accepted by human user. ASM-016 |
| OQ-15 | Platform scope (web, mobile, both) and the technology constraints, if any. The stack is not stated in the story and is not decided here. | Needed for later phases; to be decided in phase 2. | resolved | Default accepted by human user. ASM-017 |
| OQ-16 | Does the Jira issue have comments, attachments, linked issues or designs not captured in `user-story.md`? | Possible missing requirements. | resolved | Default accepted by human user. ASM-018 |
| OQ-17 | Should filters be applied to the URL or be shareable/bookmarkable? | Related to persistence (OQ-4). | resolved | Default accepted by human user. ASM-019 |

## 13. Out-of-Scope Items
- Creating or editing property metadata (amenities, property type)
- New sorting options
- Pricing, date, or guest-count filters
- Personalization and recommendations
- Changing the underlying search (destination, dates) behavior
- Any filter categories other than Amenities and Property Type
- Technology and design choices (decided in later phases)

## 14. Requirement Traceability Matrix
| REQ/NFR/BR | Source (US) | AC | ADR | TASK | Code | TEST | Status |
|------------|-------------|----|-----|------|------|------|--------|
| REQ-001 | US-001 | AC-001-1, AC-001-2 | | | | | pending |
| REQ-002 | US-001 | AC-002-1, AC-002-2, AC-002-3 | | | | | pending |
| REQ-003 | US-001 | AC-003-1, AC-003-2, AC-003-3 | | | | | pending |
| REQ-004 | US-001 | AC-004-1, AC-004-2, AC-004-3 | | | | | pending |
| REQ-005 | US-001 | AC-005-1, AC-005-2 | | | | | pending |
| REQ-006 | US-001 | AC-006-1, AC-006-2 | | | | | pending |
| REQ-007 | US-001 | AC-007-1, AC-007-2, AC-007-3 | | | | | pending |
| REQ-008 | US-001 | AC-008-1, AC-008-2 | | | | | pending |
| REQ-009 | US-001 | AC-009-1, AC-009-2, AC-009-3 | | | | | pending |
| REQ-010 | US-001 | AC-010-1 | | | | | pending |
| REQ-011 | US-001 | AC-011-1, AC-011-2, AC-011-3 | | | | | pending |
| REQ-012 | ASM-009 | AC-012-1 | | | | | pending |
| REQ-013 | ASM-007 | AC-013-1 | | | | | pending |
| REQ-014 | ASM-004 | AC-014-1, AC-004-3 | | | | | pending |
| REQ-015 | ASM-005 | AC-015-1 | | | | | pending |
| REQ-016 | ASM-010 | AC-016-1, AC-016-2 | | | | | pending |
| NFR-001 | US-001 | AC-N001-1 | | | | | pending |
| NFR-002 | US-001, ASM-006 | AC-N002-1 | | | | | pending |
| NFR-003 | ASM-011 | AC-N003-1 | | | | | pending |
| NFR-004 | ASM-012 | AC-N004-1 | | | | | pending |
| NFR-005 | ASM-013 | AC-N005-1 | | | | | pending |
| NFR-006 | ASM-014 | AC-N006-1 | | | | | pending |
| BR-001 | US-001 | AC-003-2 | | | | | pending |
| BR-002 | US-001 | AC-006-1, AC-006-2 | | | | | pending |
| BR-003 | US-001 | AC-009-1, AC-010-1 | | | | | pending |

## Revision History
| Date | Change | Reason |
|------|--------|--------|
| 2026-11-17 | Initial draft | Phase 1 analysis of US-001 |
| 2026-11-17 | Resolved OQ-1..17 with defaults accepted by human ("defaults / proceed with assumptions"); added ASM-003..019, REQ-012..016, NFR-002..006 measures and ACs | Clarification loop complete |
