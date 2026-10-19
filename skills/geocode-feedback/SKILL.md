---
name: geocode-feedback
description: Report a Geocode AI bug with the failing request attached, request a missing feature, upvote or comment on what others asked for, follow up on what the human filed, and post or read reviews - report_issue (with the request_id from the failed call), request_feature, upvote_feedback, comment_on_feedback, list_feedback, get_feedback, list_my_feedback, submit_review, list_reviews. Use after a Geocode AI call fails in a way that looks like our bug (5xx, a wrong or missing boundary), when the human wishes the API did something it cannot, asks what is planned, or wants to rate the product; do not use for ordinary lookups (geocode-boundaries), described areas (geocode-areas) or billing (geocode-billing).
---

# Feedback, issues and reviews

Everything here is free. Filing, voting and commenting need a key (or a
connected account) so each vote is one account; reading needs none. Ask the
human before you file anything on their behalf, and never invent a review.

## A call failed and it looks like our bug

Every response carries `X-Request-Id`; every error body and every MCP tool
error has a `request_id`, and tool errors say when a report is worth filing.

1. Tell the human what failed.
2. `report_issue` with:
   - `title`: what went wrong, in one line;
   - `details`: what you did, expected and got;
   - `request_id` and `op` of the failing call;
   - `context`: `boundary_id`, `query`, `error` (`{code, status, message}`),
     `client` and `version` when you have them. A request id must be one of the
     human's own calls (`not_your_request` otherwise).
3. If the result has `filed: false`, it found `similar` issues: if one is the
   same problem, `upvote_feedback` it and `comment_on_feedback` with the new
   request id; otherwise call again with `force: true`.

Issues are private to the reporter and the Geocode AI team. The human gets an
email with the reference number and another on every status change.

From a terminal: `npx @meterapp/geocode feedback report "<title>" --last`
attaches the last failed CLI call (request id, op, error).

## The human wants something the API cannot do

1. `list_feedback` with `kind: "feature"` and a few words in `q`.
2. A match: `upvote_feedback` (and `comment_on_feedback` with their use case).
3. No match: `request_feature` with `title` and `details` (what they are
   building). It also checks for similar requests and files nothing when it
   finds some; pass `force: true` when theirs is different.

Feature requests and comments are public (shown with a first name, never an
email): no keys, personal data or customer data in them.

## Following up

- `list_my_feedback`: what the human filed (with private issues), what they
  follow, and their review, each with its status.
- `get_feedback` with an id: comments (official team responses are marked),
  and the timeline of status changes (`open → planned → in_progress → done`,
  or `declined`, or `duplicate` with the item it was merged into).
- `remove_feedback_vote` takes a vote back and stops that item's emails.

## Reviews

- `list_reviews`: the average, the distribution and published reviews with
  the team's replies (`sort`: `new`, `helpful`, `highest`, `lowest`).
- `submit_review` only with the human's own rating (1-5) and words: `title`,
  `likes`, `dislikes`, `body`, `use_case`, `display_name`, and
  `marketing_consent: true` only if they agree to be quoted. One review per
  account; submitting again edits it (once an hour). A review with links, or
  from an account under a day old, waits for a check (`status: pending`).

## Errors

- `401 unauthorized`: filing needs a key or a connected account.
- `429 rate_limited`: 10 new items and 50 comments a day per account; one
  review edit an hour.
- `404 not_found`: no such item, or a private issue that is not the human's.
- `403 not_your_request`: the request id was made with another account.
