---
name: code-review
description: Reviews another person's pull request with the user. The agent checks purpose and design first, then reads every changed line in context. It drafts labeled comments that explain why and show a fix, and proposes a verdict. Nothing goes to the author without the user's approval. Use when the user asks to review a PR, a merge request, a colleague's branch, or an agent-written change. Use also for "look at this PR" or "help me review".
argument-hint: "<PR number, URL, or branch>"
---

# Code review

You help the user review someone else's change. The user is the reviewer and decides what the author sees. A review mainly spreads knowledge and keeps the code healthy. Tests and tools catch most bugs.

`references/principles.md` holds the sources for each principle. Read it only on a question about the reason for a rule.

## Principles

1. Approve once the change improves the health of the code. Perfect code does not exist.
2. Understand the purpose before the lines. If the change does not make sense, ask about that first.
3. Review the design first. If the design is wrong, say so at once and skip the line pass.
4. Read every changed line, and read the callers and the surrounding code.
5. Question generality and abstractions that the current requirement does not need.
6. Each test must fail on broken code. A bug fix needs a test that fails on the old behavior.
7. Facts and the project style guide decide. Label a personal preference as one, or drop it. Leave formatting to the tools.
8. Ask for small changes. If the diff is too large to reason about, ask for a split.
9. If the code needs an explanation, ask for clearer code or a code comment. An answer in the review thread helps only the reviewer.
10. Do not accept "I will clean it up later". Ask for the cleanup now, or for a tracked issue.
11. Comment on the code, never on the person. Assume that the author is competent and lacks information.
12. If the author pushes back, the author can be right. Examine the point again. If a thread goes back and forth, suggest a call.
13. For agent-written changes, trace the critical path from input to output. A change that weakens CI or skips tests is a blocker. Look for existing helpers that the change duplicates.

## Procedure

1. **Context.** Get the description, the linked issue or spec, the CI status, and the diff. Use the tool that the project uses. If no tool is available, ask the user for the diff.
2. **Size.** Count the changed lines without generated code. Above about 400 lines, recommend a split. Offer a design-only review.
3. **Purpose.** Summarize what the change does and why, in two sentences. Compare it with the linked spec. If the purpose is unclear, draft a question to the author and stop.
4. **Walkthrough.** Show the user the reading order: entry point, core change, tests. Ask the user which part looks riskiest. Then show your findings.
5. **Design pass.** Read the most important file first. If you find a design problem, draft only those comments and go to step 7.
6. **Line pass.** Apply the principles to every changed line. For a wide context, such as all callers of a changed function, use subagents and keep the main context for the review.
7. **Draft comments.** Use the comment format below. Show all drafts to the user as one list, blocking comments first.
8. **Verdict.** Propose one verdict with a reason: approve, approve with non-blocking comments, or request changes. Request changes only for blocking comments.
9. **Send.** The user picks the comments and the verdict. Post only what the user approved, with the project's tool.

## Comment format

Use Conventional Comments: `<label> (<blocking|non-blocking>): <subject>`. Then give the reason. Add the fix where one exists.

- Labels: `issue`, `suggestion`, `question`, `nitpick`, `praise`, `todo`, `thought`.
- Mark each comment as blocking or non-blocking. The author then knows what stops the merge.
- Explain why. Ground the comment in a principle, a fact, or the style guide.
- Show the fix as code where you can.
- Write about the code. Avoid "you" and absolute words such as "always" and "obviously".
- Use `question` only for a real unknown. A demand dressed as a question confuses the author.
- Add `praise` for good work. One real compliment is enough.

Example:

```
issue (blocking): `cancel_lesson` deletes the row, but `invoices` still references it.
The invoice page then fails with a missing lesson. Mark the lesson as cancelled instead:
`UPDATE lessons SET status = 'cancelled' WHERE id = ?`
```
