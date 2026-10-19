---
name: geocode-teams
description: Work inside a Geocode AI organization - tell which organization a key or connection acts in and the caller's role (get_account, list_orgs), who is in it and which teams exist (list_members, list_teams), save a boundary export to the organization's shared file library (save_file), find files teammates saved (list_files, get_file) and share a file with a team or a person at read, write or admin access (share_file, unshare_file, update_file). Use for "share this boundary with the GIS team", "what files has my team saved", "who is in our account", "which org am I in", a 403 forbidden; do not use for looking boundaries up (geocode-boundaries), plans and billing (geocode-billing), or inviting and removing people, which a human does on the dashboard.
---

# Organizations, teams and the file library

Every Geocode AI account is an organization. A key, the CLI or a connected
app acts in one organization: its plan, monthly units, API keys and file
library are shared by everyone in it. Each person has a role:

| role | can |
| --- | --- |
| viewer | read files shared with the whole organization; nothing that costs units |
| member | use every API op, save files, create teams and their own API keys |
| admin | also invite and remove people, manage every key and team, billing |
| owner | also make admins and owners, transfer or delete the organization |

An API key acts with its creator's role (at most admin) and keeps working if
they leave. A solo account is a personal organization with one owner, so for
most people nothing changes.

## Where am I

- `get_account`: `org` (id, slug, name, personal), `role`, and the plan and
  units of that organization.
- `list_orgs`: every organization the person is in (with a key: just the key's).
  To act in another, the human approves a new key there (`geocode login`
  asks which organization) or connects the app again and picks it.

## Handing a boundary to the team

1. Find the boundary as usual (`search_boundaries`, then its id).
2. `list_files` first: someone may have saved it already; reuse that entry.
3. `save_file` with `{"boundary_id": "r62422", "format": "geojson",
   "detail": "medium"}` (1 unit). `visibility: "org"` (default) lets every
   member see it; `"restricted"` keeps it to the creator, admins and shares.
4. `list_teams` for the team's slug, then `share_file` with `{"id": "<file
   id>", "team": "gis", "access": "read"}` (or `"user": "<email>"` for one
   member from `list_members`). Sharing again changes the access.
5. Give the human the file's `url` (a permanent CDN link) and say who can see it.

`get_file` shows a file's shares when you can manage it; `unshare_file` removes
one by its grant id; `update_file` renames it or changes its visibility.

## When something is refused

- `403 forbidden` carries `required_role` or `required_access`: tell the human
  which role or share they need and that an admin changes it at
  `/dashboard/org`. Do not retry with another key.
- Inviting, removing members, changing roles, teams, transferring or deleting
  the organization are done by a person on the dashboard (`/dashboard/org`).
  No tool does them; never try to work around that.
- `list_invites` and `list_audit_log` are for admins: who was invited, and who
  changed what (members, roles, keys, billing, shares) and when.

From a terminal: `geocode whoami` names the organization and role;
`geocode orgs`, `geocode members`, `geocode teams`, `geocode files`,
`geocode save <id>` and `geocode share <file id> --team <slug>`.
