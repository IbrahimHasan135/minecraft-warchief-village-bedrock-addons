# Phase 01 Improvement Result

## Environment

- Bedrock version: `1.26.40`
- `@minecraft/server`: `2.9.0`

## Command State

- Property/state implementation: Script API dynamic property `warchief:p01_command_mode`.
- Values: `patrol`, `follow`.
- Default state: `patrol` for recruited Iron Golem / Villager Soldier.
- Persistence: dynamic property should persist, but active component-group restoration after save/reload must be verified in Minecraft.

## PATROL

- `random_stroll`: native behavior in `warchief:mode_patrol`.
- `home/restriction`: `minecraft:home` plus `minecraft:behavior.move_towards_home_restriction`.
- Patrol radius: `restriction_radius` `10`, local stroll `xz_dist` `8`, `y_dist` `3`.
- Patrol anchor behavior: native home anchor is attempted when `warchief:set_patrol` applies the patrol group. In-game verification is required to confirm whether Bedrock resets the anchor to the current Soldier position.
- Combat return behavior: vanilla Iron Golem target/combat behavior is preserved; combat leash behavior must be observed in-game.

## FOLLOW

- `follow_owner` configuration: native `minecraft:behavior.follow_owner` in `warchief:mode_follow`.
- `start_distance`: `5`.
- `stop_distance`: `2`.
- `speed_multiplier`: `1.1`.
- `can_teleport`: `true`.
- `max_distance`: `40`.
- Observed teleport behavior: not runtime-tested by Codex; manual HP test should confirm near movement is pathfinding and teleport only happens as recovery.

## Interaction

- Toggle input: owner empty-hand right-click/use on recruited Iron Golem.
- Owner validation: prefers `EntityTameableComponent.tamedToPlayerId`, falls back to Phase 01 owner dynamic property.
- Recruitment conflict: Emerald interaction remains first priority.
- Sword interaction conflict: sword interaction remains second priority and does not toggle command mode.

## Multiplayer

- Owner-only toggle result: implemented in Script API; manual multiplayer validation is still required.

## Balance And Identity

- Pillager reference baseline from Mojang sample: health `24`, melee attack `3`.
- Iron Golem prototype baseline: health `24`, attack `3`, movement `0.35`.
- Wolf prototype baseline: health `24`, base/tamed attack `3`.
- Sword tiers still override prototype damage tier after equipment.
- Wolf and Iron Golem resource sound mappings target Villager-style ambient/hurt/death sounds.

## Known Limitations

- Phase 01 still overrides vanilla `minecraft:wolf` and `minecraft:iron_golem`; Phase 02 should move this into custom `warchief:*` entities.
- Native `minecraft:home` anchor reset behavior must be verified in-game.
- Command mode dynamic property should persist, but component-group state after save/reload needs manual confirmation.
- Held sword visual still depends on whether the entity exposes a runtime mainhand equippable slot.
- Sound mappings may still miss rare vanilla events; log any remaining Wolf/Iron Golem sounds during testing.

## Content Log Errors

- Local checks only validated TypeScript and JSON syntax.
- Minecraft content log must be checked on-device after importing the new `.mcaddon`.

## Recommendation For Phase 02

- Replace vanilla entity overrides with `warchief:villager_soldier` and `warchief:mercenary`.
- Convert `warchief:p01_command_mode` into a production entity property.
- Add a production patrol-anchor strategy after the native `minecraft:home` behavior is observed in-game.
- Reserve Banner for mass command behavior instead of individual Soldier follow.
