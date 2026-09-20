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
  - Iron Golem now has a Phase 01 `minecraft:tameable` override and script also calls `EntityTameableComponent.tame(player)`.
  - Right-click/use a recruited unit with a sword to assign a weapon tier.
  - Sword assignment is owner-gated.
  - Sword tiers normalize melee damage to the assigned tier instead of stacking raw bonus on top of vanilla damage.
  - Iron Golem command mode is custom `PATROL/FOLLOW`, stored in `warchief:p01_command_mode`.
  - Owner empty-hand right-click toggles Iron Golem `PATROL ↔ FOLLOW`.
  - Iron Golem `FOLLOW` uses native `minecraft:behavior.follow_owner` instead of the old script teleport-follow loop.
- Added a Phase 01 Iron Golem behavior override:
  - Health set to Pillager-scale `24`.
  - Base attack set to `3`.
  - Base movement set to `0.35`.
  - `PATROL` uses local random stroll/home restriction behavior.
  - `FOLLOW` uses native owner follow with recovery teleport enabled.
- Added a Phase 01 Wolf behavior override:
  - Health set to Pillager-scale `24`.
  - Base/tamed attack set to `3`.
- Added Resource Pack sound mapping so the Wolf and Iron Golem prototypes use Villager-style ambient/hurt/death sounds.
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
- Wolf sound override:
  - `resource_pack/sounds.json`
- Iron Golem behavior override:
  - `behavior_pack/entities/iron_golem.json`
- Wolf behavior override:
  - `behavior_pack/entities/wolf.json`

Current texture source is the vanilla Pillager texture from Mojang's public `bedrock-samples` repository. You can replace the two PNG files above with custom skins later while keeping the same paths.

## Local Validation

Passed:

```text
npm run build
npm run validate
```

Validation result:

```text
Validation passed for 10 JSON files.
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
8. Confirm idle/hurt/death sounds are Villager-style, not Wolf barks.
9. Right-click/use it with a sword.
10. Confirm one sword is consumed and chat reports the weapon tier.
11. Attack/let it attack a hostile mob and confirm melee damage matches the assigned prototype tier.
12. Confirm no-sword Wolf baseline health/damage is Pillager-scale.

Then:

1. Spawn an Iron Golem.
2. Confirm it visually appears as the temporary Pillager-style Villager Soldier.
3. Hold exactly one or more Emeralds in the selected hotbar slot.
4. Right-click/use the Iron Golem.
5. Confirm one Emerald is consumed.
6. Confirm chat shows it was recruited.
7. Confirm it starts in PATROL.
8. Walk away and confirm it does not follow immediately.
9. Confirm it can patrol locally instead of freezing.
10. Empty-hand right-click as owner.
11. Confirm chat shows `Villager Soldier: FOLLOW`.
12. Confirm the recruited Iron Golem pathfinds toward you like a tamed follower instead of being pulled by script.
13. Confirm native recovery teleport is allowed only when far/stuck, not repeatedly at normal follow range.
14. Empty-hand right-click again.
15. Confirm chat shows `Villager Soldier: PATROL`.
16. Confirm it stops following and resumes local patrol behavior.
17. Right-click/use it with a sword.
18. Confirm one sword is consumed and chat reports the weapon tier.
19. Confirm Iron Golem movement feels closer to Wolf/Pillager pace than vanilla Golem pace.
20. Confirm base Iron Golem combat is Pillager-scale, not vanilla Golem-scale.
21. Confirm idle/hurt/death sounds are Villager-style, not Iron Golem sounds.

## Known Prototype Limitations

- Wolf uses true Script API tame ownership; Iron Golem now also attempts true tame ownership through a Phase 01 vanilla override.
- Individual Iron Golem command no longer uses Banner. Banner remains a future candidate for mass army commands.
- Native `minecraft:behavior.follow_owner` handles FOLLOW movement and recovery teleport. Script only toggles state and does not move the unit.
- PATROL uses `minecraft:home`/restriction and local stroll, but whether the native home anchor resets exactly on every PATROL transition must be verified in-game.
- Iron Golem now uses a Phase 01 vanilla override to reduce base health/attack/movement to Pillager-scale.
- Wolf now uses a Phase 01 vanilla override to set baseline health/damage to Pillager-scale.
- Visible held sword depends on whether the vanilla entity exposes a usable `minecraft:equippable` mainhand slot at runtime. The script attempts visual equip and reports if damage is active but visual slot is unavailable.
- Wolf sitting state is preserved behaviorally by vanilla tame logic, but the humanoid visual still uses Pillager-style animations and is not expected to have a correct sitting pose in Phase 01.
- Wolf and Iron Golem sound mappings are overridden to Villager-style events; any remaining original mob sound should be logged as a resource-pack mapping gap.

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
