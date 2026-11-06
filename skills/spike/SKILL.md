---
name: spike
description: Answers one question with disposable code. The agent sets a pass/fail criterion and a time box, records the user's prediction, and builds the cheapest probe in a throwaway git worktree. The result is a short note in `.notes/` with the answer, the evidence, and the next route, and the code is deleted. Use when an idea needs a quick validation or an unknown blocks a decision. Use also for "spike this", "does X work", or "is this feasible".
argument-hint: "<question to answer>"
---

# Spike

A spike answers one question. The code is evidence, not a product. It never reaches the main branch.

## Gotchas

- A spike without a pass/fail criterion never ends. Set the criterion before any code.
- One question per spike. If a second question comes up, write it down for a new spike.
- The cheapest probe wins: a script, a hard-coded value, a copied example. If the question is not about tests, structure, or error handling, skip them.
- If the time box runs out, stop and report what you know. Do not extend it without the user.

## Procedure

1. **Question.** State the question in one sentence and the pass/fail criterion with a number or an observable result. Agree on a time box with the user.
2. **Prediction.** Ask the user to predict the answer and the reason. Record it.
3. **Probe.** Create a worktree: `git worktree add ../<repo>-spike-<topic>`. Build the smallest code that answers the question. Run it and capture the output.
4. **Note.** Write `.notes/spike-<topic>.md` in the main checkout. It has these sections:
   - question and criterion
   - answer: pass or fail
   - evidence: commands and output
   - prediction: the user's prediction compared with the result
   - next route: spec, architecture, pairing, another spike, or drop the idea
5. **Clean up.** Show the note. After the user agrees, remove the worktree with `git worktree remove --force ../<repo>-spike-<topic>`. If the user wants to keep some code, copy it into the note.
