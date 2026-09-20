# Phase 00 Completion Report

## Versions

- Minecraft Bedrock target: `1.26.40`
- Manifest format: `2`
- Behavior/Resource Pack `min_engine_version`: `[1, 26, 40]`
- Stable Script API: `@minecraft/server` `2.9.0`
- Beta APIs: not enabled

## Generated Runtime Strategy

TypeScript source in `src/` is the source of truth.

Compiled JavaScript is emitted to `behavior_pack/scripts/` so the repository can be tested directly as a Bedrock pack after running:

```bash
npm install
npm run build
```

## Manual Bedrock Validation Still Required

The local repository can validate JSON, UUID relationships, and TypeScript compilation. Minecraft runtime validation still must be performed in Bedrock:

- Enable `Warchief Village BP`.
- Confirm `Warchief Village RP` dependency resolves.
- Load a clean test world.
- Check content log for manifest, dependency, and script runtime errors.
- Confirm the smoke-test log appears:

```text
[Warchief Village] Script API smoke test loaded.
```

## Local Validation Completed

- `npm install`: passed.
- `npm run build`: passed and generated `behavior_pack/scripts/main.js`.
- `npm run validate`: passed.
