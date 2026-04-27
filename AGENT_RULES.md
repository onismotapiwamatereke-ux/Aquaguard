# AGENT_RULES.md — Token Efficiency & File Safety Protocol

## 1. Read Before Write
  - Always read a file's current content before editing it.
  - If the required change is < 5 lines, use targeted str_replace;
    never rewrite the whole file.

## 2. Immutable Files (Never Edit Without Explicit User Instruction)
  - package-lock.json / yarn.lock / pnpm-lock.yaml
  - vite.config.ts (unless the task explicitly requires a build change)
  - tailwind.config.ts (unless the task is a theming task)
  - .env / .env.local
  - AGENT_RULES.md itself
  - water_pollution_disease.csv (source of truth — read only)

## 3. Token Budget Rules
  - Recon phase: summarise files; do not dump full file contents to context.
  - For files > 150 lines, read only the relevant section unless the
    whole file is under active edit.
  - Prefer targeted line-range reads over full-file reads.

## 4. Edit Scope Minimisation
  - One task = one concern. Never bundle unrelated changes in one session.
  - When editing a component, touch ONLY that component file and its
    direct co-located test/story unless an import path must change.
  - Do not reformat code outside the edited block.

## 5. Validation Before Closing a Task
  - After every new TypeScript type, confirm no `any` was introduced.
  - After every new data utility, confirm Zod validation is applied at
    the data boundary (parse entry point), not deep inside components.
  - After every new dependency, add a one-line justification comment
    in the file that first uses it: `// dep: <package> — <reason>`

## 6. Banned Patterns
  - No `any` TypeScript type — use `unknown` + type guard if unsure.
  - No unvalidated CSV/JSON data passed directly into component state.
  - No inline `fetch` calls inside React components — always via hooks
    or utility functions.
  - No deletion of TODO comments without resolving or escalating them.
  - No mass Prettier/ESLint auto-format runs on unrelated files.

## 7. Changelog Discipline
  - Append one line to `project_wiki.md § 13. Changelog` after every
    session that modifies a file.
  - Format: `YYYY-MM-DD | [files changed] | [one-line summary]`
