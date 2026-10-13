---
name: note
description: Store and retrieve notes in the user's SilverBullet space. The space itself holds the structure and conventions on its AI Instructions page. Use it only on a direct request from the user.
disable-model-invocation: true
---

# Note

SilverBullet is the user's notes store. The structure and the conventions of the space live in the space itself, on the page `AI Instructions`. The user keeps that page current, so this skill holds only access and the rules that never change.

## Start

1. Read `AI Instructions` with `read_note`. Follow it for the whole task.
2. If the page is missing, tell the user. Do not guess the structure.
3. If a rule on that page conflicts with this skill, follow this skill and tell the user about the conflict.

## Access

Use the SilverBullet MCP tools for text pages: `list_pages`, `read_note`, `search_notes`, `write_note`, `append_note`, and `delete_note`.

Use the HTTP API for binary files, such as PDFs, and for large pages:
* The server URL is `SB_URL` in the SilverBullet MCP server configuration in `~/.claude.json`.
* Get the token with `SB_TOKEN=$(pass-cli item view --vault-name Personal --item-title Silverbullet --field SB_AUTH_TOKEN)`.
* `GET /.fs/<path>` reads a file. `PUT /.fs/<path>` writes a file. `DELETE /.fs/<path>` deletes a file. Send `Authorization: Bearer $SB_TOKEN`.

The MCP tools pass page text through the model. On long pages, this can change single characters. For a page over about 10,000 characters, write it with `PUT`, then read it back and compare.

To archive articles, use the `archive-article` skill.

## Retrieve

1. `search_notes` finds plain substrings. Try several words and spellings before you report "not found".
2. Read the pages that you found before you use them.
3. Name the page path for each fact that comes from the space.

## Rules that never change

* If the user asks, store a note. If an insight is worth keeping, propose a note. Never store without asking.
* Never store secrets: tokens, passwords, keys, or credentials. If an insight depends on one, store where it lives, for example the Proton Pass item, not the value.
* Never print the token, and never write it to a file.
* Never delete or overwrite the user's text without a request from the user.
