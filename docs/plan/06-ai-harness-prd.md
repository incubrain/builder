# PRD: AI Development Harness (Standalone Product)

> Status: HIGH-LEVEL PLAN — to be handed off to an agent for detailed design later.

---

## Vision

The AI Development Harness is Incubrain's **velocity multiplier** — a self-contained, versionable, distributable system that makes any coding agent (Claude Code, Cursor, Windsurf, Copilot, etc.) immediately productive in a project.

It is currently embedded in Foundry and planned for Builder. It should be **extracted into its own product** so it can:

1. Be developed, tested, and versioned independently
2. Be added to any repository via CLI (`npx @incubrain/harness init`)
3. Be upgraded in-place (`npx @incubrain/harness upgrade`)
4. Maintain a changelog users can follow
5. Support multiple AI agents from a single source of truth

---

## Goals

### Primary
- **Zero-context development**: Any AI agent can start coding in a project without asking the developer a single question about setup, patterns, or conventions.
- **Consistency**: All Incubrain projects (Foundry, Builder, client work) share the same harness architecture, reducing maintenance burden.
- **Upgradability**: Users get harness improvements (new skills, better rules, hook enhancements) without manual file surgery.

### Secondary
- **Agent-agnostic**: Works with Claude Code, Cursor, Windsurf, and any future agent. One source of truth, multiple agent entry points.
- **Extensible**: Projects add custom rules and skills on top of the shared harness without conflicting with upgrades.
- **Community**: External teams can use, contribute to, and extend the harness.

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time to first productive agent session | < 5 minutes from clone | Manual test: clone → install → agent understands project |
| Agent accuracy on common tasks | 90%+ first-attempt success | Track agent task outcomes across Foundry/Builder |
| Upgrade success rate | 95%+ clean upgrades | Test upgrades across repos with varying levels of customization |
| Adoption across Incubrain projects | 100% of active repos | Audit |
| Agent types supported | 3+ (Claude Code, Cursor, +1) | Feature parity test across agents |

---

## Architecture

### Core Components

```
@incubrain/harness (npm package)
├── templates/                    # Default file templates
│   ├── AGENTS.md                 # Root agent entry point
│   ├── rules/
│   │   ├── architecture.md       # Base architecture rules
│   │   ├── conventions.md        # Base code conventions
│   │   └── decisions.md          # Empty decision log template
│   ├── agents/                   # Default sub-agent definitions
│   ├── settings.json             # Base permissions + hooks
│   └── skills.json               # Core skills manifest
├── scripts/
│   └── install-skills.sh         # Multi-agent skill installer
├── cli/                          # Harness management CLI
│   ├── init.ts                   # Initialize harness in a repo
│   ├── upgrade.ts                # Upgrade harness files in-place
│   ├── status.ts                 # Show harness health/version
│   └── diff.ts                   # Show what would change on upgrade
└── skills/                       # Core skills (committed, shipped with package)
```

### File Layout in a Target Repo (after `init`)

```
target-repo/
├── .agents/
│   ├── rules/                    # Committed rules
│   │   ├── architecture.md       # Harness-provided (managed)
│   │   ├── conventions.md        # Harness-provided (managed)
│   │   ├── decisions.md          # User-owned (never overwritten)
│   │   └── [custom].md           # User-added (never touched)
│   └── skills/                   # Gitignored, installed by script
├── .claude/
│   ├── CLAUDE.md -> ../AGENTS.md
│   ├── rules/ -> ../.agents/rules/
│   ├── skills/ -> ../.agents/skills/
│   ├── agents/                   # Sub-agent definitions
│   ├── settings.json             # Merged: harness base + user overrides
│   └── skills.json               # Merged: harness core + user additions
├── AGENTS.md                     # Project-specific (user-owned)
├── scripts/
│   └── install-skills.sh         # From harness (managed)
├── skills/                       # Committed custom skills (user-owned)
└── .harness.json                 # Harness metadata (version, managed files list)
```

### Managed vs User-Owned Files

This is the **critical architectural challenge**. The harness must know which files it owns (can update) vs which the user owns (must not overwrite).

```json
// .harness.json
{
  "version": "0.3.0",
  "managed": [
    ".agents/rules/architecture.md",
    ".agents/rules/conventions.md",
    "scripts/install-skills.sh",
    ".claude/agents/implementer.md",
    ".claude/agents/reviewer.md"
  ],
  "merged": [
    ".claude/settings.json",
    ".claude/skills.json"
  ],
  "userOwned": [
    "AGENTS.md",
    ".agents/rules/decisions.md",
    "skills/**"
  ]
}
```

| Category | Behavior on Upgrade |
|----------|-------------------|
| **managed** | Overwritten with latest version. User should not edit these. |
| **merged** | Base from harness + user additions merged. User's `allow`/`deny` entries preserved, harness entries updated. |
| **userOwned** | Never touched. Created on `init` only if missing. |

