---
name: roadmap
description: Shapes a product idea into phases (pre-MVP, MVP, post-MVP) with an outcome each. After work ships or evidence arrives, it refines the roadmap. The agent interviews the user one question at a time. Each item has a problem, a riskiest assumption, the cheapest test, an appetite, and a confidence level from evidence. Cut items go to a Dropped log with the reason. Now items go to /start. The store (markdown file, Silverbullet page, or GitHub issues) is chosen last and recorded in the project instructions. Use when the user starts a new product, asks what to build, or wants a roadmap or an MVP cut. Use also for "refine the roadmap" or "what next".
argument-hint: "<product idea, or refine>"
---

# Roadmap

The roadmap decides what to build next and why. The user owns every decision in it. You ask, propose, and keep the record.

## Gotchas

- A roadmap drifts into a feature list. Each Now item names the phase outcome it serves and the assumption it tests. If it cannot, it is not ready for Now.
- Before an MVP, impact and effort are guesses. Use the confidence levels below, never numeric scores.
- Opinions and compliments are not evidence. Evidence is a past event, a commitment, a test result, or observed use.
- Cutting is a normal result. A cut item goes to the Dropped log with the date and the reason. Before you propose an item, search the Dropped log.
- Detail follows the horizon. A Now item is complete. A Next item has a problem and an assumption. A Later item is one line.
- An item that passes its appetite stops and goes back to Next for reshaping. Never extend it silently.
- Promote, cut, or reorder an item only after the user approves.
- The store is the last decision. Do not let the store shape the content.
- Do not build here. A Now item goes to `/start`.

## Confidence

| Level | Evidence |
|---|---|
| guess | An opinion, including the user's. |
| heard | A real person described a past event or a workaround. |
| committed | Someone gave time, money, or reputation. |
| tested | A spike or an experiment passed its criterion. |
| shipped | Users used it, and the phase check was observed. |

Confidence goes down as well as up. A failed test sets the item back to guess or drops it.

## Structure

Read `references/roadmap-template.md`. A roadmap has one product outcome, three phases, items, a Dropped log, and a decision log. Each phase has an outcome and an exit check that you can observe. Each item has a status: now, next, later, done, or dropped. At most three items are now at a time.

## Shape

If no roadmap exists, use this mode.

1. **Ground.** Look in the project instructions for a `Roadmap:` line. If it points to a roadmap, go to Refine. Read the idea and the README.
2. **Interview.** Ask one question per message. If you have a recommended answer, put it first. Skip a question that an earlier answer covers. If the user does not know, record the gap as an assumption with confidence guess.
   - Pre-MVP:
     1. Who has this problem? Name one real person or role that you can reach this week.
     2. Tell me about the last time they had it. What did they do, and what did it cost them?
     3. What do they use today, and what makes them switch?
     4. If one belief is wrong, the idea dies. Which belief is it, and what evidence do you have for it?
     5. What is the cheapest test of that belief, and which result makes you stop?
   - MVP:
     6. How much time will you spend on the first version? This is the appetite, for example two or six weeks.
     7. What are the user's steps from start to end? What is the thinnest version of each step?
     8. What is out of the first version, and which unknowns can break the appetite?
   - Post-MVP:
     9. Which one to three observations show that it works? Which user commitment counts as success?
     10. Which ideas wait until then?
3. **Draft.** Fill the template. Pre-MVP items test the riskiest assumptions, often with a conversation or a spike. The MVP phase holds the walking skeleton (the thinnest version of every step) inside the appetite. Post-MVP items are Later lines. Show the whole draft in chat.
4. **Check.** Run the readiness check. Report each failure in one line, then fix it with the user.
5. **Store.** Do this after the user approves the text. If the project instructions name a store, use it. If not, ask the user to pick one: a markdown file, a Silverbullet page, or GitHub issues. Then offer to add one `Roadmap:` line to the project CLAUDE.md. Read `references/stores.md` and write the roadmap. Report where it is.
6. **Hand off.** Name the first Now item as a one-line idea for `/start`.

## Refine

If a roadmap exists, use this mode. Run it after one of these events:

- A phase ships.
- A spike or an experiment returns.
- An assumption breaks.
- An item passes its appetite.
- A new idea arrives.

1. **Read.** Read the roadmap from its store. Read what changed since the last decision log entry: closed items, merged work, spike notes and briefs in `.notes/`, and the user's new ideas.
2. **Ask.** Ask one question per message, and only the questions that the changes raise:
   1. Did each finished item move its phase outcome? Yes, no, or unknown, and why.
   2. Which evidence is new, and which confidence levels change?
   3. Which assumption broke?
   4. Are the Now items still the best use of the next weeks?
   5. What do we cut, merge, or split?
   6. What is the cheapest test for the most uncertain Next item?
   7. Does an item have a real deadline?
3. **Propose.** List each change in one line: move, cut, add, split, or a confidence change, with the evidence. Wait for the user to approve each change.
4. **Write.** Apply the approved changes to the store. Add one decision log entry per change. If the phase exit check passed, mark the phase done and promote the next phase.
5. **Hand off.** Name the next Now item for `/start`.

## Readiness check

- The product outcome and each phase outcome describe a change for a user. A feature name is not an outcome.
- Each phase has an exit check that a person can observe.
- Each Now item has all fields of the template, and its confidence matches its evidence.
- Each Next item has a problem and an assumption.
- No item repeats an entry of the Dropped log without new evidence.
- At most three items are now.
