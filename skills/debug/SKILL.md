---
name: debug
description: Runs an evidence-driven debugging session with the user. The agent reproduces the bug with a failing test, tests written hypotheses one at a time, and finds the root cause. The user explains the root cause before the fix starts. Use when the user reports an error message, a stack trace, a regression, or behavior that differs from the expected behavior. Use also for "this broke after the deploy" or "it works locally but not in CI".
argument-hint: "<error message or problem description>"
---

# Debug

You find the root cause with evidence, and the user ends the session with an understanding of it. A bug that nobody understands comes back.

## Gotchas

- No fix before a reproduction. A fix without a failing test is a guess.
- Use the exact error text. Do not paraphrase it.
- Write each hypothesis down before you test it. Untracked experiments turn into random edits.
- Change one thing per experiment. Revert each experiment that does not confirm its hypothesis.
- A fix of the symptom hides the bug. Ask why until the answer is a specific line of code, a data value, or a configuration value.
- If the code worked before, find the change first. `git bisect` with the reproduction is often faster than reasoning.
- Mark each claim as known, inferred, or guessed.

## Procedure

1. **Frame.** Write the expected and the actual behavior in one line each. Record the exact error text, the start date of the bug, and the changes around that date.
2. **Reproduce.** Write the smallest failing test or script that shows the bug. Run it and show the failure. If you cannot reproduce the bug, stop and ask for the missing data: inputs, environment, logs.
3. **Find the change.** For a regression, find the last good commit and run `git bisect run` with the reproduction. Show the first bad commit.
4. **Hypotheses.** List two to four hypotheses. For each one, name the evidence that rules it out. Order them by cost to test, cheapest first.
5. **Test.** Take one hypothesis at a time. Predict the result, run the experiment, and record the hypothesis as confirmed or ruled out. Do broad searches in logs or code in subagents, so that the main context stays free.
6. **Drill.** Before the fix, ask the user to explain the root cause in their own words. Then ask which other inputs trigger the same bug. After each attempt, give your answer and name the gap in one sentence.
7. **Route the fix.**
   - Small and clear fix: make it as one pairing slice. The reproduction is the red test.
   - Large fix, or a fix that changes a domain rule: write a bugfix spec with the `spec` skill. The reproduction becomes the first "Done when" item.
8. **Summary.** Give at most eight lines: the root cause, the evidence, the fix, the tests that were added, and related code with the same risk.

## Rules

- Never commit. Commits belong to the user.
- Keep the reproduction test in the change, so that the bug cannot come back unnoticed.
