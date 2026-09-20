# Phase 00 — Foundation, Versioning, Tooling, and Pack Skeleton

> Project: **Minecraft Warchief Village Bedrock Add-On**  
> Namespace: `warchief`  
> Phase objective: create a clean, version-correct, script-ready Bedrock Add-On foundation before implementing gameplay.

---

# 1. Target Platform Decision

## 1.1 Target Bedrock release

For this project, target the latest current **retail/stable Bedrock Creator platform** documented by Microsoft at the time this phase is executed.

At the time this document was prepared:

- **Minecraft Bedrock:** `1.26.40`
- **Stable Script API:** `@minecraft/server` `2.9.0`

Microsoft's 1.26.40 creator update notes explicitly state that Bedrock 1.26.40 ships stable `@minecraft/server` v2.9.0.

**Do not use beta Script API unless a required feature is proven impossible with the stable API.**

### Important versioning rule

Minecraft uses multiple independent version numbers.

Do **not** blindly set every JSON `format_version` to `1.26.40`.

Microsoft explicitly documents that:

- Behavior/Resource Pack `manifest.json` should use `format_version: 2`.
- `min_engine_version` should target a current supported game version.
- Entity JSON format versions are variable.
- Behavior/Resource animation controllers generally use `1.10.0`.
- Resource Pack models generally use `1.12.0`.
- Render controllers generally use `1.10.0`.
- Script API has its own module version independent of the game version.

Therefore Phase 00 must establish a **version policy**, not a single global version string.

Recommended initial policy:

| Content | Recommended Phase 00 value |
|---|---|
| Bedrock runtime target | `1.26.40` |
| BP/RP manifest format | `2` |
| BP/RP `min_engine_version` | `[1, 26, 40]` |
| `@minecraft/server` | `2.9.0` stable |
| Animation / animation controller format | use documented format for that file type, commonly `1.10.0` |
| Geometry/model format | use documented current compatible version, commonly `1.12.0` |
| Entity format | choose per entity definition / latest valid schema; validate before raising to `1.26.40` |

Minecraft 1.26.40 introduced stricter entity JSON validation for entities authored with `format_version` 1.26.40 or later. Codex must not raise entity format versions mechanically without checking the schema.

---

# 2. Official Documentation References

Codex should use these as primary technical references.

## Platform and Versioning

**Minecraft Bedrock 1.26.40 Creator Update Notes**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.26.40?view=minecraft-bedrock-stable

**Latest Platform Version Guidance**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/practices/latestplatformversion?view=minecraft-bedrock-stable

## Packs and Manifests

**Introduction to Behavior Packs**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/behaviorpack?view=minecraft-bedrock-stable

**Manifest Reference**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/addonsreference/packmanifest?view=minecraft-bedrock-stable

## Entities

**Entity Behavior Introduction**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/entitybehaviorintroduction?view=minecraft-bedrock-stable

**Creating New Entity Types**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoaddentity?view=minecraft-bedrock-stable

**Client Entity JSON**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/cliententitydocumentation/cliententitydocumentationintroduction?view=minecraft-bedrock-stable

## Animations

**Animations Overview**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/animations/animationsoverview?view=minecraft-bedrock-stable

**Animation Controllers Reference**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/animations/animationcontroller?view=minecraft-bedrock-stable

## Script API

**Scripting Introduction**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/introduction?view=minecraft-bedrock-stable

---

# 3. Phase 00 Principles

Phase 00 must establish:

1. A valid Behavior Pack.
2. A valid Resource Pack.
3. A stable Script API environment.
4. A maintainable repository structure.
5. A repeatable build/deploy workflow.
6. A content-log-first debugging workflow.
7. A clean place for Phase 01 prototype overrides.
8. No gameplay implementation beyond smoke tests.

Phase 00 must **not** implement:

- Villager Soldier gameplay.
- Mercenary gameplay.
- Military Token.
- Trading expansion.
- Raids.
- World generation.
- Final art.
- Final balancing.

---

# 4. Recommended Repository Structure

Use this repository structure:

```text
minecraft-warchief-village-bedrock/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
│
├── docs/
│   ├── 01_GAME_CONCEPT.md
│   ├── 02_IMPLEMENTATION_AND_ARCHITECTURE.md
│   ├── 03_ASSET_AND_PREPARATION_CHECKLIST.md
│   ├── 04_EXECUTION_PLAN_AND_ACCEPTANCE_CRITERIA.md
│   ├── Phase_00_Foundation_and_Versioning.md
│   └── Phase_01_Vanilla_Prototype_Units.md
│
├── behavior_pack/
│   ├── manifest.json
│   ├── pack_icon.png
│   ├── entities/
│   ├── items/
│   ├── animation_controllers/
│   ├── animations/
│   ├── functions/
│   ├── loot_tables/
│   ├── spawn_rules/
│   ├── trading/
│   ├── texts/
│   │   ├── languages.json
│   │   └── en_US.lang
│   └── scripts/
│       └── main.js
│
├── resource_pack/
│   ├── manifest.json
│   ├── pack_icon.png
│   ├── entity/
│   ├── models/
│   │   └── entity/
│   ├── animations/
│   ├── animation_controllers/
│   ├── render_controllers/
│   ├── attachables/
│   ├── textures/
│   │   ├── entity/
│   │   └── items/
│   ├── sounds/
│   └── texts/
│       ├── languages.json
│       └── en_US.lang
│
├── src/
│   └── main.ts
│
├── scripts/
│   ├── build.sh
│   └── validate.sh
│
└── dist/
```

