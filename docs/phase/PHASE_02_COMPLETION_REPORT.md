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
- Both entities target a default Stone Sword in Mainhand and Leather Chestplate in Body equipment on spawn/load.
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
10. Give an Iron Chestplate; confirm it replaces the default Leather Chestplate and visual/drop behavior is tested.
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

## Phase 02 Follow-Up Fix Notes

- Mercenary Wolf sound variants are mapped back to Villager-style sounds so non-default Wolf variants should not leak vanilla Wolf audio.
- Villager Soldier melee behavior is switched to normal `minecraft:behavior.melee_attack`, and Soldier hits clear target velocity after the hit to suppress the Iron Golem-style launch.
- Player-provided armor now has a scripted defensive effect based on armor points, so armor affects survival even if visual rendering is still being validated.
- Sword damage remains script-normalized by equipped sword type.
- The Pillager prototype geometry bone names were aligned to `rightArm` and `leftArm` so vanilla attachables have the expected arm bones/locators for held item and armor rendering tests.
- If equipment still does not appear visually after this fix, Phase 02 should treat it as an attachable/render-controller limitation and record the exact content-log message.

## Equipment Visual Rendering Fix

### Client Entity
- enable_attachables Villager Soldier: present.
- enable_attachables Mercenary: present.
- Attack animation: humanoid attack controller is included in both replacement client entities.

### Default Loadout
- Stone Sword Mainhand: assigned through native equipment + Script API validation.
- Leather Chestplate Body: assigned through native equipment + Script API validation.
- Helmet: intentionally out of scope for Phase 02.
- Leggings: intentionally out of scope for Phase 02.
- Boots: intentionally out of scope for Phase 02.

### Weapon Visual
- Stone Sword: requires Minecraft runtime validation.
- Iron Sword: requires Minecraft runtime validation after player upgrade.
- Diamond Sword: requires Minecraft runtime validation after player upgrade.

### Armor Visual
- Leather Chestplate / Body: requires Minecraft runtime validation.
- Iron Chestplate / Body: requires Minecraft runtime validation after player upgrade.
- Helmet/Leggings/Boots: intentionally not part of the Phase 02 target.

### Geometry
- bone hierarchy: humanoid Pillager-style geometry retained.
- rightArm: present.
- leftArm: present.
- head: present.
- body: present.
- legs: present.
- locators: `rightItem` and `leftItem` present.

### Attachables
- generic/player-specific: vanilla attachable behavior still needs runtime/content-log verification.
- custom copied attachables: none added in this pass.
- render controllers: base entity remains on Pillager render controller; equipment should render through attachables.

### Save / Reload
- default equipment: native equipment provides the baseline; Script API validates/re-applies Mainhand + Body when needed.
- player equipment: Script API re-applies saved player-provided Mainhand + Body equipment on load.

### Known Visual Limitations

If equipment slots are populated in `[Warchief Equipment Debug]` but visuals remain absent, the next issue is likely Resource Pack attachable/render-controller compatibility rather than gameplay equipment state.

### Content Log Messages

Record any runtime warning mentioning attachable, geometry, bone, render controller, material, texture, equipment, equippable, or slot.


---

## 2026-09-20 — Equipment Rendering Audit Patch

Phase 02 equipment scope has been reduced to the two visuals that matter for the
current prototype:

```text
Mainhand: Stone Sword
Body: Leather Chestplate
```

Helmet, leggings, and boots are no longer part of the Phase 02 default loadout.

### Repository changes applied

- `minecraft:equippable` reduced to two entries: sword + body armor.
- Native `minecraft:equipment` added to both replacement entities.
- New `warchief_default_loadout.json` equipment table added.
- Default native loadout = Stone Sword + Leather Chestplate.
- Script armor slot changed to `EquipmentSlot.Body`.
- Client entities explicitly set:
  - `enable_attachables: true`
  - `hide_armor: false`
- Runtime equipment diagnostics now verify:
  - `setEquipment()` return value;
  - item read back from the same slot.

### Current status

```text
CODE UPDATED
DOCUMENTATION UPDATED
IN-GAME VISUAL VALIDATION REQUIRED
```

### Required next test

For both Villager Soldier and Mercenary, verify the log reports:

```text
Mainhand=minecraft:stone_sword
Body=minecraft:leather_chestplate
```

Then visually confirm:

```text
Stone Sword visible
Leather Chestplate visible
```

If the slots are populated but the visuals are still absent, the remaining
problem is on the Resource Pack / actor rendering side.

If `setEquipment()` is rejected or the slot reads back empty, the problem is
the server-side equipment capability of the vanilla replacement identifier.

Do not classify this improvement as visually complete until the runtime test is
performed in Bedrock.
