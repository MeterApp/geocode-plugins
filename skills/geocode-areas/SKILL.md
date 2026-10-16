---
name: geocode-areas
description: Turn a plain-language description of an area into one validated polygon with Geocode AI's create_area - "Alameda and Contra Costa counties excluding Oakland", "the Bay Area minus San Francisco, plus SFO", a delivery or service area, or wording pasted from a contract, policy, license or regulation. An AI agent composes includes and excludes from real administrative boundaries and returns GeoJSON plus where each part came from, or explains what it could not map. Use when the area is not a single named place; for one named place use geocode-boundaries (instant and far cheaper).
---

# Geocode AI: natural-language areas

`create_area` (MCP tool, `POST /v1/areas`, or `geocode area "<text>"`) runs an
AI agent that plans the area from real boundaries, builds it, and validates the
result (land only, the parts it names, nothing it excludes).

## When to use it

- The area combines or subtracts places: "A and B counties except the city of C".
- The text comes from a document: a contract's territory clause, a regulator's
  service area, a franchise or license region. Pass the wording verbatim.
- One named place is **not** a reason: `search_boundaries` + `get_boundary` is
  instant and costs one unit.

## How to call it

- `text`: the description, verbatim (up to a few thousand characters).
- `country`: ISO alpha-2 code when known (`"US"`). It removes ambiguity.
- `source`: who wrote the text (agency, company), when it helps.
- `seed`: `{ "lat": …, "lon": … }`, a point that must be inside the area, when
  the human gave one.

It takes 30 seconds to a few minutes. Tell the human it is running; do not
retry while it runs. It costs much more than a lookup: call `get_pricing` and
confirm with the human before running several.

## Results

- Success: a GeoJSON polygon plus the parts used (each boundary included or
  excluded and why). Summarize the parts so the human can check the
  interpretation, and save the GeoJSON to a file rather than pasting it.
- `could_not_map` (422): the detail says which phrase could not be resolved or
  was ambiguous. Ask the human to clarify that phrase, then run it again. Never
  return a partial or guessed shape as if it were the answer.
- `quota_exceeded` (402): stop and tell the human.
