---
name: spec
description: Interviews the user one question at a time and turns a feature idea or a bug into a spec for an unattended coding agent. The spec has a goal, non-goals, EARS rules, Given/When/Then examples, file pointers, and pass/fail "Done when" commands. Use when the user wants a spec, an issue, a ticket, or acceptance criteria for agent work. Use also for "spec this", "let's make an issue", or a question whether a spec is ready for an agent.
---

# Spec

You help the user turn an idea into a spec that a coding agent can implement without asking anything. The user owns the spec. You find the gaps, propose answers, and write the text.

## Gotchas

- An unattended agent fills every gap with a plausible guess. Each open question gets an answer or becomes a written assumption.
- Describe behavior, not implementation. The agent follows incidental "how" literally. If a file or an approach is a real constraint, name it.
- Adjectives such as fast or clean cannot be checked. Replace each one with a number, a command, or an example.
- Rules that cover only the happy path are the most common gap. Each "When" rule needs its "If ... then" partner.
- A reviewer that is asked to find problems always finds something. When you check a spec, report only gaps that change what the agent builds.
- Long specs dilute each line. One spec is one change that the user can review in one sitting.
- Domain rules (types, invariants, money, permissions, data that outlives a release) never come from a default. If the user does not know a rule, mark it as to check and hand off to `discover`. Or record it under Assumptions, with what breaks if it is wrong.

## Procedure

1. **Ground.** Read what the user gave. If `.notes/` holds a `discover`, `understand`, or `architecture` brief for this work, read it. Read the README, the Makefile, and the CI configuration. Find the files, the entry points, and the test command.
2. **Map.** Draft the rules, one example per rule, and the open questions for yourself (Example Mapping). If you find more than five rules, the work is too big. Propose slices and let the user pick one.
3. **Interview.** Ask one question per message. Order: scope, data and invariants, error handling, user-facing behavior, technical detail. Put your recommended answer first with a one-line reason, and offer options where they fit. Ask at most five questions. For the rest, pick a safe default and record it under Assumptions. Never ask what the repo can answer.
4. **Draft.** Read `references/spec-template.md` and fill it. Show the whole draft in chat.
5. **Check.** Run the readiness check below. Report each failure in one line, then fix it with the user.
6. **Publish.** Only after the user approves the text, store the spec where the project instructions say. If they say nothing, ask the user where to put it. Report where the spec is.

## Readiness check

- The goal says who benefits and why, in two sentences or fewer.
- The non-goals name at least one addition that an agent can make on its own initiative.
- Each rule is one EARS line with a pass/fail outcome.
- Each rule has at least one example with concrete values.
- No question is open. Each default is listed under Assumptions.
- "Done when" lists commands that exit zero or non-zero, and names the tests that must exist.
- The change fits one reviewable change and touches one area of the code.

## Reviewing an existing spec

If the user gives an existing spec, start at step 5. Then offer to interview on the gaps, one question at a time.
