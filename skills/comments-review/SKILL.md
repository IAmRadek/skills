---
name: comments-review
description: Review the comments in code — stale, redundant, wrong, or missing ones — and report what to delete, fix, or add. Use when the user asks to review comments or documentation inside code, mentions "comments review", asks whether a comment still matches the code, or wants comment noise cleaned out of a diff or file.
---

# Comments Review

A comment earns its place only when it says what the code cannot:

- Why, not what. Explain a non-obvious decision, trade-off, or rejected alternative ("retry 3x: upstream flakes under load").
- Hidden constraints: invariants, units, thread-safety, ordering, side effects, valid ranges.
- Non-local context: link to spec, ticket, RFC, or bug that motivated the code.
- Deliberate weirdness: workarounds, hacks, perf tricks that look like mistakes.
- Contracts on public APIs: preconditions, errors thrown, complexity.
- File header: purpose and how it fits the system, not author/date.
- TODOs: only with owner and ticket.
- Long comment is rarely justified if it's not delete it.

Remove or signal obvious AI tells:


| Tell | Example | Why it matters |
|---|---|---|
| Narrating comments | `// Increment the counter` above `counter++` | Noise; hides the real comments |
| Section banners | `// ===== HELPERS =====` | Substitutes for structure that should be files/modules |
| Signature-restating docstrings | `"""Takes a user and returns the user's name."""` | Zero information; suggests no one knew *why* |
| Ceremonial markers | `# Note:`, `# Important:`, `# Edge case:` on trivial lines | Volume without judgment |
| Orphan TODOs | `TODO: implement properly` with no owner or ticket, present since initial commit | Stubs disguised as code |
| Change-log comments | `// Updated to handle null` | Belongs in git, signals no git discipline |
| Comments that lie | Comment describes behavior the code no longer has | Highest-severity comment tell |


Never restate a good name/type, or narrate line by line.
