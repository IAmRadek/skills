---
name: architecture
description: Works through an architectural decision with the user until the forces, options, tradeoffs, and fitness functions are clear. The user then chooses and can defend the choice. A written decision record is optional. Use when the user faces a design choice that outlives one change. Examples are a data model, a boundary, a dependency, an integration, or a consistency model. Use also to compare technologies, to review a design proposal, or for "how do we architect X".
argument-hint: "<decision or system to design>"
---

# Architecture

You help the user understand a decision well enough to make it and to explain it to others. The user decides. You bring out the forces, the options, and the tradeoffs, and you ask for evidence.

## Gotchas

- Start from forces, not from solutions. If the team agrees on a technology first, the first idea wins by default.
- "It depends" is not an answer. Name what it depends on and the value that flips the choice.
- Each option has a cost. If an option has no listed downside, nobody understands it yet.
- Quality attributes conflict, for example consistency against availability. Ask the user to rank the top three.
- Separate one-way doors from two-way doors. Spend the analysis on choices that are expensive to reverse. For cheap choices, pick one and move on.
- Always include the smallest option that can work, and "change nothing", in the comparison.
- A tradeoff without a check decays. Each top quality attribute gets a fitness function. A fitness function is a repeatable check that fails on architectural drift.
- Most architecture decisions place boundaries, so they manage coupling and cohesion. Judge each boundary by integration strength, distance, and volatility. When an option creates, moves, or removes a boundary, read `references/balanced-coupling.md`.
- Domain facts, such as invariants and data ownership, come from discovery. If a fact that changes the choice is open, mark it as to check or assumed. For a larger gap, hand off to `discover`.
- Prefer evidence to opinion: existing code, a benchmark, a spike, a prototype. Mark each claim as known, inferred, or guessed.

## Procedure

1. **Frame.** State the decision as one question. Name what makes it urgent now and how long the answer must last. If `.notes/` holds a `discover` or `understand` brief for this work, read it first.
2. **Forces.** Collect them, one question per message, with your recommended answer first:
   - the quality attributes that matter, with the top three ranked
   - the constraints, split into hard and soft
   - the context: team skills, the current system, deadlines, budget
   - the volatility of the affected components and who owns them. Read git history to find what changes together.
   Read the codebase for constraints that it already enforces. Never ask what the repo can answer. Ask at most five questions, and record the rest as assumptions.
3. **Options.** Describe two to four options in one paragraph each. For each option, say what it makes easy, what it makes hard, and how expensive it is to reverse. Name the boundaries it creates or moves, with the strength, distance, and volatility of each. Flag each unbalanced boundary. If the decision places boundaries, derive one option from cohesion, as `references/balanced-coupling.md` describes.
4. **Tradeoffs.** Compare the options against the ranked attributes only. Name the deciding tradeoff in one sentence: "A buys X at the cost of Y." Name the condition that flips the choice.
5. **Unknowns.** For each unknown that can change the choice, propose the cheapest way to resolve it: a spike, a benchmark, or a question to an expert. If an unknown blocks the choice, stop here and say so.
6. **Fitness functions.** For each top attribute, propose a check. Say what it measures, where it runs (test, CI, monitoring), and its threshold. Example: "No module under `domain/` imports the database crate. A test in CI checks the imports." Each boundary in the chosen option also gets a check.
7. **Decide.** The user picks. Restate the decision, the deciding tradeoff, the accepted costs, and the event that triggers a review.
8. **Record (optional).** Ask whether the user wants the decision written down. If the project has a format, use it. If not, read `references/decision-record.md` and fill it.

## Reviewing a proposal

If the user gives an existing design, start at step 2 and test the design against the forces. Report missing forces, costs that the design does not list, unbalanced boundaries, and attributes that have no fitness function.
