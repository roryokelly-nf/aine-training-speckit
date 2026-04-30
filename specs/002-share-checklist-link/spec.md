# Feature Specification: Share Checklist via Link

**Feature Branch**: `002-share-checklist-link`
**Created**: 2026-04-30
**Status**: Draft
**Input**: User description: "I want users to be able to share checklists with others via a link"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate a Shareable Link (Priority: P1)

A checklist owner generates a shareable link for one of their checklists and copies it to share with others.

**Why this priority**: Core functionality — without the ability to generate a link, the entire sharing feature has no value.

**Independent Test**: A user can open a checklist, generate a shareable link, copy it to their clipboard, and paste it into a new browser tab to view the checklist.

**Acceptance Scenarios**:

1. **Given** a user has an existing checklist, **When** they trigger the Share action on it, **Then** a shareable link is generated and displayed with a copy-to-clipboard button.
2. **Given** a shareable link has been generated and copied, **When** it is opened in a new browser session, **Then** the checklist is displayed with all its items and their current completion states.
3. **Given** a checklist containing no items, **When** the user generates a shareable link and opens it, **Then** the empty checklist is displayed without errors.

---

### User Story 2 - View a Shared Checklist (Priority: P2)

A recipient opens a shared checklist link and can read the checklist contents without needing an account.

**Why this priority**: Without a usable shared view, sharing has no value for recipients.

**Independent Test**: A recipient with no prior knowledge of the app can open a shared link and view the full checklist — name, items, and completion states — without creating an account or installing anything.

**Acceptance Scenarios**:

1. **Given** a valid shared link, **When** a recipient opens it, **Then** they see the checklist name, all items, and the completion state of each item.
2. **Given** a valid shared link, **When** it is opened on a different device or browser, **Then** the checklist is displayed correctly.
3. **Given** an invalid or malformed shared link, **When** a recipient opens it, **Then** they see a clear error message indicating the link is not valid.

---

### Edge Cases

- What happens when a shared link is opened after the original checklist has been deleted by the owner?
- What happens when the checklist has a very large number of items?
- What if the link URL is manually modified or partially corrupted?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to generate a shareable link for any of their existing checklists.
- **FR-002**: The shareable link MUST allow any recipient to access the checklist without requiring an account or login.
- **FR-003**: The shared view MUST display the checklist name, all items, and the completion state of each item.
- **FR-004**: The shareable link MUST be copyable via a single action (e.g., a copy-to-clipboard button).
- **FR-005**: Opening an invalid or malformed shared link MUST display a clear, user-friendly error message.
- **FR-006**: Recipients MUST be able to check and uncheck items on a shared checklist; their changes are local to their own session and do not affect the owner's checklist.

### Key Entities

- **Shared Link**: A URL that provides access to a specific checklist for any recipient, without requiring authentication.
- **Shared View**: The interface displayed to a recipient when they open a shared link — showing checklist contents and state.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A checklist owner can generate and copy a shareable link in under 10 seconds.
- **SC-002**: A recipient can open a shared link and view the full checklist within 3 seconds of clicking it.
- **SC-003**: 100% of valid shared links display the correct checklist name, items, and completion states.
- **SC-004**: Recipients can access shared checklists without creating an account or providing any personal information.

## Assumptions

- Shared links encode sufficient information to reconstruct the checklist for the recipient independently of the owner's local session.
- Links do not expire and are not revocable in v1.
- The shared view is accessible on any modern browser without installation.
- No real-time synchronisation between the owner's edits and the shared link view is in scope for v1.
- Sharing is a point-in-time snapshot: the shared link reflects the checklist state at the time the link was generated or opened, not a continuously live-updating view.
- Each checklist has at most one active shared link at a time (no multiple link management).
