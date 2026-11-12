# skills

## Install as a plugin

```sh
/plugin marketplace add IAmRadek/skills
/plugin install radek-skills@iamradek-skills
```

## Workflow

The skills follow a path from a problem to code. Each step writes a disposable brief in `.notes/` that the next step reads.

1. `roadmap`: decide what to build next, at the product level.
2. `discover`: explore the problem with concrete examples. Mark each fact as confirmed, to check, or assumed.
3. `understand`: learn the current system that the work touches.
4. `architecture`: compare solutions under the forces, with balanced coupling for boundaries.
5. `pairing` to write the code now, or `spec` to write it down for an agent or for later.

Use `spike` at any step to answer one open question with disposable code.

## Credits

The `architecture`, `debug`, and `code-review` skills are inspired by the engineering plugin in [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins).

