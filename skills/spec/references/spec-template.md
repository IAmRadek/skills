# Spec template

Fill every section. Delete the guidance lines in parentheses. If a section is empty, write "None" so the agent knows that the gap is deliberate.

Title: imperative mood, under 70 characters, for example "Let a tutor cancel a lesson".

```markdown
## Goal

(Who benefits and why, in two sentences or fewer.)

## Non-goals

- (Things the agent must not add, even if they look helpful.)

## Rules

(EARS patterns. One line per rule. Number them so tests and examples can cite them.)

- R1. When <trigger>, the <system> shall <response>.
- R2. If <unwanted condition>, then the <system> shall <response>.
- R3. While <state>, the <system> shall <response>.
- R4. The <system> shall <response>.

## Examples

(Given/When/Then with concrete values. At least one per rule.)

### R1: <short name>

- Given <starting state with real values>
- When <action>
- Then <observable result>

## Assumptions

- (Defaults chosen during the interview that the user did not state.)

## Pointers

- `path/to/file` : (why it matters: entry point, prior art, the seam to extend)

## Constraints

- Always: (for example, add a migration for each schema change)
- Stop and report: (situations where the agent must not guess)
- Never: (for example, add a dependency, change a public API)

## Done when

- [ ] `<test command>` passes.
- [ ] `<lint command>` passes.
- [ ] Each rule R1 to Rn has at least one test that fails without the change.
- [ ] (Other observable evidence, such as a response body or a screenshot.)

## Clarifications

- Q: (question from the interview) → A: (the user's answer)
```
