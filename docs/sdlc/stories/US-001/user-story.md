# US-001: Advanced filters for amenities and property type

[EPMCDMETST-72234] Add advanced filters for amenities and property type in property search
Source: https://jiraeu.epam.com/browse/EPMCDMETST-72234

Summary
As a search user, I want to filter property search results by amenities and property type so that I can quickly find accommodations that match my preferences.

General description
This story adds "Advanced filters" to an existing property search/browse experience, enabling users to refine results by (a) Amenities (e.g., free Wi-Fi, breakfast included) and (b) Property Type (e.g., hotel, villa).
Assumptions: a property catalog exists and each property can be tagged with zero or more amenities and exactly one property type (or a clearly defined set).
Out of scope: creating/editing property metadata, new sorting options, pricing/date/guest filters, and personalization/recommendations.
Notable constraints/NFRs: filtering updates results consistently with the selected criteria; filter selections persist during the current search session/page until cleared.

Preconditions
 - A property search results page/list is available to the user.
 - Properties in the search index/data source include:
   - Amenities attributes (e.g., "Free Wi-Fi", "Breakfast included")
   - Property type attribute (e.g., "Hotel", "Villa")
 - The user has an active search context (e.g., destination and dates already entered) that returns results before applying advanced filters.

Scenarios of use (in Gherkin format)
Feature: Advanced filters for property search

Scenario: Filter results by a single amenity
Given the user is viewing a property search results list with at least one property offering "Free Wi-Fi"
When the user applies the "Free Wi-Fi" amenity filter
Then only properties that include the "Free Wi-Fi" amenity are shown in the results

Scenario: Filter results by property type
Given the user is viewing a property search results list with at least one "Villa" and one "Hotel"
When the user applies the property type filter "Villa"
Then only properties with property type "Villa" are shown in the results

Scenario: Combine amenity and property type filters
Given the user is viewing a property search results list with properties of multiple types and amenities
When the user applies the amenity filter "Breakfast included"
And the user applies the property type filter "Hotel"
Then only properties that are "Hotel" and include "Breakfast included" are shown in the results

Scenario: No results match the selected advanced filters
Given the user is viewing a property search results list
When the user applies filters that match no properties
Then the user is shown an empty state message indicating no results match the selected filters
And the user can clear the applied filters

Scenario: Clear advanced filters restores the prior result set
Given the user has applied one or more advanced filters
When the user clears all advanced filters
Then the results revert to the unfiltered results for the current search context

Acceptance criteria
 - AC1: The user can apply at least one amenity filter (including "Free Wi-Fi" and "Breakfast included") and the results include only properties that have all selected amenities.
 - AC2: The user can apply a property type filter (including "Hotel" and "Villa") and the results include only properties matching the selected property type(s).
 - AC3: When both amenity and property type filters are applied, results reflect the intersection of the selected criteria (i.e., must satisfy both).
 - AC4: If no properties match the selected filters, an explicit "no matching results" empty state is displayed and a clear-filters action is available.
 - AC5: Clearing all advanced filters restores the result set for the current search context (without changing the underlying search inputs).
