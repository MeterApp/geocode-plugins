# Geocode AI plugin

Administrative boundaries and areas for Claude Code, Codex, Cursor and any
agent that reads Agent Skills: look up a country, state, county, city, district
or postcode by name or point and get its polygon, list what is inside it, test
points against it, merge several, or describe an area in plain language and get
one validated polygon back.

## Install

**Claude Code**

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
`https://geo-coder-service.vercel.app/mcp?auth=required`, or run
`npx @meterapp/geocode install` to configure Claude Code, Codex and Cursor at once.

## What is inside

| Skill | For |
|---|---|
| `geocode-boundaries` | Find boundaries, get polygons, reverse lookups, children, contains, union |
| `geocode-areas` | A polygon from a plain-language description or a contract clause |
| `geocode-api` | Writing code against the REST API, the CLI or MCP |

Plus the hosted MCP server (`.mcp.json`), whose tools are the API's ops.

Docs for agents: https://geo-coder-service.vercel.app/llms.txt

This repository is generated from the Geocode AI source; pull requests here are
overwritten on the next release, so please open an issue instead.
