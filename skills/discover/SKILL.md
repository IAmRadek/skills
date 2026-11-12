---
name: discover
description: Explores a problem with the user before a solution exists, so that the agent and the user share one picture of it. The agent interviews the user one question at a time with concrete examples and finds the gaps. Each fact is confirmed, to check, or assumed. The result is a disposable brief in `.notes/` that architecture, spec, or pairing work takes as input. Use when the user starts a new feature or enters a new domain. Use also for "let's discover", "what is the problem here", or "I am not sure what we need". Use also when another skill finds an open domain fact. For the current code, use understand. For product priorities, use roadmap.
argument-hint: "<problem or feature to discover>"
---

# Discover

The goal is a shared picture of the problem: the outcome the user wants, the rules of the domain, and what nobody knows yet. You ask, propose, and record. Neither you nor the user knows every answer at the start.

## Gotchas

- Stay in the problem space. If a solution comes up ("we need a queue"), ask which problem it solves. Record the problem, and park the solution for architecture.
- Abstract answers hide gaps. Ask for a concrete case: "Show me one real order that goes wrong." Rules come from examples.
- "I do not know" is a result. Record it as a gap with the cheapest way to close it. Never fill a gap from a default.
- Mark each fact with one status:
  - confirmed: the user or a source states it
  - to check: someone or something can answer it, for example a domain expert, the data, or the code
  - assumed: nobody can answer it now, and the work goes on with this value. State what breaks if it is wrong.
- Separate the outcome from the request. If the user asks for X, ask what changes for whom when X exists.
- Use the user's words for domain terms. If two words mean one thing, or one word means two things, stop and agree on one meaning. Record it in the glossary.
- Read the codebase before you ask what it can answer. For a deep look at the current system, hand off to `understand`.
- After the outcome, the main rules, and the gaps are clear, stop. Completeness is not the goal.

## Procedure

Ask one question per message. When you have a proposed answer, give it first and mark it as a guess.

1. **Frame.** State in one sentence the outcome, who gets it, and the end use: architecture, spec, pairing, or none. Ask what is out of scope. If the outcome is unclear, make it the first question.
2. **Examples.** Ask for two to four concrete scenarios: the normal case first, then the cases that go wrong. For each scenario, ask what happens today and what must happen.
3. **Rules.** From the examples, propose the rules and invariants in the user's words. The user confirms, corrects, or rejects each one. For each confirmed rule, ask for a case that breaks it.
4. **Gaps.** List each fact that is to check or assumed. For a fact to check, propose the cheapest way to close it: a question to a named person, a query on the data, a read of the code, or a spike. For an assumption, say what breaks if it is wrong. If a gap blocks the end use, say so.
5. **Play back.** Give the whole picture in at most ten lines: the outcome, the actors, the rules, and the gaps. Ask the user what is wrong or missing. Repeat until the user agrees.
6. **Brief.** Write `.notes/<topic>.md` from the template below and give the user the path. The brief is disposable. Do not commit it.

## Brief template

```markdown
# <topic>

Date: <YYYY-MM-DD>
Outcome: <what changes, and for whom>
End use: <architecture | spec | pairing | none>

## Glossary

- <term>: <meaning in the user's words>

## Examples

- <scenario>: today <what happens>. Must <what must happen>.

## Rules and invariants

- <rule> (confirmed: <source> | to check | assumed)

## Gaps

- To check: <fact>. Answered by: <person, data, code, or spike>.
- Assumed: <fact>. Breaks if wrong: <what>.

## Out of scope

- ...

## Parked solutions

- <solution>: <the problem it was meant to solve>

## Next route

<architecture | spec | pairing | spike | none>: <one line of reason>
```