Notes:

- Empty folders do not have to be committed if Git ignores them.
- Use `.gitkeep` only if repository clarity benefits from it.
- `src/` contains TypeScript source.
- `behavior_pack/scripts/` contains generated JavaScript consumed by Minecraft.
- `dist/` is for packaged `.mcpack` / `.mcaddon` output later.
- Avoid putting implementation source only inside generated folders.

---

# 5. Manifest Strategy

Use **manifest format version 2** for stable Behavior Pack and Resource Pack manifests.

Generate unique UUIDs.

Never reuse:
- BP header UUID as module UUID.
- RP header UUID as module UUID.
- UUID from another project.

Example UUIDs below are placeholders for this project and may be replaced once at repository initialization.

---

# 6. Behavior Pack Manifest Template

Recommended Phase 00 `behavior_pack/manifest.json`:

```json
{
  "format_version": 2,
  "header": {
    "name": "Warchief Village BP",
    "description": "Behavior Pack for the Warchief Village Add-On",
    "uuid": "d2cce88a-4698-4cde-97af-d967ad61e579",
    "version": [0, 1, 0],
    "min_engine_version": [1, 26, 40]
  },
  "modules": [
    {
      "type": "data",
      "uuid": "94a42a9a-7e56-466e-831f-c0a31c77ee75",
      "version": [0, 1, 0]
    },
    {
      "type": "script",
      "language": "javascript",
      "uuid": "4f897f7d-2c25-45f0-a488-88b747111b46",
      "version": [0, 1, 0],
      "entry": "scripts/main.js"
    }
  ],
  "dependencies": [
    {
      "uuid": "992535e0-3a03-4caf-94bb-b8456b63cc52",
      "version": [0, 1, 0]
    },
    {
      "module_name": "@minecraft/server",
      "version": "2.9.0"
    }
  ],
  "metadata": {
    "authors": [
      "Ibrahim Hasan"
    ]
  }
}
```

The Resource Pack UUID dependency above must match the Resource Pack header UUID exactly.

---

# 7. Resource Pack Manifest Template

Recommended Phase 00 `resource_pack/manifest.json`:

```json
{
  "format_version": 2,
  "header": {
    "name": "Warchief Village RP",
    "description": "Resource Pack for the Warchief Village Add-On",
    "uuid": "992535e0-3a03-4caf-94bb-b8456b63cc52",
    "version": [0, 1, 0],
    "min_engine_version": [1, 26, 40]
  },
  "modules": [
    {
      "type": "resources",
      "uuid": "084c9e9e-aa67-4d10-ae5a-d13d2e2dc446",
      "version": [0, 1, 0]
    }
  ],
  "metadata": {
    "authors": [
      "Ibrahim Hasan"
    ]
  }
}
```

---

# 8. TypeScript Decision

Use TypeScript starting in Phase 00.

Reason:

- Phase 01 may require Script API fallback for interactions.
- Later phases definitely require ownership, raid controller logic, persistent state, and multiplayer checks.
- Starting TypeScript later would unnecessarily restructure the project.

TypeScript is authoring-time only. Minecraft executes compiled JavaScript.

---

# 9. package.json

Recommended baseline:

```json
{
  "name": "minecraft-warchief-village-bedrock",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "clean": "rm -rf behavior_pack/scripts/*.js behavior_pack/scripts/*.js.map"
  },
  "devDependencies": {
    "@minecraft/server": "2.9.0",
    "typescript": "^5.9.0"
  }
}
```

If npm reports that the exact package setup differs from the current official package distribution, Codex must verify the official Script API documentation/npm package rather than silently switching to beta.

---

# 10. tsconfig.json

Recommended starting configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "src",
    "outDir": "behavior_pack/scripts",
    "sourceMap": true,
    "noEmitOnError": true
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

If the Bedrock scripting runtime or current official sample requires a different module target, Codex should adjust based on the current documentation and record the change.

---

# 11. Script Smoke Test

Create `src/main.ts` with a minimal supported stable initialization/event smoke test. The objective is only to prove:

```text
TypeScript
→ compile
→ main.js
→ Bedrock Script API loads
→ one startup/debug message appears
```

Codex must verify the exact stable startup event available in the installed `@minecraft/server` 2.9.0 typings instead of inventing an event name.

---

# 12. Localization Skeleton

`behavior_pack/texts/languages.json`:

```json
[
  "en_US"
]
```

