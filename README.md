# Geocode AI plugin

**Website: [geocodeai.dev](https://geocodeai.dev/?ref=plugin)**

Administrative boundaries and areas for Claude Code, Codex, Cursor and any
agent that reads Agent Skills: look up a country, state, county, city, district
or postcode by name or point and get its polygon, list what is inside it, test
points against it, merge several, or describe an area in plain language and get
one validated polygon back.

## Install

**Claude Code**, in one step:

```
/plugin install geocode --marketplace MeterApp/geocode-plugins
```

or add the marketplace first, then install from it:

```
/plugin marketplace add MeterApp/geocode-plugins
/plugin install geocode@geocode
```

The first tool call opens your browser to sign in (free). On a machine without
a browser, paste a `geo_…` key into the plugin's `api_key` option instead.

**Codex**

```bash
codex plugin marketplace add MeterApp/geocode-plugins
codex plugin add geocode@geocode
```

**Cursor and others**: point the MCP config at
`https://geocodeai.dev/mcp?auth=required`, or run
`npx @meterapp/geocode install` to configure Claude Code, Codex and Cursor at once.

## What is inside

| Skill | For |
|---|---|
| `geocode-boundaries` | Find boundaries, get polygons, reverse lookups, children, contains, union |
| `geocode-areas` | A polygon from a plain-language description or a contract clause |
| `geocode-api` | Writing code against the REST API, the CLI or MCP |
| `geocode-billing` | Prices, your plan and usage, checkout and billing-portal links to upgrade or manage it |
| `geocode-feedback` | Report bugs with the failing request attached, request features, upvote, follow up, and read or post reviews |
| `geocode-teams` | Your organization, its members and teams, and the shared file library: save a boundary export and share it with a team |

Plus the hosted MCP server (`.mcp.json`), whose tools are the API's ops.

## What it sends and fetches

The plugin has no local code: its skills are instructions, and every tool call
goes to the hosted MCP server at `https://geocodeai.dev/mcp` over HTTPS. A call
sends the tool's arguments (place names, boundary ids, coordinates, an area
description) plus your sign-in token or `geo_…` key, and returns boundary
metadata, GeoJSON polygons, download links for exports, or account details.

- Boundary lookups are served from Geocode AI's cache of OpenStreetMap and
  Overture Maps data; the cache keeps no link to who asked. Points sent to
  `contains_points` are not stored.
- Area descriptions are sent to Anthropic's Claude API to plan the area and are
  not kept after the run.
- For each call the service records the operation, units used and timing
  against your account, for usage and billing.
- Account tools read or change only your own organization (API keys, files,
  feedback); billing tools return Stripe links that a person opens in a browser.
  No tool takes card details or charges a card.
- An API key, if you set one, is kept in your system's credential store and sent
  only to the Geocode MCP server in the `X-Api-Key` header.

Privacy policy: https://geocodeai.dev/privacy · Terms: https://geocodeai.dev/terms

Docs for agents: https://geocodeai.dev/llms.txt

This repository is generated from the Geocode AI source; pull requests here are
overwritten on the next release, so please open an issue instead.
