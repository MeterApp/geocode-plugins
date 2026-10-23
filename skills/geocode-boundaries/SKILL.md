---
name: geocode-boundaries
description: Look up administrative boundaries anywhere in the world with Geocode AI and work with their polygons - find a country, state, county, city, district or postcode by name, get its polygon as GeoJSON, find every boundary containing a coordinate (reverse), list what is inside a boundary (children), check which zone each of many points falls in (contains), and merge several boundaries into one shape (union). Use for "get the boundary/polygon/shape of X", "which county is this point in", "list the counties of Y", "is this address inside Z", service areas built from named places, and map data for a page or a notebook; do not use for a described area that is not one named place (geocode-areas) or for writing code against the API (geocode-api).
---

# Geocode AI: boundaries

Tools come from the `geocode` MCP server (or the `geocode` CLI). Boundaries are
OpenStreetMap administrative areas, cached by Geocode AI, so repeat lookups are
instant.

## Workflow

1. **Named place → search, then get.** Call `search_boundaries` with the name.
   Add the country or a parent to the query when the name is ambiguous
   ("Alameda County, California", "Paris, France"). Pick the result whose admin
   level and parents match what the human meant, then call `get_boundary` with
   its `id` for the polygon. Never guess or construct an id.
2. **A coordinate → reverse.** `reverse_boundaries` with `lat` and `lon`
   returns every boundary containing the point, from country down to
   neighbourhood. Use it for "which city/county/state is this in".
3. **Inside a boundary → children.** `list_children` with the parent's id
   (states of a country, counties of a state, districts of a city).
4. **Many points → contains.** `contains_points` takes a batch of points in one
   call. Never loop one call per point.
5. **Several boundaries as one shape → union.** `union_boundaries` with the ids
   you got from search or children.
6. **Files.** `export_boundary` (or `get_boundary` with a `format`) returns other
   formats when the human wants a file.

## Ids

Ids are `r<OSM relation id>` (`r396499`) or `w<way id>`. `R62422`,
`relation/62422`, `-62422` and osm.org URLs are accepted; the canonical form
comes back. Reuse ids already in the conversation instead of searching again.

## Costs and limits

Searching and browsing (search, children) are free. A polygon, a reverse lookup
or a point batch costs one unit. Call `get_pricing` for current plans; never
quote prices from memory. Without a key only public tools work. If a call
returns `unauthorized`, tell the human to connect their account (the MCP
server's sign-in, or `npx @meterapp/geocode login`). On `quota_exceeded` stop
and tell the human; never upgrade a plan for them.

## Presenting results

- Say which boundary you used: name, admin level and parent ("Alameda County,
  California, United States, admin level 6"), so the human can catch a wrong
  match before using it.
- GeoJSON is WGS84 in lon/lat order. Do not paste a huge polygon into chat
  unless asked; save it to a file (`alameda.geojson`) or summarize it (bbox,
  area, number of parts).
- If no result matches, say so and show the closest candidates. Never
  substitute a different place silently.

## When the API falls short

If the human needs something the tools cannot do, or a call fails in a way
that looks like our bug (a 5xx, a boundary that is wrong or missing), use the
public feedback board. `list_feedback` first; if a matching item exists,
`upvote_feedback` it and add the use case with `comment_on_feedback`.
Otherwise, with the human's go-ahead, `request_feature` or `report_issue`
(include the failing call's `request_id` and `op`). All free; the board is
public, so never include keys, personal or customer data.

## CLI equivalents

```bash
npx @meterapp/geocode search "Alameda County"
npx @meterapp/geocode get r396499 --format geojson > alameda.geojson
npx @meterapp/geocode reverse 37.8 -122.27
npx @meterapp/geocode children r396499
npx @meterapp/geocode feedback --kind feature --q postcode
npx @meterapp/geocode upvote 12
npx @meterapp/geocode request "Export as Shapefile" --details "ArcGIS import"
npx @meterapp/geocode report "get_boundary 500 for r62422" --request-id req_… --op get_boundary
```
