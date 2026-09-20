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


---

## 2026-09-20 — Custom Warchief Geometry + Equipment Replacement Fix

This section is authoritative for the current `main` branch.

### Custom geometry

The repository now uses:

```text
resource_pack/models/entity/warchief_humanoid.geo.json
geometry.warchief.humanoid
```

for both replacement client entities.

The Soldier and Mercenary no longer reference `geometry.pillager` directly.

The custom geometry keeps the Pillager-like visual proportions/UV layout while
providing explicit humanoid bones:

```text
body
head
nose
rightArm
rightItem
leftArm
leftItem
rightLeg
leftLeg
```

This is now the visual base for future armor, held-item, and attack-animation work.

### Default equipment

Phase 02 still targets only:

```text
Mainhand = minecraft:stone_sword
Body     = minecraft:leather_chestplate
```

Helmet, leggings, and boots are not part of the current target.

The initialization path calls Script API equipment synchronization so a fresh
unit should have the Stone Sword in `EquipmentSlot.Mainhand` and Leather
Chestplate in `EquipmentSlot.Body`.

### Fixed stale player equipment synchronization

The previous implementation could keep the wrong actual item when persistent
state was already marked as player equipment.

The old behavior was effectively:

```text
source == player
AND slot already contains any item
→ do not synchronize
```

That guard has been removed.

Now if persistent equipment says Iron but the actual slot still contains
Leather/Stone, the actual slot is set to the persisted item.

### Weapon replacement

Weapon replacement now:

```text
read actual Mainhand
→ attempt new Mainhand item
→ verify actual slot
→ consume player's new sword
→ return old player-provided sword exactly once
→ persist new player item
```

Default Stone Sword is not refunded when first replaced.

The success chat includes the actual Mainhand value.

### Body armor replacement

Body armor replacement follows the same pattern:

```text
read actual Body slot
→ attempt new chestplate
→ verify actual Body slot
→ consume player's new chestplate
→ return old player-provided chestplate exactly once
→ persist new player item
```

Default Leather Chestplate is not refunded when first replaced.

The success chat includes the actual Body slot value.

### Runtime validation required

Fresh unit:

```text
Stone Sword visible in hand
Leather Chestplate visible on body
```

Give Iron Sword:

```text
Mainhand: minecraft:iron_sword
```

Give Iron Chestplate:

```text
Body: minecraft:iron_chestplate
```

Then replace player Iron gear with Diamond gear.

Expected:

```text
old Iron item returned exactly once
new Diamond item remains equipped
```

### Attack animation

No new custom attack animation was introduced in this patch.

Attack animation will be handled as a separate pass after held-item and body
equipment rendering are confirmed stable on the custom geometry.


---

## 2026-09-20 — Authoritative Equipment Logic Fix

This section overrides older equipment-replacement notes where they conflict.

### Scope frozen for this patch

No visual-model, animation, render-controller, AI, patrol/follow, recruitment, or
health behavior was changed.

Equipment target remains:

```text
Mainhand = Sword
Chest    = Chestplate
```

### Unified replacement transaction

Weapon and chestplate replacement now use the same transaction:

```text
read saved item + provenance
        ↓
read actual slot only for rollback/debug
        ↓
apply new actual equipment
        ↓
verify through Script API when readable
        ↓
consume player's new item
        ↓
refund previous SAVED player-provided item exactly once
        ↓
persist new item + source=player
```

The old weapon/armor logic duplication was removed so refund behavior cannot
silently diverge between sword and chestplate.

### Provenance rule

Refund is based on:

```text
saved item
+
saved source
```

not the current actual equipment slot.

Example:

```text
saved item   = minecraft:iron_sword
saved source = player
actual slot  = minecraft:stone_sword   (stale/desynced)
```

When replacing with Diamond Sword, the refunded item is still:

```text
minecraft:iron_sword
```

because Iron is the player-provided gear owned by the player.

### Actual equipment assignment

Primary path:

```text
EntityEquippableComponent.setEquipment()
```

If the component is unavailable or the write/readback fails, the system falls
back to the official entity equipment command slots:

```text
slot.weapon.mainhand
slot.armor.chest
```

