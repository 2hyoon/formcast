# Formcast

A developer tool that turns a JSON Schema into a live form with real-time
validation. Paste a schema on the left, see the form it produces — and how it
validates input — on the right.

> **What this repo really is.** Formcast is the *sample build target* for
> **Harness**, a spec-driven workflow for letting an AI agent implement a
> project autonomously, step by step, inside guardrails. The schema/validation
> logic in `src/lib/` is written by hand on purpose: the value here is the
> process and the learning, not competing with existing form libraries (see
> [Why build this by hand?](#why-build-this-by-hand)).

---

## The two layers

This repository has two parts that serve different purposes.

### 1. Harness — the workflow (the real subject)

Harness is a lightweight framework for breaking a project into small,
self-contained **steps**, then running them sequentially with an executor that
injects guardrails, accumulates context, self-corrects on failure, and commits
the result.

- `docs/` — the project's intent: `PRD.md`, `ARCHITECTURE.md`, `ADR.md`, `UI_GUIDE.md`
- `phases/` — task plans. Each task is a directory of `step{N}.md` files plus an
  `index.json` tracking status.
- `scripts/execute.py` — the executor. Runs each step in its own agent session.

Run a task:

```bash
python3 scripts/execute.py 0-mvp          # run steps sequentially
python3 scripts/execute.py 0-mvp --push   # run, then push
```

The executor automatically:

- creates/checks out a `feat-{task}` branch
- injects `CLAUDE.md` + `docs/*.md` into every step prompt as guardrails
- passes each completed step's summary forward as context
- retries up to 3 times on failure, feeding the previous error back in
- commits code (`feat:`) and metadata (`chore:`) separately
- records timestamps (`started_at`, `completed_at`, etc.)

### 2. Formcast — the app (the build target)

Formcast is what Harness was pointed at. It exercises a clean layered
architecture: pure logic in `src/lib/`, types in `src/types/`, presentational
components in `src/components/`, and a single page that wires it all together.

#### What it does

- **Two-pane layout** — schema editor on the left, live form on the right.
- **Instant re-render** — editing the schema immediately rebuilds the form.
- **Real-time validation** — each field shows its own error below it.
- **Result JSON** — the validated values render at the bottom with a copy button
  (enabled only when validation passes).
- **Presets** — example schemas load on entry so there's no blank screen.

#### Supported JSON Schema subset (MVP)

- Types: `string`, `number`, `boolean`, `enum` (rendered as a select)
- Constraints: `required`, `minLength`, `maxLength`, `minimum`, `maximum`, `pattern`
- Metadata: `title` (label), `description` (hint)
- **Flat (one-level) object schemas only**

Out of scope for the MVP: nested objects, arrays, `$ref`, `allOf`/`oneOf`/`anyOf`,
conditional schemas, persistence, sharing, and auth.

---

## Why build this by hand?

Schema-to-form is a solved, crowded space — libraries like
[react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form),
[JSON Forms](https://jsonforms.io/), Formily, and uniforms already do this well.
Formcast deliberately uses **none** of them.

That constraint is the point. The reason this project exists is the hand-written
parsing and validation logic in `src/lib/`. Replacing it with a library would
erase the learning and portfolio value, and make the unit tests and
self-correction loop meaningless. The scope is kept to a flat subset so the
resolver / validator / renderer layering is clearly demonstrable without
drowning in spec coverage.

If you just need a production form generator, use one of the libraries above.
If you want to understand how one works, read `src/lib/`.

---

## Tech stack

- Next.js 15 (App Router) — single client page, no API routes
- TypeScript (strict)
- Tailwind CSS
- Vitest — unit tests for the pure logic in `src/lib/`

State is managed with React `useState` only; derived data (fields, errors) is
computed during render by pure functions, never stored.

## Project structure

```
src/
├── app/          # the single page ("use client")
├── components/   # FieldInput — renders one field, props-only
├── types/        # shared types (schema, field, validation result)
└── lib/          # pure logic: resolver, validator, presets (unit-tested)

docs/             # PRD, ARCHITECTURE, ADR, UI_GUIDE
phases/           # Harness task plans and step files
scripts/          # Harness executor
```

### Data flow

```
[schema text]
   │  JSON.parse + shape check
   ▼
resolver (lib/, pure)  ──parse error──▶ schema error (left panel)
   │  normalized fields [{ key, kind, label, hint, constraints }]
   ▼
FieldInput (components/)  ◀── user input (useState)
   │
   ▼
validator (lib/, pure)  ── values + constraints → per-field errors
   │
   ▼
[result JSON + copy button]
```

## Commands

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build (outputs to .next-prod)
npm run lint     # ESLint
npm run test     # Vitest (vitest run --passWithNoTests)
```

> **Note on `build`.** The build output is routed to `.next-prod` (via
> `NEXT_DIST_DIR`) instead of the default `.next`. A Stop hook runs
> `npm run build` after each session, and routing it to a separate directory
> keeps it from clobbering the chunks of a running `npm run dev` server.

## Status

The `0-mvp` task is complete: types, resolver, validator, presets, the
`FieldInput` component, and the two-pane page — all built by Harness, with 21
unit tests passing. Possible next directions (e.g. accessibility hardening,
`enum` as radio groups, more field types) are discussed but not yet planned.
