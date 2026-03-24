# ADR 003: HU19 Inbox direct actions UX

- Status: accepted
- Date: 2026-03-10
- Commit hash: pending

## Context

HU19 promotes the Inbox row-level and bulk controls from placeholder UI into a real cross-repo feature.

Backend ADR 007 already defines the product boundary:

- `POST /api/v1/notifications/confirm` remains suggestion-oriented (`accept`, `reject`)
- Inbox actions must use a dedicated contract
- The target backend direction is `POST /api/v1/inbox/actions`

The frontend still needs an explicit UX contract before implementation. Without that contract, the UI risks mixing read-only Inbox browsing with suggestion-confirm actions or hiding destructive behavior behind ambiguous controls.

## Decision

Frontend Inbox actions will follow these UX rules:

1. **Supported actions**
   - Per-row actions: `archive`, `delete`, `mark_unread`
   - Bulk actions: `archive`, `delete`, `mark_unread`

2. **Confirmation model**
   - `delete` always requires explicit confirmation
   - `archive` requires explicit confirmation for row-level and bulk actions
   - `mark_unread` does not require a blocking confirmation modal; it uses direct execution with disabled-in-flight controls and toast feedback

3. **Confirmation copy**
   - Row-level confirmation must identify the email subject or sender when available
   - Bulk confirmation must show the selected count
   - Copy must state the action and scope clearly, for example:
     - `Archive this email?`
     - `Delete 5 selected emails?`

4. **Feedback model**
   - Use toast feedback for success and error states
   - Keep feedback aligned with existing suggestion-confirm patterns
   - Disable the relevant controls while the request is in flight

5. **Selection behavior**
   - Bulk action controls stay disabled until at least one email is selected
   - Successful actions clear the current selection

6. **State refresh**
   - After a successful Inbox action, the Inbox list should refresh or reconcile local state so the UI reflects the action outcome

7. **Product boundary**
   - Inbox remains a user-initiated operational surface, separate from suggestion-confirm flows
   - Suggestions and Inbox must not share labels or semantics in a way that blurs `confirm recommendation` with `execute direct email action`

## Consequences

Positive:

- The frontend now has a concrete UX contract for HU19 before implementation begins
- Destructive actions gain explicit confirmation and consistent feedback
- The product boundary between Suggestions and Inbox stays clear

Negative / Risks:

- Requiring confirmation for `archive` adds friction, but it avoids silent destructive behavior during the first implementation pass
- Refreshing the Inbox list after direct actions may require additional loading states and test coverage
- Bulk selection and per-row actions now need dedicated component state management

Mitigations:

- Reuse existing dialog and toast patterns already present in the frontend
- Keep `mark_unread` lightweight to avoid over-confirming non-destructive actions
- Implement and test row-level flow before broadening the bulk-action surface
