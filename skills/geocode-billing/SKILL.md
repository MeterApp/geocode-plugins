---
name: geocode-billing
description: Answer what Geocode AI costs and help a human buy, upgrade, switch or manage a plan - read the plans and per-call costs (get_pricing), check the account's plan, renewal date and use of every limit (get_account), get a Stripe Checkout link for the human to pay for Pro or Business (create_checkout_link, works even before the human has an account), and a billing-portal link for invoices, the card, switching and cancelling (get_billing_link). Use for "how much is it", "upgrade to Pro", "I hit the quota / 402", "buy a plan", "cancel", "invoice"; do not use for boundary lookups (geocode-boundaries), described areas (geocode-areas) or writing code against the API (geocode-api).
---

# Plans and billing

A human always pays; you hand them a link. No tool charges a card, cancels or
switches a plan: every link opens a Stripe page branded Geocode AI where the
person confirms. Quote prices from `get_pricing`, never from memory.

## Buying or upgrading a plan

Only when the human asked to buy or upgrade (a 402 alone is not consent):

1. `get_pricing`: every plan with its monthly price, limits (units, described
   areas, requests a minute, API keys), features and `checkout_url`. Say which
   fits their usage (`get_account` shows this month's units left and what the
   next plan adds, if signed in).
2. `create_checkout_link` with `{"plan": "pro"}` or `{"plan": "business"}`.
   - With a key or a signed-in connector: `kind: "checkout"`, a Stripe Checkout
     page for that account (expires in 24 hours).
   - Without a key: `kind: "guest_checkout"`, a Stripe Checkout page that asks
     for the person's email; paying creates their Geocode AI account on it, and
     they sign in with a code sent there. `sign_in_url` is the same purchase
     for someone who already has an account.
   - Already on a paid plan: `kind: "plan_change"`, a link that signs them in
     and opens a page confirming the switch with the prorated amount.
3. Give the human the `url` as is, with the plan name and monthly price. Do not
   open, shorten or pay it, and never ask for or pass on card details.
4. When they say it is done, `get_account`: `plan` is the new plan once
   Stripe confirmed the payment (usually seconds). New limits apply to every key
   at once, so retry what hit the quota.

From a terminal: `npx @meterapp/geocode upgrade --plan pro` opens the same
Checkout (prints JSON with the `url` when not in a terminal; works without a
key). `geocode pricing` and `geocode account` print the plans and the account.
Plans are monthly only: `yearly` answers `interval_unavailable`.

## Managing a plan

`get_billing_link` returns a link to the Stripe Customer Portal:
invoices and receipts, the card and billing details, switching plans, and
cancelling (the plan stays until the end of the period already paid for, then
the account is Free). The link does not expire; the person signs in to Geocode
AI first. `no_subscription` means the account never had a paid plan.

## Errors

- `402 quota_exceeded`: this month's units are used up. Stop, tell the human,
  and offer the upgrade above: the body has `upgrades` (bigger plans with
  prices), `checkout_url` (a link for the next plan) and `resets_at`.
- `429 rate_limited`: wait `retry_after` seconds. Without a key, a free key
  raises the limit (`sign_up_url`); with one, `upgrades` lists faster plans.
- `409 already_subscribed`: already on that plan; use the portal link to renew
  or switch.
- `409 manual_plan`: an Enterprise agreement; the human emails to change it.
- `503 billing_unavailable`: try again later, or send them to the pricing page.

Enterprise (custom volumes, SLAs, self-hosted data) is by email; `get_pricing`
has the address.