---

## CLI Commands

### `npx @incubrain/harness init`

- Scaffolds the full harness file structure
- Creates symlinks (`.claude/rules/` → `.agents/rules/`, etc.)
- Writes `.harness.json` with version and file manifest
- Runs `install-skills.sh` for initial skill installation
- Does NOT overwrite existing files (asks to merge or skip)

### `npx @incubrain/harness upgrade`

- Reads `.harness.json` to determine current version
- Fetches latest harness version
- For **managed** files: overwrites with latest
- For **merged** files: performs 3-way merge (base → current → new)
- For **userOwned** files: skips entirely
- Updates `.harness.json` version
- Outputs changelog of what changed

### `npx @incubrain/harness status`

- Shows current harness version vs latest available
- Lists managed files and their sync status (up-to-date, outdated, modified)
- Lists user-owned files
- Warns about any structural issues (missing symlinks, etc.)

### `npx @incubrain/harness diff`

- Shows what `upgrade` would change, without applying
- Useful for reviewing before upgrading

---

## Critical Design Challenges

### 1. Merge Strategy for `settings.json` and `skills.json`

These files have harness-provided entries AND user-added entries. On upgrade, we need to:
- Update harness-provided entries to latest
- Preserve user-added entries
- Handle conflicts (user modified a harness entry)

**Approach:** Store harness entries under a known key or use comments/markers. Or maintain a `settings.base.json` (harness) and `settings.local.json` (user) that get merged at runtime. The current Foundry pattern already uses `settings.local.json` for developer overrides — this maps cleanly.

### 2. AGENTS.md is Project-Specific

The root `AGENTS.md` contains project-specific information (quick start commands, architecture summary, file locations). The harness can provide a **template** on init, but must never overwrite it.

**Approach:** `AGENTS.md` is always user-owned. The harness provides a well-structured template with clear sections that the user fills in. Could include marker comments that the upgrade command can use to inject new sections without touching existing content.

### 3. Skills Versioning

Skills come from external repos and are installed by the script. The harness's `skills.json` defines which skills to install, but skill content changes independently.

**Approach:** `skills-lock.json` (already in Foundry) tracks skill hashes. The harness manages the manifest; skill content is always fetched fresh on install.

### 4. Multi-Agent Support

Different agents have different directory structures (`.claude/`, `.cursor/`, `.windsurf/`). The harness needs to maintain parity.

**Approach:** Already solved in Foundry — `install-skills.sh` accepts an agent name and maps it to the correct directory. Symlinks point all agent dirs to `.agents/` as the single source.

---

## Versioning & Changelog

- Semantic versioning: `MAJOR.MINOR.PATCH`
  - MAJOR: Breaking changes to file structure or merge behavior
  - MINOR: New rules, skills, agent definitions, hook improvements
  - PATCH: Bug fixes, typo fixes, clarifications
- `CHANGELOG.md` in the harness repo
- `npx @incubrain/harness status` shows current vs latest version

---

## Phased Rollout

### Phase 1: Extract from Foundry
- Copy current harness files into standalone `@incubrain/harness` package
- Build `init` command that replicates current manual setup
- Test: init into a fresh repo, verify agent functionality matches Foundry

### Phase 2: Upgrade Command
- Build `upgrade` with managed/merged/userOwned distinction
- Build `.harness.json` tracking
- Test: upgrade across Foundry and Builder repos

### Phase 3: Builder Integration
- Builder's harness comes from `@incubrain/harness` instead of bespoke files
- Builder adds project-specific rules as user-owned files on top

### Phase 4: Community Release
- Documentation, examples, contribution guidelines
- Support for custom rule/skill registries
- Plugin system for project-type-specific rule sets (Nuxt, Next.js, Go, etc.)

---

## Open Questions (for future detailed design)

1. **Should managed files support user overrides?** E.g., user wants to modify `architecture.md` — should there be a `.override` mechanism, or should they just add a separate rule file?

2. **Runtime merge vs build-time merge for settings.json?** Foundry uses `settings.json` + `settings.local.json` already. Should the harness formalize this as the merge strategy?

3. **Should the harness include a "project type" concept?** E.g., `--type nuxt`, `--type node`, `--type go` that includes different base rules and skills per ecosystem?

4. **How to handle the AGENTS.md ↔ CLAUDE.md symlink on Windows?** Git symlinks on Windows require developer mode or specific git config. May need a fallback (copy instead of symlink, or a post-install script).

5. **Should the harness be a Nuxt module?** For Nuxt projects specifically, being a module would allow auto-setup via `nuxi module add`. But this limits it to Nuxt only, conflicting with the agent-agnostic goal.
