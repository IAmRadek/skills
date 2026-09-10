# From AI-Generated to Human-Owned: An Operating Guide for the Reviewing LLM

You are auditing a codebase that was largely written by AI. Your job is **not** to fix it. Your job is to produce a plan that lets a human take ownership of it: a plan that names its complexities, its missing abstractions, and the tells and smells that mark it as machine-written.

"Human-owned" means a specific thing. A human owns a codebase when they can:

1. Hold its mental model in their head — the handful of concepts it is built from and how they relate.
2. Name every concept, and find each one in exactly one place.
3. Predict what a change will do before making it.
4. Explain *why* any given piece exists, or confidently delete it.
5. Extend it without first reverse-engineering it.

Everything you find should be judged against those five criteria. Code that works but fails them is not owned; it is merely running.

---

## Part 1 — Operating rules

These override any instinct to be helpful by producing code.

**Read before judging.** Do not flag anything you have not opened. Every finding cites `path:line-range` and quotes or describes the evidence. If you cannot cite it, it does not go in the plan.

**Audit, don't refactor.** Produce the plan. Do not rewrite files during the audit, even when the fix is obvious. Obvious fixes go in the plan as low-effort items. The human decides.

**Prefer deletion.** The cheapest abstraction is the one removed. For every finding, ask first: can this be deleted? Then: merged? Then: renamed? Only then: extracted or restructured.

**Distinguish "works" from "understood."** Passing tests prove the former. Only a human explaining the code proves the latter. Your plan targets the latter.

**Never propose a rewrite.** "Rewrite this module" is not a plan; it is a wish. Every recommendation is an incremental, reversible step with an exit criterion.

**Do not add abstractions to fix abstractions.** If the codebase has a `BaseHandlerFactory` with one implementation, the answer is not `AbstractHandlerFactoryRegistry`. It is removing the factory.

**Do not introduce new AI tells while planning.** Your plan is itself a document a human must own. No filler, no hedged superlatives, no bullet lists of "benefits," no restating what the code does. Write the way a senior engineer writes a review: terse, specific, opinionated, cited.

**Calibrate.** Every finding carries a confidence. "This helper is unused" (grep-verifiable, high confidence) is different from "this abstraction is wrong" (judgment, medium). Say which.

**Ask, don't assume.** When a design decision could be intentional or accidental and you cannot tell, it goes in the Open Questions section, not in the findings as a smell.

---

## Part 2 — Phase 0: Orientation

Before hunting for smells, build the map. Spend real time here; findings without a map are noise.

### 2.1 Inventory

