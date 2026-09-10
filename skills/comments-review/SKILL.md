---
name: comments-review
description: Review the comments in code — stale, redundant, wrong, or missing ones — and report what to delete, fix, or add. Use when the user asks to review comments or documentation inside code, mentions "comments review", asks whether a comment still matches the code, or wants comment noise cleaned out of a diff or file.
---

# Comments Review

## Scope

Review the uncommitted diff by default (`git diff HEAD`, falling back to `git diff` plus untracked files). 
If the user names files, paths, or a commit range, review that instead. Never widen to the whole repository unless asked.

Read the code around every comment before judging it. A comment is only stale, wrong, or redundant relative to the code it sits on.

## What earns a comment

A comment earns its place only when it says what the code cannot:

- Why, not what. Explain a non-obvious decision, trade-off, or rejected alternative ("retry 3x: upstream flakes under load").
- Hidden constraints: invariants, units, thread-safety, ordering, side effects, valid ranges.
- Non-local context: link to spec, ticket, RFC, or bug that motivated the code.
- Deliberate weirdness: workarounds, hacks, perf tricks that look like mistakes.
- Contracts on public APIs: preconditions, errors returned, complexity.
- File header: purpose and how it fits the system, not author or date.
- TODOs: only with owner and ticket.

A long comment is rarely justified. If it does not fit one of the cases above, delete it.

Never restate a good name or type, and never narrate line by line

## Comment tells

Flag these, and say which one applies to each finding:

| Tell | Example | Why it matters |
|---|---|---|
| Narrating comments | `// Increment the counter` above `counter++` | Noise; hides the real comments |
| Section banners | `// ===== HELPERS =====` | Substitutes for structure that should be files or modules |
| Signature-restating docstrings | `"""Takes a user and returns the user's name."""` | Zero information; suggests no one knew *why* |
| Ceremonial markers | `# Note:`, `# Important:`, `# Edge case:` on trivial lines | Volume without judgment |
| Orphan TODOs | `TODO: implement properly` with no owner or ticket, present since initial commit | Stubs disguised as code |
| Change-log comments | `// Updated to handle null` | Belongs in git, signals no git discipline |
| Comments that lie | Comment describes behavior the code no longer has | Highest-severity comment tell |

## Exceptions

Leave these alone:

- Doc comments required by the language convention on exported symbols: godoc, JSDoc and TSDoc, Javadoc, Python docstrings on public API. The convention wins over the signature-restating rule, so improve the text instead of deleting the comment.
- License and copyright headers, code-generation markers (`// Code generated ... DO NOT EDIT.`), build tags, linter directives (`//nolint`, `# noqa`, `// eslint-disable`), and pragmas. These are not prose.
- Comments in vendored, generated, or third-party directories.

## Procedure

1. Collect the comments in scope, including doc comments and commented-out code.
2. For each one, decide: keep, delete, rewrite, or missing. "Missing" means the code hides a decision, constraint, or workaround that a reader cannot recover from the code.
3. Verify every claim against the code. If a comment describes behavior the code no longer has, it is a lie, and it ranks above every other finding.
4. Report. Do not edit files unless the user asks for a fix.

## Output

Order findings by severity: lies first, then missing comments, then noise. One line per finding:

```
path/to/file.go:42  delete  narrating comment  // Increment the counter
path/to/file.go:88  rewrite comment lies: says the cache is unbounded, code caps it at 1000
path/to/file.go:120 missing why the lock is held across the network call
```

Close with one sentence on the overall state of the comments. If nothing needs changing, say so and stop.
