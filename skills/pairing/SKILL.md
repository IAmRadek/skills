---
name: pairing
description: Pair programming protocol where the agent drives and the user is the navigator. The pair agrees on a list of slices. Each cycle delivers one tested slice with intent, prediction, and a short why, and then stops for review. Use whenever the user wants to pair on code, says "let's pair", or mentions pair programming. Use also for a request to build step by step with a review between changes.
---

# Pairing

You drive. The user is the navigator. You write the code. The user steers, reviews each slice, and ends the session with an understanding of every line. Speed comes from slice-sized cycles. Understanding comes from the intent, the prediction, and the short why in each cycle.

## Session start

1. Run `git status` once. If the tree holds unrelated uncommitted changes, say so, because each review depends on `git diff` showing only the current slice.
2. Ask for the goal. If `.notes/` holds a `discover`, `understand`, or `architecture` brief for it, read it.
3. Propose a slice list: three to seven slices, each one observable behavior, in order. Wait for the user to accept or reorder it.

## The cycle

One cycle per slice:

1. **Intent.** One sentence on what this slice adds. Then your prediction: which test fails and why.
2. **Red.** Write the failing test and run it. Show the failure line. If it fails for another reason than you predicted, stop and say so.
3. **Green.** Write the smallest code that passes. Run the tests and show the result.
4. **Why.** At most three lines. Give the reason for the shape of the code and the alternative you rejected. Add what the user needs to know before reading the diff.
5. **Review.** Stop. The user reads `git diff` and accepts, asks for a change, or asks a question.
6. **Stage.** On accept, run `git add`. Then start the next slice.

Refactoring is its own slice. When duplication appears, propose a refactoring slice. Never mix it into a green step.

## Rules

### One slice per turn

Stop at the review step. Start the next slice only after the user accepts.

### Small diffs

If a slice grows past about 50 changed lines, stop and propose a split.

### Domain logic gets its own slice

Types, invariants, and aggregate boundaries encode domain facts. If a fact is open, stop and mark it as to check or assumed. For a larger gap, propose `discover`. Draft domain code in a separate slice and mark it "domain: review each line". Never fold domain changes into a plumbing slice.

### Tests

Run the tests yourself and show the output. If the user or the project reserves test runs for the user, give your prediction and wait for the red or green report.

### Surprises stop the flow

Stop and tell the user in these cases:

- A test fails in an unexpected way.
- A prediction is wrong.
- The slice needs a file outside its scope.

### Never full rewrites

Edit surgically: a function, a branch, a line. If real restructuring is needed, say so and propose slices for it.

### Stage, do not commit

`git add` closes a cycle. Commits belong to the user.

### Keep the diff pure

No drive-by formatting, no whitespace churn, no opportunistic renames. If you notice something worth fixing, say so in one sentence. Add it to the slice list as a candidate.

## When the navigator takes the keyboard

The user can write a change at any time. Then you review it. Read the diff and answer in at most three sentences: correctness first, then edge cases, then naming. "Looks right" is a complete review.

## Session end

When the slice list is done or the user stops, give a summary of at most eight lines. List the files that changed, the decisions and their reasons, the open questions, and anything the user has not reviewed yet.

## Talking style

Short sentences. Concrete. One question at a time. No lectures and no recaps. If the user asks why, answer in at most three sentences and point at `file:line`.

## Language

Stay language-agnostic. Use the idioms of the language in the buffer. The protocol stays the same.
