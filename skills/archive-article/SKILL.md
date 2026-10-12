---
name: archive-article
description: Archive web articles, PDFs, and YouTube links as pages in a SilverBullet space. Each page stores the article text as Markdown, a reading status, and topic tags. Use it for a request to archive, save, clip, or stage URLs into SilverBullet or into the Reading folder. Use it also for "add this to my reading list".
---

# Archive Article

Archive each URL as one SilverBullet page in `Reading/` (or another folder). The page holds the article text. The user can read it offline, and the text stays after the site disappears.

## What the script does

`archive.mjs` (next to this file) handles one or more URLs:

* Web article: runs `defuddle` (a local tool that extracts the main text, the engine of the Obsidian Web Clipper) and stores the text as Markdown.
* PDF: uploads the PDF file next to the page and links it from the page.
* YouTube: stores the title, the channel, and the link. It stores no transcript.

Each page gets this frontmatter, then an `# Article` section and an empty `# My notes` section:

```yaml
tags: [llm, craft]
url: "https://example.com/post"
status: unread
added: 2026-10-12
author: "Name"
published: "2026-09-04"
```

The script writes through the SilverBullet HTTP API (`PUT /.fs/<path>`). It reads every file back and makes sure that it matches what it sent. It never overwrites an existing page or PDF. It skips the URL and reports `SKIP exists`.

## Procedure

1. Get the server URL. Read `SB_URL` from the SilverBullet MCP server configuration in `~/.claude.json`. If it is not there, ask the user.
2. Get the token from the user's password manager. Do not print it, and do not write it to a file:
   ```sh
   SB_TOKEN=$(pass-cli item view --vault-name Personal --item-title Silverbullet --field SB_AUTH_TOKEN)
   ```
3. Remove duplicate URLs, and tell the user how many unique URLs remain.
4. Run a dry run first. It downloads and converts everything but writes nothing:
   ```sh
   SB_URL=... SB_TOKEN="$SB_TOKEN" node archive.mjs --dry-run <url> ...
   ```
5. Give a title to every PDF, because a PDF file has no reliable title. Use the `url|Title` form:
   ```sh
   node archive.mjs "https://example.org/naur.pdf|Programming as Theory Building"
   ```
   If you give the title from memory, tell the user, so they can check it.
6. Look at the dry-run output. If several pages share a name, the output shows `(2)` and `(3)`. In that case, give each page a clear title with `url|Title`. An example is "Part 1" to "Part 6" of a series.
7. Run the real upload without `--dry-run`. If all URLs in the call share the same tags, add `--tags a,b`. Otherwise, run one call per tag group.
8. Report each page as `OK`, `SKIP`, or `FAIL` with the reason.

## Tags

Use the topic tags that the user's `Reading` page lists. Do not use the tag `ai` for a topic, because `#ai` marks text that the AI wrote.

To classify articles by content, read each article first. A title alone is not enough. Say which articles you tagged from the title only, for example videos.

## Limits

* `defuddle` does not run JavaScript. A page that loads its text with JavaScript can come back empty or short. Check the character count in the output. Under about 1,000 characters for an article means that the extraction probably failed.
* Images stay as links to the original site. If the site disappears, the images disappear too.
* Paywalled pages return only the visible part.
* A PDF URL must end in `.pdf`. The script treats every other URL as a web page.
* The script needs Node.js 18 or later and network access to npm for `npx`.

## Changes after upload

To change a page later, such as its tags, download it first, change it, and upload it again. Before the upload, compare the server copy with your last copy. If they differ, the user edited the page, so do not overwrite it. Ask the user.
