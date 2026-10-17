# Changelog

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