The fallback uses `/replaceitem`.

The system no longer falsely reports a command fallback as verified when Script
API readback is unavailable. Results distinguish:

```text
verified=true  -> actual slot was read back successfully
verified=false -> command completed but Script API readback is unavailable
```

### Consumption safety

The new player item is consumed only after an actual-equipment write path
succeeds.

If inventory consumption unexpectedly fails, the previous actual/saved item is
re-applied as rollback.

### Default vs player gear

```text
Default Stone Sword -> Iron Sword
refund Stone: NO

Iron Sword(player) -> Diamond Sword
refund Iron: YES, exactly 1x

Default Leather Chestplate -> Iron Chestplate
refund Leather: NO

Iron Chestplate(player) -> Diamond Chestplate
refund Iron Chestplate: YES, exactly 1x
```

### Load recovery

`initializeCustomUnit()` still calls `ensureEquipment()`.

The ensure path now uses the same actual-equipment assignment service as runtime
replacement, including command fallback.

This keeps future visual work aligned to real Minecraft equipment slots rather
than dynamic properties only.

### Runtime acceptance tests

1. Recruit fresh Soldier and Mercenary.
2. Give Iron Sword.
3. Confirm one Iron Sword is consumed.
4. Give Diamond Sword.
5. Confirm the previous Iron Sword is returned exactly once.
6. Give Iron Chestplate.
7. Confirm one Iron Chestplate is consumed.
8. Give Diamond Chestplate.
9. Confirm the previous Iron Chestplate is returned exactly once.
10. Save/reload and repeat an upgrade.
11. Kill the unit and verify only currently saved player-provided gear drops once.

Visual rendering is intentionally not part of this equipment-logic patch.


---

## 2026-09-20 — Villager Soldier Native Equipment Bootstrap

This patch is intentionally Soldier-only.

Mercenary/Wolf behavior, client entity, custom geometry, render controller,
animation controller, and the shared equipment transaction logic were not
changed.

### Reason

Runtime testing showed:

```text
Mercenary:
- sword replacement works
- chestplate replacement works
- sword visual follows equipped tier
- armor visual follows equipped tier

Villager Soldier:
- sword replacement transaction works
- sword visual is missing
- chestplate replacement does not complete reliably
```

Because both entities use the same custom visual geometry, this points to a
server-actor equipment-capability difference rather than a geometry problem.

Historically, Villager Soldier successfully rendered a Leather Chestplate when
its native `minecraft:equipment` table contained both Stone Sword and Leather
Chestplate.

### Change

A Soldier-specific native loadout was added:

```text
behavior_pack/loot_tables/entities/warchief_soldier_default_loadout.json
```

It contains two deterministic pools:

```text
Stone Sword
Leather Chestplate
```

Only `minecraft:iron_golem` now points to this table.

Mercenary continues using the existing shared default loadout and was not
modified.

The Soldier native equipment component now suppresses default gear drops from:

```text
slot.weapon.mainhand
slot.armor.chest
```

with `drop_chance: 0`.

### Intent

`minecraft:equipment` is used only to bootstrap the Soldier's native equipment
state at spawn.

Runtime ownership/provenance remains controlled by the Phase 02 Script system.

Player upgrades must still follow the existing transaction:

```text
default gear
-> player gear
-> previous player-provided gear returned exactly once
```

### Required runtime test

Use a fresh Villager Soldier.

1. Confirm default Stone Sword / Leather Chestplate bootstrap.
2. Give Iron Sword.
3. Confirm Stone is not refunded.
4. Confirm Iron Sword becomes the current weapon.
5. Give Diamond Sword.
6. Confirm Iron Sword is returned exactly once.
7. Give Iron Chestplate.
8. Confirm Leather is not refunded.
9. Confirm Iron Chestplate is accepted.
10. Give Diamond Chestplate.
11. Confirm Iron Chestplate is returned exactly once.
12. Confirm sword/chestplate visuals track the actual equipped tier.

If Mercenary behavior changes, treat that as a regression because this patch did
not intentionally modify Wolf.


---

## 2026-09-20 — Soldier Chest Replacement + Held Sword Visual Pass

