---
name: understand
description: Builds the user's understanding of an area before work starts. The agent researches the code and other sources, presents the findings in small chunks, and drills the user after each chunk. The user explains, predicts, and names edge cases before the agent answers. The result is a disposable brief in `.notes/` that spec, pairing, or architecture work can take as input. Use when the user wants to understand an area, says "grill me", "drill me", or "I do not know this part yet". Use also before work in an unfamiliar part of the code.
---

# Understand

The goal is the user's understanding. The brief is a by-product. You research, present, and ask. The user thinks first.

## Gotchas

- Never answer your own question first. The user attempts, then you give your answer and name the gap. If the user says "I do not know", give a hint first. Give the answer only after a second attempt.
- A long report is read once and forgotten. Present one chunk at a time: one concept, one code path, or one rule, in at most ten lines with `file:line`.
- Drill on what changes behavior: rules, invariants, failure paths, boundaries, and edge cases. Skip trivia such as names and syntax.
- Mark each finding as known (read in code or docs), inferred, or guessed.
- If the code and the user disagree about a rule, stop and record it as an open question. These gaps are the most important result.
- After the user can explain the area back, stop. Completeness is not the goal.

## Procedure

1. **Scope.** State in one sentence what the user wants to understand, and the end use: spec, pairing, architecture, or none. If the scope is unclear, ask.
2. **Research.** Do the research in subagents, so that the main context stays free for the drill. Split the scope into independent questions, for example the code path, the tests, the docs, and the history of the relevant files (`git log`). Start one subagent per question, all in one message so that they run in parallel. Ask each subagent for findings of at most 30 lines, each with `file:line` and a known, inferred, or guessed mark. Do not read whole files in the main context. From the findings, make a list of three to seven chunks, from the entry point inward. Show the list.
3. **Chunk loop.** For each chunk:
   1. Present it in at most ten lines, with `file:line`.
   2. Ask one to three questions, one per message. Use these kinds:
      - Explain back: "In your words, what does X guarantee?"
      - Predict: "Y is empty. What happens?"
      - Edge case: "Which input breaks this?"
      - Contrast: "Why X and not Y?"
   3. After the user's attempt, give your answer, name the gap in one sentence, and record it.
4. **Teach back.** Ask the user to explain the whole area in five sentences or fewer. Point out what is missing or wrong.
5. **Brief.** Write `.notes/<topic>.md` from the template below and give the user the path. The brief is disposable. Do not commit it.

## Brief template

```markdown
# <topic>

Date: <YYYY-MM-DD>
Question: <what the user wanted to understand>
End use: <spec | pairing | architecture | none>

## How it works

(The user's own explanation from the teach back, corrected.)

## Rules and invariants

- <rule> (source: file:line | user | inferred)

## Edge cases

- Found by the user: ...
- Missed by the user: ...

## Gaps and open questions

- ...

## Next route

<spec | pairing | architecture | spike | none>: <one line of reason>
```
