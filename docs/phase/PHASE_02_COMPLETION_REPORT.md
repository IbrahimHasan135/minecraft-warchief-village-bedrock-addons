# Phase 02 Completion Report — Full Replacement Units

Status: implemented for local/manual Bedrock testing.

## Architecture Decision

Phase 02 uses full vanilla entity replacement:

```text
minecraft:iron_golem  -> Villager Soldier
minecraft:wolf        -> Mercenary
```

No separate `warchief:villager_soldier` or `warchief:mercenary` entity is introduced in this phase.

## Implemented

- Iron Golem client entity remains replaced with Pillager-compatible Villager Soldier visuals.
- Wolf client entity remains replaced with Pillager-compatible Mercenary visuals.
- Spawn egg labels are overridden to `Spawn Villager Soldier` and `Spawn Mercenary`.
- Spawn egg colors are changed away from vanilla Wolf/Iron Golem visuals.
- Both replacement entities use Villager-style idle/hurt/death sounds where mapped.
- Both entities use 24 HP and base 3 damage before script weapon normalization.
- Villager Soldier movement is set to humanoid speed and no longer uses Iron Golem repair, loot, heavy knockback, or water-sinking navigation.
- Mercenary uses Emerald tame/recruitment instead of Bone.
- Mercenary keeps Wolf-style sit/stay so the player can stop/resume follow.
- Both entities get default Stone Sword state on spawn/load.
- Player-provided sword/armor provenance is tracked through Script API dynamic properties.
- Default Stone Sword is not manually dropped on death.
- Player-provided weapon/armor is manually dropped exactly once by the Phase 02 script.
- Food healing uses Script API food component detection and heals 4 HP.
- Full-health units do not consume food.
- Iron Ingot has no special Soldier repair interaction.
- Villager Soldier owner empty-hand interaction toggles PATROL/FOLLOW.
- Mercenary keeps native Wolf-style owner follow.
- Player-built Iron Golem ritual is disabled through the `minecraft:from_player` event and should not leave an entity alive.

## Local Verification

- `npm run build` passed.
- `npm run validate` passed.
- `git diff --check` passed.
- `npm run package` created `dist/Warchief_Village_Phase_02.mcaddon`.

## Manual Bedrock Checkpoints

1. Import `dist/Warchief_Village_Phase_02.mcaddon`.
2. Confirm Creative spawn eggs show `Spawn Villager Soldier` and `Spawn Mercenary`.
3. Spawn Iron Golem and Wolf eggs; both should render as Pillager-style units with the latest textures.
4. Confirm `/summon minecraft:iron_golem` creates Villager Soldier.
5. Confirm `/summon minecraft:wolf` creates Mercenary.
6. Give exactly 1 Emerald to each unit and confirm recruitment.
7. Confirm Mercenary follows like Wolf and can sit/stay when empty-clicked.
8. Empty-click Villager Soldier after recruitment and confirm PATROL/FOLLOW toggles.
9. Give an Iron Sword; confirm item is consumed and damage/equipment state changes.
10. Give Iron Chestplate or other armor; confirm item is consumed and visual/drop behavior is tested.
11. Kill a unit with only default Stone Sword; expected manual script drop is nothing.
12. Kill a unit with player-provided equipment; expected drop is exactly one of each player-provided item.
13. Damage a unit and feed any food; expected heal is +4 HP and one food consumed.
14. Try food at full health; expected no consumption.
15. Try Iron Ingot on Villager Soldier; expected no repair/heal.
16. Walk units through shallow water and confirm they do not remain trapped underwater.
17. Build the vanilla Iron Golem structure with 4 Iron Blocks and 1 Carved Pumpkin; expected result is that no entity remains spawned.

## Runtime Risks To Watch

- Bedrock may still have engine-level equipment drop behavior for visually equipped items. If default Stone Sword drops despite script policy, Phase 02 needs a content-side drop suppression adjustment.
- Bedrock may consume the Iron Blocks/Pumpkin before `minecraft:from_player` applies the disable group. Runtime test must confirm whether blocks remain or are consumed.
- Some vanilla Wolf-specific interactions remain in the base behavior file for compatibility; report any interaction that still feels like a dog instead of Mercenary.
- Sound mapping depends on Bedrock event keys. If a specific action still plays Wolf/Iron Golem audio, add that event key to `resource_pack/sounds.json`.
