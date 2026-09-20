# Phase 01 Completion Report — Vanilla Prototype Units

Date: 2026-09-20

## Implemented

- Added Resource Pack client overrides for:
  - `minecraft:wolf` as the temporary Mercenary prototype.
  - `minecraft:iron_golem` as the temporary Villager Soldier prototype.
- Both overrides point to the vanilla Pillager humanoid geometry and temporary Pillager-derived textures.
- Added Script API Phase 01 system:
  - Right-click/use Wolf or Iron Golem with `1 Emerald` to recruit.
  - The Emerald is consumed from the selected hotbar slot.
  - Wolf recruitment calls `EntityTameableComponent.tame(player)` so vanilla owner-follow/stay behavior can continue.
  - Iron Golem recruitment stores a Script API owner marker because vanilla Iron Golem is not a tameable entity.
  - Right-click/use a recruited unit with a sword to assign a weapon tier.
  - Sword assignment is owner-gated.
  - Sword tiers add Script API bonus damage on melee hit.
  - Iron Golem follows its recruiting owner while that owner holds any item ending with `_banner`.
- Expanded validation so all BP/RP JSON files are parsed, not only manifests.

## Asset Paths

- Mercenary prototype texture:
  - `resource_pack/textures/entity/warchief/mercenary_prototype.png`
- Villager Soldier prototype texture:
  - `resource_pack/textures/entity/warchief/villager_soldier_prototype.png`
- Shared temporary model:
  - `resource_pack/models/entity/warchief_prototype_pillager.geo.json`
- Wolf client override:
  - `resource_pack/entity/wolf.entity.json`
- Iron Golem client override:
  - `resource_pack/entity/iron_golem.entity.json`

Current texture source is the vanilla Pillager texture from Mojang's public `bedrock-samples` repository. You can replace the two PNG files above with custom skins later while keeping the same paths.

## Local Validation

Passed:

```text
npm run build
npm run validate
```

Validation result:

```text
Validation passed for 7 JSON files.
```

## Manual Bedrock Test Checklist

Use a clean test world with both packs enabled.

1. Spawn a Wolf.
2. Confirm it visually appears as the temporary Pillager-style Mercenary.
3. Hold exactly one or more Emeralds in the selected hotbar slot.
4. Right-click/use the Wolf.
5. Confirm one Emerald is consumed.
6. Confirm chat shows it was recruited.
7. Walk away and confirm the Wolf follows like a tamed Wolf.
8. Right-click/use it with a sword.
9. Confirm one sword is consumed and chat reports the weapon tier.
10. Attack/let it attack a hostile mob and confirm it deals weapon-tier bonus damage.

Then:

1. Spawn an Iron Golem.
2. Confirm it visually appears as the temporary Pillager-style Villager Soldier.
3. Hold exactly one or more Emeralds in the selected hotbar slot.
4. Right-click/use the Iron Golem.
5. Confirm one Emerald is consumed.
6. Confirm chat shows it was recruited.
7. Right-click/use it with a sword.
8. Confirm one sword is consumed and chat reports the weapon tier.
9. Hold any vanilla Banner.
10. Move more than roughly 6 blocks away.
11. Confirm the recruited Iron Golem moves near you through the Phase 01 follow prototype.
12. Stop holding the Banner and confirm command-follow no longer updates.

## Known Prototype Limitations

- Wolf uses true Script API tame ownership; Iron Golem uses a dynamic owner marker.
- Iron Golem banner-follow is a prototype teleport-follow loop, not final pathfinding.
- Vanilla Iron Golem base combat strength is not fully reduced yet because this phase avoids replacing the large vanilla behavior file. Sword tiers currently add bonus damage on top of vanilla melee behavior.
- Visible held sword depends on whether the vanilla entity exposes a usable `minecraft:equippable` mainhand slot at runtime. The script attempts visual equip and reports if damage is active but visual slot is unavailable.
- Wolf sitting state is preserved behaviorally by vanilla tame logic, but the humanoid visual still uses Pillager-style animations and is not expected to have a correct sitting pose in Phase 01.
- Villager sounds are not implemented in this pass; the focus is recruitment, owner gating, equipment tiering, and command follow.

## Documentation Checked

- `minecraft:tameable`
- `minecraft:interact`
- `minecraft:equippable`
- `PlayerInteractWithEntityBeforeEvent`
- `EntityEquippableComponent`
- `minecraft:behavior.tempt`
- Client Entity JSON documentation
- Mojang `bedrock-samples` vanilla Resource Pack templates

## Exit Status

Phase 01 is ready for in-game manual validation. Any failures from the manual test should be recorded before Phase 02 so the final `warchief:*` entities can be designed around confirmed Bedrock behavior instead of assumptions.