`behavior_pack/texts/en_US.lang`:

```text
pack.name=Warchief Village Behavior Pack
pack.description=Warchief Village gameplay systems
```

`resource_pack/texts/languages.json`:

```json
[
  "en_US"
]
```

`resource_pack/texts/en_US.lang`:

```text
pack.name=Warchief Village Resource Pack
pack.description=Warchief Village visual resources
```

Later add Indonesian localization separately instead of mixing languages into identifiers.

---

# 13. Naming Conventions

Use namespace:

```text
warchief
```

Examples:

```text
warchief:villager_soldier
warchief:mercenary
warchief:military_token
warchief:command_banner
```

File naming:

```text
villager_soldier.behavior.json
villager_soldier.entity.json
villager_soldier.animation.json
villager_soldier.animation_controllers.json
villager_soldier.render_controllers.json
```

---

# 14. Vanilla Reference Files

Do not recreate vanilla entities from memory.

Use Microsoft's latest vanilla Behavior Pack templates as references.

Microsoft documentation explicitly links the latest default behavior pack at:

https://aka.ms/behaviorpacktemplate

Use vanilla source files to inspect:

- `wolf`
- `iron_golem`
- `pillager`
- relevant client entity files
- animations
- render controllers
- sounds

When overriding a vanilla entity in Phase 01:

1. Start from the current vanilla definition.
2. Make the smallest required change.
3. Keep a clear diff.
4. Avoid deleting unrelated vanilla behavior accidentally.

---

# 15. Content Validation

Minecraft 1.26.40 has stricter entity validation.

Phase 00 must establish the rule:

> A clean content log is part of the build.

At minimum check:

- Invalid JSON.
- Unknown components.
- Invalid fields.
- Duplicate identifiers.
- Missing texture paths.
- Missing geometry.
- Missing animation/controller references.
- Script exceptions.
- Manifest dependency errors.

Microsoft also provides current-platform inspection guidance through:

https://mctools.dev

Use it as an optional validation aid, not as the source of gameplay design.

---

# 16. Git / Generated Files

Recommended `.gitignore`:

```gitignore
node_modules/
dist/
*.log
behavior_pack/scripts/*.js.map
.DS_Store
.vscode/settings.local.json
```

Decision:

- Commit compiled `behavior_pack/scripts/main.js` if direct pack testing/deployment benefits from having a ready-to-run repository.
- Otherwise generate it during build.
- Pick one strategy and document it in README.
- TypeScript source remains the source of truth.

---

# 17. README Phase 00 Section

Add a concise platform section:

```markdown
## Target Platform

- Minecraft Bedrock: 1.26.40
- Manifest format: 2
- Script API: @minecraft/server 2.9.0 stable
- Namespace: warchief

## Build

npm install
npm run build

## Docs

See `docs/Phase_00_Foundation_and_Versioning.md`.
```

---

# 18. Phase 00 Test Procedure

## Test A — JSON validation

Validate:

```text
behavior_pack/manifest.json
resource_pack/manifest.json
```

Expected:
- valid JSON;
- unique UUIDs;
- RP dependency UUID matches.

## Test B — TypeScript

Run:

```bash
npm install
npm run build
```

Expected:

```text
behavior_pack/scripts/main.js
```

must be generated with no TypeScript error.

## Test C — Minecraft pack discovery

Install/link packs to the development environment.

Expected:

- Warchief Village BP appears.
- Warchief Village RP appears.
- Activating BP resolves the RP dependency.
- No manifest dependency error.

## Test D — Script runtime

Load a clean test world.

Expected:
- one Warchief smoke-test log/message proves the script module loaded.

## Test E — Content log

Expected:
- no repeated manifest error;
- no unresolved dependency;
- no Script API module version error;
- no repeated exception.

---

# 19. Phase 00 Acceptance Criteria

Phase 00 is complete only when:

- [ ] Target runtime is documented as Bedrock `1.26.40`, unless a newer retail version is verified before implementation.
- [ ] Stable Script API version used is documented.
- [ ] `manifest.json` uses stable manifest format `2`.
- [ ] Behavior Pack loads.
- [ ] Resource Pack loads.
- [ ] BP → RP dependency resolves.
- [ ] TypeScript compiles.
- [ ] Script runtime executes.
- [ ] Content log does not contain repeated severe errors.
- [ ] Repository structure is ready for Phase 01.
- [ ] No beta API is enabled without written justification.

---

# 20. Codex Instructions for Phase 00

Codex must:

1. Read this entire document.
2. Check the current official Microsoft documentation before changing version numbers.
3. Inspect the repository before generating files.
4. Do not create gameplay systems yet.
5. Use stable APIs only.
6. Keep BP and RP separate.
7. Generate valid unique UUIDs if the provided placeholders are replaced.
8. Run `npm run build`.
9. Report all created/changed files.
10. Report the exact Bedrock and Script API versions used.
11. Report any Experimental toggles required.
12. Stop after Phase 00.

Do not proceed into Phase 01 automatically.
