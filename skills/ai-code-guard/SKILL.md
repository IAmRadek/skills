---
name: ai-code-guard
description: Check the current changes for the tells and smells of AI-written code — single-use abstractions, swallowed exceptions, copy-adapt duplication, stringly-typed state, tests that assert the mock, speculative machinery — and report cited findings the author must answer before committing. Use when the user asks to check, guard, or review their changes or a branch for AI slop, over-engineering, missing abstractions, or lost ownership; when they say "keep my changes in check", "did I let the model run away", "review this diff for smells"; or before a commit or pull request on code an agent wrote. For a whole-repo takeover audit that produces a plan, read reference.md instead.
---

# AI Code Guard

Guard the changes under review against the ownership standard in `reference.md`. A human owns code when they can hold its model in their head, find each concept in one place, predict what a change does, explain why every piece exists, and extend it without reverse-engineering it. This skill checks whether the current change moves toward that or away from it.

`reference.md` is the full operating guide. Read the sections this skill points at, not the whole file, and only when a finding needs the detail.

## Scope

Review the uncommitted diff by default: `git diff HEAD`, plus untracked files that are not ignored. If the user names a branch, a commit range, or paths, review that instead.

Judge changed lines, and read enough surrounding code to judge them fairly. A single-use abstraction added in this diff is a finding. One that already existed is context, not a finding, unless the change extends it.

If the diff is empty, say so and stop.

## Rules

These override the instinct to be helpful by producing code.

- Read before judging. Every finding cites `path:line` and quotes or describes the evidence. If you cannot cite it, it does not go in the report.
- Report, do not refactor. Do not edit files unless the user asks for a fix. Obvious fixes go in the report as low-effort items.
- Prefer deletion. For every finding ask: can this be deleted, then merged, then renamed, and only then extracted.
- Do not propose an abstraction to fix an abstraction. The answer to a factory with one product is removing the factory.
- Calibrate. A grep-verifiable claim is high confidence. A judgment about whether an abstraction is wrong is medium. Say which.
- Ask, do not assume. When a choice could be deliberate, put it in Open questions, not in the findings.
- Write the report the way a senior engineer writes a review: terse, specific, opinionated, cited. No filler, no benefit lists, no restating what the code does.

## Procedure

1. **Quick scan.** Run the cheap mechanical checks from Appendix A of `reference.md` over the changed files: unused imports and exports, functions over 60 lines, every `except Exception` or `catch (e)`, every TODO, FIXME, "for now", "temporary", "mock", "placeholder", every boolean parameter, every class with one subclass or interface with one implementation, every new dependency with fewer than three call sites, and the adjective grep (`enhanced`, `advanced`, `improved`, `robust`, `comprehensive`, `smart`, `v2`, `new`, `final`, `legacy`). These are free and often account for a third of the findings.
2. **Catalog pass.** Walk the changed code against the tells in Part 3 of `reference.md`: naming, structural, duplication, test, error-handling, documentation, dependency, and the sycophantic-code pattern. Skip the comment tells; see Comments below.
3. **Abstraction pass.** Apply the detection table in Part 5 of `reference.md` to the change. Parameters that always travel together, fixed-shape dicts, strings compared against a fixed set, repeated validation, `isinstance` cascades, unit confusion. Name what the code uses but has not named.
4. **Session seams.** Check whether the change speaks the same language as the code it lands in: error style, naming, sync versus async, logging, and the domain vocabulary. A new synonym for an existing concept is a finding.
5. **Report.** Order by severity and stop.

## Comments

Do not carry a comment catalog here. When the change touches comments or doc comments, invoke the `comments-review` skill for that dimension and fold its findings into this report under category `tell`. One catalog, one place to edit it.

## Output

Group by severity, highest first. One block per finding, using the short form of the register in Part 7.3 of `reference.md`:

```
F-001  high  structural / swallowed exception
  internal/orders/processor.go:112
  New catch-all logs and returns nil, so a failed write becomes an empty
  result at the call site in api.go:44.
  Confidence: high — the caller does not check the returned error.
  Effort: S   Action: delete
  After: the write error reaches the handler and returns 500.
```

Severity: critical for silent data corruption, swallowed errors on real paths, stubs on production paths, and security-relevant gaps. High for anything blocking understanding of a hotspot, duplication with divergent behavior, or a missing abstraction across many call sites. Medium for local confusion, single-use abstractions, and test tells in important modules. Low for cosmetics and naming in leaf code.

Close with two short sections, each omitted when empty:

- **Open questions.** Every place you could not tell deliberate from accidental, phrased as a question with both readings and what you would do under each.
- **Verdict.** One paragraph. Does this change leave the code more ownable or less, and what is the one thing to fix before committing. If nothing needs changing, say so in one line.

## When the change is large

If the diff spans more than roughly thirty files, or the user is auditing a whole repository rather than a change, this skill is the wrong tool. Read `reference.md` and follow it: Phase 0 orientation, the full catalog, the complexity assessment, and the sequenced plan deliverable.