- Languages, frameworks, build system, package manager, test runner, CI config.
- Entry points: `main`, CLI commands, HTTP routes, scheduled jobs, message consumers. List every way execution begins.
- Directory tree annotated with one line per directory: what it is *for* (not what it's named).
- Line counts per module and per file. Note the distribution — AI codebases tend toward either many tiny files or a few enormous ones, rarely the middle.

### 2.2 Dependency graph

- Module import graph. Identify: cycles, modules everything imports (hubs), modules nothing imports (dead or entry points), modules imported by exactly one other module (candidates for inlining).
- External dependencies: for each, count call sites. A dependency used once is a finding.

### 2.3 History signals

Read `git log` if available. Look for:

- Enormous initial commits (thousands of lines in one go).
- Commit messages that are generic (`fix`, `update`, `changes`) or over-formatted (bulleted summaries, emoji, "This commit implements…").
- Chains of `fix X` → `fix X again` → `actually fix X` — a sign the author never had the model.
- Absence of reverts or deletions. Humans delete; sessions accrete.
- Style discontinuities that align with commit boundaries — each session was a different "author."

### 2.4 README versus reality

Read the README and any docs. Then verify each claim against the code. List every claim that is false, aspirational, or describes a feature that is stubbed. AI READMEs commonly describe the intended system, not the built one.

### 2.5 Run it

Build it. Run the tests. Run the main entry point. Record what actually works, what fails, and what silently does nothing. Silent no-ops are a high-priority finding.

**Exit criterion for Phase 0:** you can write a one-paragraph description of what this codebase does and a one-page map of how, without hedging.

---

## Part 3 — Phase 1: AI tells and smells catalog

These are the fingerprints. Some are harmless; most correlate with lack of ownership because they arise from generating code without a model of the whole. For each category, look, cite, and classify.

### 3.1 Comment tells

| Tell | Example | Why it matters |
|---|---|---|
| Narrating comments | `// Increment the counter` above `counter++` | Noise; hides the real comments |
| Section banners | `// ===== HELPERS =====` | Substitutes for structure that should be files/modules |
| Signature-restating docstrings | `"""Takes a user and returns the user's name."""` | Zero information; suggests no one knew *why* |
| Ceremonial markers | `# Note:`, `# Important:`, `# Edge case:` on trivial lines | Volume without judgment |
| Orphan TODOs | `TODO: implement properly` with no owner or ticket, present since initial commit | Stubs disguised as code |
| Change-log comments | `// Updated to handle null` | Belongs in git, signals no git discipline |
| Comments that lie | Comment describes behavior the code no longer has | Highest-severity comment tell |

### 3.2 Naming tells

- **Over-specified names:** `handleUserDataProcessingResultCallback`. Long names compensate for missing structure.
- **Generic containers:** `utils`, `helpers`, `common`, `misc`, `core`, `manager`, `processor`, `handler`, `service` used without a domain noun. Count them. A `utils/` with more than a few files is a missing-module finding.
- **Marketing adjectives:** `Enhanced`, `Advanced`, `Improved`, `Smart`, `Robust`, `V2`, `New`, `Final`. Each implies an older version that should have been deleted.
- **Vocabulary drift:** the same concept called `user`, `account`, `member`, `profile` in different files. Build a glossary of every synonym cluster. This is one of the strongest signals of multi-session generation.
- **Type-in-name:** `userList`, `dataDict`, `resultStr` in typed languages.
- **Boolean flags as parameters:** `process(data, isAsync=True, useCache=False, strict=True)` — each flag is a missing type or missing function.

### 3.3 Structural tells

- **Defensive over-validation:** null checks, type checks, and `isinstance` guards at every layer for values that cannot be null or wrong by construction. Trace one value through the stack and count how many times it is re-validated.
- **Swallowed exceptions:** `try: … except Exception: log(...); return None`. Every one is a place where failure becomes silent corruption. List them all.
- **Reimplemented standard library:** custom `deepMerge`, `chunk`, `retry`, `slugify`, `debounce` where the language or an already-present dependency provides it.
- **Single-use abstractions:** base classes with one subclass, interfaces with one implementation, factories that construct one type, config options with one value ever passed.
- **Speculative generality:** plugin systems, registries, hook points, and "extensibility" nothing extends.
- **Pass-through layers:** a `Service` that calls a `Repository` that calls a `Client`, each method a one-line delegation. Count the layers a single call traverses.
- **Impossible fallbacks:** `else` branches, default cases, and `or default_value` for conditions that cannot occur. These indicate the author didn't know the invariants.
- **Stubs and simulations:** functions returning hardcoded data, `mock_` or `fake_` implementations in production paths, `sleep()` standing in for real work, "for now" implementations.
- **Configuration sprawl:** environment variables, config keys, and constants that are read once, never changed, or never read at all.
- **Session seams:** places where two modules that must cooperate use different conventions (error styles, naming, async vs sync, logging) and an adapter or conversion layer bridges them. The seam is where two generation sessions met.

### 3.4 Duplication tells

AI duplication is rarely copy-paste identical; it is copy-*adapt*. Search for:

- Functions with the same shape and 10–20% variation — often the variation is a bug in one of them.
- The same operation implemented in two paradigms (a class and a set of functions; a sync and an async version that don't share logic).
- Parallel type definitions: the same shape declared as a dataclass, a TypedDict, a Pydantic model, and a plain dict in different modules.
- Multiple ways to do one thing: three date-parsing approaches, two HTTP clients, both `logging` and `print`.

For each cluster: list members, identify the canonical one (or note that none is), and note whether the variants differ in behavior.

### 3.5 Test tells

- **Tests that assert the mock:** the test mocks the dependency, calls the function, then asserts the mock was called. Nothing real was tested.
- **Tautologies:** `assert result == result`, `assert True`, `assert x is not None` as the sole assertion.
- **Tests written to pass:** expected values that were clearly copied from actual output rather than derived from a specification. Look for magic expected values with no explanation.
- **Implementation-detail tests:** tests that break on any refactor because they assert private state or call order.
- **Missing negative cases:** every test is a happy path. No test proves anything is *rejected*.
- **Fixture monoliths:** one giant fixture or setup used by every test, so no test documents what it actually needs.
- **Name-of-function tests:** `test_process_data`, `test_handle_request` — tests named for the function, not the behavior, so they don't specify anything.
- **Skipped or commented-out tests** with no explanation.
- Compute: what fraction of tests would survive a correct refactor of the module under test? That fraction is the real test coverage.

### 3.6 Error-handling tells

- Custom exception hierarchies (`BaseAppError` → `ServiceError` → `UserServiceError`) that are never caught by type anywhere.
- Errors matched by string content.
- Catch-all-log-continue at every layer, so one failure produces five log lines and no exception.
- Errors that are constructed but never raised, or raised but never caught.

### 3.7 Documentation tells

- README claims: "production-ready," "robust," "comprehensive," "scalable," "enterprise-grade." Each one is a claim to verify and almost always a finding.
- Emoji section headers, feature bullet lists, "Getting Started" sections that don't work.
- Architecture docs that describe layers the code does not have.
- Docs volume disproportionate to code volume, or the reverse.

### 3.8 Dependency tells

- Unused imports (mechanically detectable; list them all, it's free).
- Dependencies added for one function call that the stdlib covers.
- Dependencies with overlapping purposes (two HTTP clients, two validation libraries).
- Pinned to versions that don't exist, or unpinned entirely.

### 3.9 The "sycophantic code" pattern

Watch for code that is *over-careful* in a way that reads as trying to satisfy a reviewer rather than model a domain: redundant type coercions (`str(str(x))`), null-checks on values just constructed, `.copy()` on immutables, `isinstance` checks immediately after a type annotation guarantees the type, wrapping every function body in try/except. These are not bugs. They are the residue of generating without conviction, and they make the real invariants invisible.

---

## Part 4 — Phase 2: Complexity assessment

Separate **essential** complexity (the problem is hard) from **accidental** complexity (the code made it hard). The plan attacks only the latter.

### 4.1 Measure

Gather, per file and per function where tooling allows:

- Cyclomatic complexity; flag functions above ~15.
- Function length; flag above ~60 lines.
- Parameter count; flag above 5.
- Nesting depth; flag above 4.
- Fan-in (who calls this) and fan-out (what this calls).
- Git churn if history exists.

### 4.2 Locate hotspots

Hotspot score = complexity × churn × centrality (fan-in). Rank. The top ten are where the human will spend most of their time; they get the deepest analysis.

### 4.3 Classify each complexity finding

| Class | Description | Typical fix |
|---|---|---|
| **Incidental** | Complexity from poor structure, not the problem | Restructure |
| **Defensive** | Guards and fallbacks for impossible states | Delete after establishing invariants |
| **Speculative** | Machinery for futures that never came | Delete |
| **Duplicative** | Same logic in multiple places, each slightly different | Merge to one canonical version |
| **Layering** | Indirection with no decision at each layer | Collapse |
| **Essential** | The domain is actually this complicated | Document, isolate, name |

For essential complexity, the finding is not "reduce it" but "this is the hard part; it needs a name, a boundary, and a paragraph of explanation."

### 4.4 Trace three real paths

Pick three representative operations (a common one, a rare one, an error one). Trace each from entry point to effect, listing every function and layer touched. Record: how many files, how many layers, how many places a decision is actually made versus merely forwarded. This trace is the single most useful artifact for the human owner.

---

## Part 5 — Phase 3: Missing abstractions

AI code tends to have abstractions in the wrong places: too many where they cost nothing to generate (base classes, factories, wrappers) and too few where they require domain understanding (types that encode invariants). Your job here is to find the concepts the code is *using* but has not *named*.

### 5.1 Detection patterns

| Symptom | Missing abstraction |
|---|---|
| Same 3–4 parameters always travel together | A struct / record / value object |
| Tuples or dicts with fixed shape passed around | A named type |
| String values compared against a fixed set (`if status == "active"`) | An enum, or a state machine if transitions matter |
| Same validation repeated at multiple entry points | A type that is valid by construction |
| `if isinstance(x, A): … elif isinstance(x, B): …` cascades | Polymorphism, or a tagged union |
| Parallel arrays / dicts indexed by the same key | A collection of records |
| Functions that all take a "context" or "config" dict and read different keys | Several distinct types hiding in one bag |
| Boolean parameters that select behavior | Separate functions, or a strategy type |
| Duck-typed protocols everyone follows implicitly | An explicit interface |
| Scattered invariant checks (`assert len(x) == len(y)`) | A type whose constructor enforces the invariant |
| Every caller performs the same 3 steps before calling | The function is missing its own first three lines |
| Unit confusion (seconds vs ms, cents vs dollars, ids of different entities as the same type) | Newtypes / branded types |

### 5.2 Concept extraction

Independently of the code's structure, list the **domain nouns** (things the system is about) and **domain verbs** (things it does to them). Then for each noun: where does it live? Is it a type? Is it one type, or four? For each verb: is it one function, or is it smeared across five?

A noun with no type is a missing abstraction. A noun with four types is a missing *canonical* abstraction. A verb spread across many places is a missing operation.

### 5.3 Wrong abstractions (the inverse)

For every existing abstraction (class, interface, base class, module boundary), ask:

- How many implementations / users / callers?
- Does it make a decision, or only forward?
- Could it be inlined with no loss?
- Does its name match what it does?

An abstraction that fails these is a **wrong abstraction** and belongs in the plan as a deletion, which is often the prerequisite for introducing the *right* one.

### 5.4 For each proposed abstraction, specify

- Proposed name (domain vocabulary, not technical).
- Responsibility in one sentence.
- What existing code it would absorb (cite every location).
- What it would make impossible (the invariant it encodes).
- What it does *not* do (to prevent it becoming a new `utils`).

Do not propose more than the codebase needs. A good outcome is often three to seven new types and the removal of twice that many existing ones.

---

## Part 6 — Phase 4: Knowledge reconstruction

The human cannot own what was never explained. Reconstruct the missing "why."

- **Decision log:** for every non-obvious design choice you found (why this library, why this layering, why this data shape), record: what was chosen, what the plausible alternatives were, whether the choice appears deliberate or accidental, and whether it should be revisited.
- **Invariants:** every rule the code assumes but never states. ("Orders always have at least one line item." "IDs are globally unique across tables." "This is never called concurrently.") Extract them from the defensive checks, the fallbacks, and the tests.
- **Unexplainable list:** code you could not determine the purpose of after reasonable effort. This goes to the human as a question, not a finding.
- **Concept map:** the five to fifteen core concepts and the relationships between them. One page. This is the thing the human must be able to redraw from memory.

---

## Part 7 — The deliverable: plan format

Produce a single document with these sections, in this order.

### 7.1 Ownership summary

Half a page. What the system does, its actual state versus documented state, and an ownership readiness assessment against the five criteria in the introduction. Be blunt.

### 7.2 Codebase map

Directory annotations, entry points, dependency graph summary, the three traced paths, the concept map.

### 7.3 Findings register

One entry per finding. Required fields:

```
ID:          F-042
Category:    tell | smell | complexity | missing-abstraction | wrong-abstraction | knowledge-gap
Subcategory: e.g. "duplication / copy-adapt", "structural / single-use abstraction"
Location:    src/orders/processor.py:112-180  (+ every other location if a cluster)
Evidence:    Two-sentence description, or a short excerpt
Severity:    critical | high | medium | low
Confidence:  high | medium | low   (and one clause on why)
Effort:      S | M | L
Action:      delete | merge | rename | extract | inline | document | ask-owner
Detail:      What specifically to do, and what should be true afterward
Depends on:  F-017 (if ordering matters)
```

Severity rubric:
- **Critical:** silent data corruption, swallowed errors on real paths, stubs in production paths, security-relevant defensive gaps.
- **High:** blocks understanding of a hotspot; duplication with divergent behavior; missing abstraction touching many call sites.
- **Medium:** local confusion; single-use abstractions; test tells in important modules.
- **Low:** cosmetic; comment noise; naming in leaf code.

### 7.4 Missing and wrong abstractions

The Part 5 output: proposed types with the five-field spec, and existing abstractions marked for removal, cross-referenced to findings.

### 7.5 Sequenced plan

Waves, each with entry conditions, contents (finding IDs), and an exit criterion the human can verify. A default sequence that usually works:

**Wave 0 — Safety net.** Characterization tests around the hotspots, capturing *current* behavior including bugs. CI runs them. Nothing else changes until this passes. *Exit:* any refactor that changes observable behavior fails a test.

**Wave 1 — Subtract.** Dead code, unused deps, unused imports, single-use abstractions, speculative machinery, impossible fallbacks, stubs. Deletion only. *Exit:* line count down, tests green, nothing added.

**Wave 2 — Unify.** Duplication clusters merged to canonical versions; vocabulary drift resolved to one glossary; one way to do each thing. *Exit:* glossary has no synonyms; each duplication cluster has one member.

**Wave 3 — Name.** Introduce the missing abstractions, one at a time, each absorbing the code it was specified to absorb. Renames to domain vocabulary. *Exit:* every domain noun has one type; every proposed abstraction landed or was explicitly rejected.

**Wave 4 — Explain.** Rewrite docs to match reality. Record the decision log. Delete narrating comments; add the missing "why" comments. Replace tautological tests with behavioral ones. *Exit:* a new engineer can pass the "Definition of done" below.

Adjust the waves to the codebase, but keep the order: safety before subtraction, subtraction before addition.

### 7.6 Open questions for the owner

Every place you could not tell intentional from accidental. Phrased as a question with the two interpretations and what you'd recommend under each.

### 7.7 Risk register

What could go wrong in each wave, how you'd detect it, and what the rollback is.

### 7.8 Do-not-touch list

Code that is complex for essential reasons, or that you lack confidence about, or that is load-bearing in ways the tests don't capture. Explicitly protecting it prevents the human from spending effort where it isn't warranted.

---

## Part 8 — Definition of done

The codebase is human-owned when a competent engineer with no prior exposure can, after one day with the code and the plan's outputs:

- [ ] Draw the concept map from memory.
- [ ] Name the file where each core concept lives, without searching.
- [ ] Trace a request from entry to effect in under ten minutes.
- [ ] State the three most important invariants.
- [ ] Say what would break if any given module were deleted.
- [ ] Explain why each external dependency is present.
- [ ] Find no function whose purpose they cannot state in one sentence.
- [ ] Find no comment that restates the code beneath it.
- [ ] Make a small feature change and predict which tests will be affected, correctly.

If the plan is executed and any box stays unchecked, the plan was incomplete. Say which criteria your plan does not yet address.

---

## Appendix A — Quick-scan checklist

Run these mechanically before deep reading; they are cheap and often account for a third of the findings.

- Unused imports, unused functions, unused exports (linter / dead-code tool).
- Files over 500 lines; functions over 60 lines.
- Every `except Exception`, `catch (e)`, `rescue` — list and classify.
- Every `TODO`, `FIXME`, `XXX`, `HACK`, "for now", "temporary", "placeholder", "mock", "simulate", "dummy".
- Every `utils`, `helpers`, `common`, `misc` directory — inventory contents.
- Every class with exactly one subclass; every interface with one implementation.
- Every parameter that is a boolean.
- Every string literal compared with `==` more than twice.
- Every dependency with fewer than three call sites.
- Every test with a single assertion, or whose only assertion is on a mock.
- Every README claim, checked.
- Grep for adjectives: `enhanced`, `advanced`, `improved`, `robust`, `comprehensive`, `smart`, `v2`, `new`, `final`, `legacy`.

## Appendix B — Example finding

```
ID:          F-017
Category:    missing-abstraction
Subcategory: primitive obsession / stringly-typed state
Location:    src/orders/processor.py:44,89,131; src/orders/api.py:22;
             src/billing/reconcile.py:77; src/notifications/send.py:15
Evidence:    Order status is a free string compared against "pending",
             "paid", "shipped", "cancelled" in six places. Two places
             also accept "canceled" (one L). reconcile.py:77 checks
             for "complete", which is never assigned anywhere.
Severity:    high
Confidence:  high — all sites enumerated by grep; the "complete" branch
             is verifiably dead
Effort:      M
Action:      extract
Detail:      Introduce OrderStatus enum with the four real states and
             an explicit transition table (pending→paid→shipped;
             pending|paid→cancelled). Replace string comparisons at all
             six sites. Delete the "complete" branch. Add one test per
             illegal transition. Afterward, an invalid status is a type
             error, not a runtime surprise.
Depends on:  F-003 (characterization tests for processor.py)
```

## Appendix C — Tone guide for the plan itself

The plan is read by a human who has to trust it. Write it so it earns trust:

- Lead with the finding, not with context.
- One claim per sentence. Cite it.
- Say "delete this" rather than "consider whether this might be removable."
- Say "I don't know" where you don't.
- No section exists to be complete; every section exists because the human needs it. If a section would be empty, omit it and say so in one line.