This pass targets only the two remaining Villager Soldier issues:

```text
1. Chestplate upgrade transaction could roll back with:
   "<Chestplate> tidak dikonsumsi; equipment dikembalikan."

2. Soldier weapon gameplay state worked, but held sword was not rendered.
```

### Chestplate transaction fix

The interaction now captures the player's source hotbar slot during
`playerInteractWithEntity.beforeEvents` before the work is deferred with
`system.run()`.

The equipment transaction consumes from that captured slot instead of reading
`player.selectedSlotIndex` again one tick later.

This prevents a timing mismatch where a wearable chestplate or player slot state
changes between the before-event and the deferred transaction.

A diagnostic is emitted if the captured slot no longer contains the expected
item.

### Soldier equipment capability

`minecraft:iron_golem` now includes:

```json
"minecraft:equip_item": {
  "can_wear_armor": true
}
```

No `minecraft:behavior.equip_item` pickup goal was added.

This is intended to give the Soldier the same class of server-side equipment
capability used by vanilla equipment-bearing mobs without making the Soldier
actively pick up dropped items.

### Soldier held-item client hook

The Soldier client entity now explicitly runs:

```text
controller.animation.humanoid.holding
```

through the `controller_holding` animation mapping.

No geometry, texture, render controller, or Mercenary client configuration was
changed.

### Runtime validation

Test a fresh Soldier:

```text
Leather -> Iron Chestplate
Iron -> Diamond Chestplate

Stone -> Iron Sword
Iron -> Netherite Sword
```

Expected chest behavior:

```text
new chestplate consumed once
old player-provided chestplate returned exactly once
visual follows the new chestplate
```

Expected sword behavior:

```text
actual weapon tier remains reflected in combat damage
held sword becomes visible
visual follows the equipped sword tier
```

Mercenary behavior must remain unchanged.


---

## 2026-09-20 — Final Soldier Role: Fixed Iron Armor + Synced Sword Visual

Villager Soldier is now intentionally differentiated from Mercenary.

### Soldier role

```text
Villager Soldier / regular army:
- fixed Iron Chestplate
- armor cannot be replaced by player
- 32 HP
- scripted Iron Chestplate protection
- sword can still be upgraded/replaced
- sword visual follows synced weapon tier

Mercenary / special unit:
- keeps flexible player-provided armor system
- keeps flexible sword system
```

### Fixed Soldier armor

The Soldier native loadout now contains:

```text
Stone Sword
Iron Chestplate
```

On spawn/load Script also forces the Soldier armor state to:

```text
minecraft:iron_chestplate
source=default
```

Armor interaction on Soldier is cancelled with an informational message and the
player's chestplate is not consumed.

Soldier death does not manually drop the permanent Iron Chestplate.

### Soldier survivability

Base Soldier health is now:

```text
32 HP
```

The existing scripted armor-protection calculation reads the permanent
Iron Chestplate state, so the Soldier also receives the Iron chestplate armor
reduction in addition to the larger health pool.

### Sword gameplay

Sword replacement/provenance remains unchanged.

Player-provided swords can still replace the previous sword, and the previous
player-provided sword is returned exactly once.

### Sword visual fallback

Because `minecraft:iron_golem` did not reliably render its held-item attachable
even when weapon gameplay state changed, Soldier now has a separate client-synced
visual property:

```text
warchief:weapon_visual
```

Supported values:

```text
wood
stone
iron
gold
diamond
netherite
```

Script triggers the corresponding Behavior Pack event after initialization and
after every successful Soldier sword replacement.

The Resource Pack renders a second overlay geometry:

```text
geometry.warchief.soldier_sword
```

attached to the Soldier's right-hand bone hierarchy.

The overlay uses vanilla sword textures:

```text
textures/items/wood_sword
textures/items/stone_sword
textures/items/iron_sword
textures/items/gold_sword
textures/items/diamond_sword
textures/items/netherite_sword
```

through:

```text
controller.render.warchief.soldier_sword
```

This visual layer does not control damage or refund ownership. Gameplay still
uses the existing Phase 02 equipment transaction and saved weapon state.
