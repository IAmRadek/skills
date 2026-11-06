---
name: start
description: Front door for any new piece of work. Takes a one-line idea, asks at most two questions, and picks one route with a reason. Unfamiliar work goes to understand first. The routes are understand, spec, architecture, spike, pairing, and debugging, and each one hands off to its own skill. Use when the user types /start with an idea, a bug, or a task.
disable-model-invocation: true
argument-hint: <idea, bug, or task in one line>
---

# Start

The user wants to begin this work: $ARGUMENTS

Your job is to pick the route, not to do the work. The skill for the route does the work.

## Gotchas

- Do not start the work before the user confirms the route. A wrong route costs more than one extra message.
- Do not repeat the steps of the route skill here. Hand off and let it run.
- If the request mixes routes, split it. Start with the route that unblocks the others, usually the architecture choice before the spec.
- Project instructions can add routes or change where a route ends, for example "a ready spec goes to the build pipeline". Follow them.

## Routes

| Route | Pick it when | Hand off to |
|---|---|---|
| Understand | The user does not know the area well enough to judge the work. | the `understand` skill, then the route in its brief |
| Spec | The expected behavior is known and fits one reviewable change. | the `spec` skill |
| Architecture | The work needs a choice that outlives the change: a data model, a boundary, a new dependency, a public API. | the `architecture` skill, then Spec |
| Spike | An unknown remains that only running code can answer. | the `spike` skill, then the route in its note |
| Pair | The user wants to build it together and review each slice. | the `pairing` skill |
| Debug | The code behaves differently from the expected behavior, and the cause is unknown. | the `debug` skill |

If the kind of problem is unclear, use the `cynefin` skill to classify it first.

If a route skill is not installed, say so in one line and follow the "Pick it when" text as the goal.

## Procedure

1. Read the idea. Read the project instructions for project routes.
2. Ask how well the user knows the area. If the user does not know it well, the route is Understand. Go to step 4.
3. If the route is clear, go to step 4. If not, ask at most two questions, one per message, with your recommended answer first. Useful questions:
   - Do you know the expected behavior, or do we need to find it?
   - Does this need a decision that outlives the change?
   - Do you want to write this yourself?
4. Name the route, give a one-line reason, and name the likely next route after it. Wait for the user to confirm.
5. Invoke the skill for the route with the idea and the answers so far. If a brief from `understand` exists for this work, pass its path.
