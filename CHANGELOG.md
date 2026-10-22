# Changelog

## 0.5.1

- Listing icon (`.claude-plugin/icon.png`, 1024×1024, rendered from
  `assets/logo.svg`) and a terms of service link in the Claude Code manifest.
- README: one-step install
  (`/plugin install geocode --marketplace MeterApp/geocode-plugins`) and what
  the plugin sends and fetches.

## 0.5.0

- `geocode-teams` skill: accounts are organizations with roles (viewer, member,
  admin, owner) and teams. `get_account` names the organization and your role;
  `list_orgs`, `list_members` and `list_teams` read who is in it; `save_file`,
  `list_files`, `get_file` and `share_file` keep boundary exports in the
  organization's shared library and share them with a team or a person.
  Inviting and roles stay on the dashboard.

## 0.4.0

- `geocode-feedback` skill: report a bug with the failing call's `request_id`
  attached (`report_issue`, private to you and the team), request features,
  upvote and comment, follow up with `list_my_feedback`, and read or post
  reviews (`list_reviews`, `submit_review`). Filing returns `similar` items
  first so agents upvote instead of duplicating.

## 0.3.1

- `geocode-billing`: yearly plans (`yearly: true`, `--yearly`): ten months' price,
  two months free.

## 0.3.0

- `geocode-billing`: `get_pricing` now returns the shared pricing document
  (limits, features and a checkout link per plan), `get_account` the use of
  every limit and what the next plan adds, `create_checkout_link` works before
  signup (Stripe Checkout collects the email), and the portal tool is
  `get_billing_link` (the old name still works). 402/429 errors carry
  `upgrades` and `checkout_url`.

## 0.2.0

- `geocode-billing` skill: plans and prices, the account's subscription, and
  Stripe Checkout and billing-portal links a human opens to buy, switch or
  manage a plan (MCP tools `get_subscription`, `create_checkout_link`,
  `create_billing_portal_link`).

## 0.1.0

- First release: hosted MCP server (OAuth sign-in or API key) and three skills,
  `geocode-boundaries`, `geocode-areas` and `geocode-api`, for Claude Code,
  Codex, Cursor and Open Plugins hosts.
