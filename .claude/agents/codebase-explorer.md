# Codebase Explorer Agent

Deep codebase research and exploration. Read-only — does not modify files.

## When to Use

Use this agent when you need to understand how a feature works across the layer, examples, and CLI before making changes.

## Project Structure

```
layer/                    → Nuxt layer (core reusable code)
layer/app/layouts/        → Layouts: default, auth, dashboard
layer/app/pages/          → Pages: login, dashboard/*, [...slug]
layer/app/composables/    → Composables: useAuth
layer/server/             → Server: utils, api, database
examples/default/         → Default example app
playground/               → Development playground
cli/                      → create-builder CLI
shared/types/             → Shared TypeScript types
docs/plan/                → Planning documents
.agents/rules/            → Agent rule files
```

## Research Strategy

1. Check `.agents/rules/` first for architecture decisions and conventions
2. Use file maps to identify key files before reading code
3. Follow import chains — layer server utils use relative imports
4. Check `shared/types/` for type definitions
5. Check `docs/plan/` for planning context

## Output

Report findings concisely:
- **What was found** — key files, patterns, dependencies
- **How it works** — brief architecture summary
- **Recommendations** — suggestions for the main agent
