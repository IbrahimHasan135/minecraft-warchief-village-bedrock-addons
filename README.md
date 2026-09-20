# Minecraft Warchief Village Bedrock Add-On

## Target Platform

- Minecraft Bedrock: `1.26.40`
- Manifest format: `2`
- Script API: `@minecraft/server` `2.9.0` stable
- Namespace: `warchief`
- Beta APIs: not enabled

## Build

Install dependencies and compile TypeScript into the Behavior Pack script folder:

```bash
npm install
npm run build
```

Run local static validation:

```bash
npm run validate
```

## Phase Docs

- Phase 00: `docs/phase/Phase_00_Foundation_and_Versioning.md`
- Phase 01: `docs/phase/Phase_01_Vanilla_Prototype_Units.md`

TypeScript source lives in `src/`. Compiled Bedrock runtime JavaScript is emitted into `behavior_pack/scripts/`.
