---
name: geocode-api
description: Write code that calls the Geocode AI API - REST (fetch, curl, Python requests) with the OpenAPI spec, the @meterapp/geocode CLI in scripts and CI, or the hosted MCP server from an agent framework. Covers auth with geo_ keys kept server-side, the resource and RPC routes, reading the op catalog, RFC 9457 errors, rate limit headers, batching points, caching polygons you already fetched, and the device sign-in for tools. Use when implementing or reviewing code that talks to Geocode AI; do not use for answering a boundary question in chat (geocode-boundaries) or building a described area (geocode-areas).
---

# Geocode AI from code

Base URL: `https://geocodeai.dev` (make it a setting in your app so it can
change). Machine-readable references, always current:

- `GET /v1`: every op with its input JSON Schema, cost and routes.
- `/openapi.json`: OpenAPI 3.1 (generate a client from it).
- `/llms-full.txt`: every op with curl examples.

## Auth

`Authorization: Bearer geo_…` (or `X-Api-Key: geo_…`). Create keys in the
dashboard or with `npx @meterapp/geocode keys create <name>`. A key is a
server-side secret of the app you are writing: load it from that app's secret
store or config and pass it in, as below; never ship one to a browser or commit
it. Public ops work without a key at a low per-IP rate.

## Routes

Every op has two equivalent routes with the same input:

- Resource route from the catalog (`http` field), e.g. `GET /v1/account`,
  `POST /v1/areas`. GET inputs are query parameters (or `?input=<json>`).
- RPC route `POST /v1/ops/{name}` with the input as a JSON body. Simplest to
  generate: one function for every op.

```ts
type GeocodeClient = { apiKey: string; baseUrl?: string };

async function geocode<T>(client: GeocodeClient, op: string, input: object): Promise<T> {
  const res = await fetch(`${client.baseUrl ?? "https://geocodeai.dev"}/v1/ops/${op}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${client.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const problem = await res.json(); // RFC 9457: { code, detail, request_id, ... }
    throw new Error(`${problem.code}: ${problem.detail} (request ${problem.request_id})`);
  }
  return res.json() as Promise<T>;
}
```

## Errors and limits

Errors are `application/problem+json` with `code`, `detail` and `request_id`:
400 `invalid_input` (with `issues`), 401 `unauthorized`/`invalid_key`, 402
`quota_exceeded` (the geocode-billing skill covers upgrading), 404 `not_found`, 422 `could_not_map` (areas), 429
`rate_limited` (wait `retry_after` seconds). Responses carry `RateLimit-Limit`,
`RateLimit-Remaining` and `RateLimit-Reset`; back off on 429 instead of
retrying hot. Retry 5xx once with jitter; never retry 4xx unchanged.

## Doing it efficiently

- Store boundary ids (`r396499`) in your data, not names; fetch by id.
- Cache polygons you fetched; boundaries change rarely.
- Test many points with one `contains_points` call, not a loop.
- `create_area` is slow (up to minutes) and costs much more than a lookup: run
  it once, store the polygon, re-run only when the description changes. Call
  `get_pricing` for current costs.

## CLI in scripts and CI

Sign in once with `npx @meterapp/geocode login`, which saves a key for the
CLI. In CI, store a key as a secret of the pipeline and pass it with
`--api-key` (`npx @meterapp/geocode --help` lists the options).

```bash
npx @meterapp/geocode search "Alameda County" --json | jq '.'
npx @meterapp/geocode call get_boundary --input '{"id":"r396499"}' > alameda.json
```

Exit codes: 2 usage, 3 auth, 4 quota or rate limit, 1 anything else. For a
tool that signs a person in, use the device flow the CLI uses:
`POST /v1/auth/device`, have them open `verification_uri_complete`, then poll
`POST /v1/auth/device/token` every `interval` seconds until it returns the key.

## Feature requests and issue reports

The feedback board is part of the API, so an app or agent can file from where
the problem happens. `GET /v1/feedback` (public; `kind`, `status`, `sort`,
`q`) lists requests and issues by upvotes; `POST /v1/feedback/features` and
`POST /v1/feedback/issues` file one (`title`, `details`; issues also take the
failing call's `request_id` and `op`); `POST`/`DELETE /v1/feedback/{id}/vote`
upvotes or takes it back; `POST /v1/feedback/{id}/comments` adds context.
Writes need a key and are free. Search before filing, and never put keys or
personal data in the public text.

## MCP from an agent

Streamable HTTP at `/mcp` (header `Authorization: Bearer geo_…`), the OAuth
variant `/mcp/account` for apps acting for a person, or stdio with
`npx -y @meterapp/geocode mcp`. Tools have the same names as the ops.
