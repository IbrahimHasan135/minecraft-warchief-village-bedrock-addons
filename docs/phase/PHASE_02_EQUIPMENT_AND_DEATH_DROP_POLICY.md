# Phase 02 Addendum — Equipment Ownership and Death Drop Policy

> Project: **Minecraft Warchief Village Bedrock Add-On**  
> Scope: This document defines the equipment provenance and death-drop rules for the Phase 02 full replacements: `minecraft:iron_golem` as Villager Soldier and `minecraft:wolf` as Mercenary.  
> This is an addendum to Phase 02 and should be read together with `PHASE_02_CUSTOM_SOLDIER_AND_MERCENARY_CORE.md`.

---

# 1. Core Rule

The death-drop rule is based on **where an item came from**.

There are two equipment sources:

```text
DEFAULT SPAWN EQUIPMENT
PLAYER-PROVIDED EQUIPMENT
```

Only **player-provided equipment** must be returned on death.

The unit must **not** drop:

```text
Emerald recruitment cost
Military Token
recruitment items
default spawn weapon
free valuable base loot
```

---

# 2. Default Spawn Equipment

Both custom Phase 02 units should spawn with:

```text
Main hand: Stone Sword
Armor: None
```

Entities:

```text
minecraft:iron_golem  → Villager Soldier
minecraft:wolf        → Mercenary
```

The Stone Sword is considered:

```text
DEFAULT SPAWN EQUIPMENT
```

It exists to make the unit combat-ready immediately and to prove held-item rendering.

It is **not** considered player investment.

---

# 3. Default Equipment Death Rule

If the unit dies while still using only its default Stone Sword:

```text
Stone Sword
→ does NOT need to drop
```

Recommended policy:

```text
default Stone Sword drop chance = 0%
```

Reason:

- prevents farming free Stone Swords;
- avoids confusing default equipment with player-owned equipment;
- keeps death drops focused on items the player actually invested;
- simplifies balance.

---

# 4. Player-Provided Equipment Rule

Any weapon or armor item explicitly given by the player to the unit is considered:

```text
PLAYER-PROVIDED EQUIPMENT
```

Examples:

```text
Iron Sword
Diamond Sword
Netherite Sword

Iron Helmet
Iron Chestplate
Iron Leggings
Iron Boots

Diamond Armor
Netherite Armor
```

When the unit dies:

```text
PLAYER-PROVIDED WEAPON
→ drop exactly once

PLAYER-PROVIDED ARMOR
→ drop exactly once
```

Target drop chance:

```text
100%
```

The purpose is to return the player's invested equipment.

---

# 5. No Recruitment Refund

The following must never drop just because the unit dies:

```text
Emerald
Military Token
Command item
Recruitment fee
Hiring cost
```

Death must not refund recruitment.

Example:

```text
Player spends Emerald / Military Token
→ unit recruited
→ unit dies
→ recruitment item is NOT returned
```

This prevents recruitment loops and maintains economic cost.

---

# 6. No Valuable Base Loot

Recommended base loot table:

```text
NONE
```

A unit with no player-provided equipment should normally drop nothing valuable.

Do not add guaranteed:

```text
Emerald
Iron Ingot
Diamond
Gold
Military Token
rare resources
```

This avoids turning allied units into farming targets.

---

# 7. Optional Flavor Drop

For Phase 02, the recommended implementation is still:

```text
no base loot
```

If flavor loot is desired later, it should be low-value and optional, for example:

```text
0–1 Bread
```

with a low chance.

However this is **out of scope** for Phase 02 unless explicitly requested later.

---

# 8. Equipment Provenance State

The implementation must distinguish between:

```text
default equipment
player-provided equipment
```

Recommended persistent state:

```text
warchief:weapon_source
```

Possible enum:

```text
default
player
```

If armor source also needs to be tracked:

```text
warchief:helmet_source
warchief:chest_source
warchief:legs_source
warchief:boots_source
```

Each value:

```text
none
default
player
```

However, if Phase 02 only tests one armor item, do not overbuild all four slots yet.

---

# 9. Entity Property Option

Microsoft Bedrock entity properties persist across save/load and can be used to track per-entity state.

Example concept:

```json
"properties": {
  "warchief:weapon_source": {
    "type": "enum",
    "values": [
      "default",
      "player"
    ],
    "default": "default"
  }
}
```

Reference:

https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoentityproperties?view=minecraft-bedrock-stable

---

# 10. Default Weapon State

When the entity first spawns:

```text
weapon = minecraft:stone_sword
weapon_source = default
```

The unit should immediately use Stone Sword-tier combat values.

Example:

```text
Stone Sword damage tier = 5
```

or the project's current configured equivalent.

---

# 11. Replacing the Default Stone Sword

Example:

```text
Unit:
Stone Sword
weapon_source = default
```

Player gives:

```text
Iron Sword
```

Result:

```text
Stone Sword is replaced
Iron Sword becomes equipped
weapon_source = player
```

The replaced default Stone Sword:

```text
does NOT need to be returned to player
does NOT need to drop
```

because it was not originally player-owned.

---

# 12. Replacing a Player-Provided Weapon

Example:

```text
Current:
Iron Sword
weapon_source = player
```

Player gives:

```text
Diamond Sword
```

Preferred behavior:

```text
Iron Sword
→ returned/dropped exactly once

Diamond Sword
→ becomes equipped

weapon_source remains player
```

This prevents destruction of player investment.

If Phase 02 does not yet support clean replacement returns, Codex must document the limitation and avoid duplication.

---

# 13. Armor Rule

Base spawn:

```text
Armor = None
```

Therefore any armor equipped later is automatically:

```text
PLAYER-PROVIDED
```

That makes armor drop logic simpler.

On death:

```text
player-provided armor
→ 100% return/drop
```

---

# 14. `minecraft:equipment` Support

Bedrock's `minecraft:equipment` component supports an equipment table and per-slot drop chances through:

```text
slot_drop_chance
```

Reference:

https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_equipment?view=minecraft-bedrock-stable

Example concept:

```json
"minecraft:equipment": {
  "table": "loot_tables/equipment/villager_soldier_default.json",
  "slot_drop_chance": [
    {
      "slot": "slot.weapon.mainhand",
      "drop_chance": 0.0
    }
  ]
}
```

This works well for the default Stone Sword.

---

# 15. Important Limitation of Slot Drop Chance

A static:

```text
slot.weapon.mainhand = 0%
```

is not enough once a player replaces the default Stone Sword.

Example problem:

```text
default Stone Sword
→ 0% drop

player equips Diamond Sword
→ still same mainhand slot
→ static 0% would destroy player's Diamond Sword on death
```

Therefore player-provided equipment cannot rely only on one static `slot_drop_chance`.

The system needs state-aware handling.

---

# 16. Recommended Death Handling Architecture

Preferred design:

```text
ON DEATH
        ↓
inspect equipment source state
        ↓
default item?
→ do not return

player-provided item?
→ drop exactly once
```

This may require Script API or separate component groups/equipment states.

Use the simplest stable approach that preserves correctness.

---

# 17. Script API Death Handling Option

If pure data-driven JSON cannot safely distinguish default vs player-provided equipment, Script API is acceptable.

Conceptual flow:

```text
Entity dies
        ↓
check weapon_source
        ↓
if player:
    read equipped weapon
    spawn/drop one copy

check armor source
        ↓
if player:
    drop each equipped armor piece

then ensure entity equipment does not also auto-drop duplicate copies
```

Avoid double-drop.

---

# 18. Duplication Prevention

This is mandatory.

Bad:

```text
minecraft:equipment auto-drop
+
Script API manual drop
=
2 Diamond Swords
```

Only one mechanism should return a specific player-provided item.

Codex must explicitly document which system is authoritative.

---

# 19. Recommended Authoritative Rule

Suggested architecture:

## Default Stone Sword

```text
minecraft:equipment
→ gives default Stone Sword
→ static drop chance 0%
```

## Player weapon

When player replaces the default weapon:

```text
mark weapon_source = player
```

For death:

```text
custom death handling
→ returns player weapon
```

If the entity component automatically drops the current slot despite default configuration changes, restructure the component group so the player-equipment state uses:

```text
drop_chance = 1.0
```

A data-driven state swap is preferable to Script API manual item spawning when reliable.

---

# 20. Data-Driven State Option

Possible component groups:

```text
warchief:weapon_default
warchief:weapon_player
```

Conceptually:

```text
weapon_default
→ mainhand drop chance 0%

weapon_player
→ mainhand drop chance 1.0
```

When player equips a weapon:

```text
remove weapon_default
add weapon_player
```

Codex must test whether `minecraft:equipment` slot drop behavior updates reliably when component groups change.

If yes, this is preferred.

---

# 21. Weapon Tier and Source Are Different States

Do not combine:

```text
weapon tier
```

and:

```text
weapon source
```

into one ambiguous property.

Recommended concept:

```text
warchief:weapon_tier
=
stone
iron
diamond
netherite

warchief:weapon_source
=
default
player
```

Example:

```text
Stone Sword
source = default
```

Later player gives another Stone Sword:

```text
Stone Sword
source = player
```

Same tier, different death behavior.

---

# 22. Phase 02 Default Combat State

On spawn:

```text
Villager Soldier
weapon = Stone Sword
weapon_source = default

Mercenary
weapon = Stone Sword
weapon_source = default
```

Both should use the project's Stone Sword damage tier.

This also doubles as the Phase 02 sword-rendering test.

---

# 23. Spawn Tests

Run:

```mcfunction
/summon minecraft:iron_golem ~ ~ ~
```

Expected:

```text
Stone Sword visible
Stone Sword damage active
weapon_source = default
```

Then:

```mcfunction
/summon minecraft:wolf ~ ~ ~
```

Expected the same default equipment rule.

---

# 24. Default Death Test

Test:

```text
spawn unit
do not give anything
kill unit
```

Expected:

```text
no Emerald
no Military Token
no recruitment item
no Stone Sword
no valuable base loot
```

Recommended expected drop:

```text
nothing
```

---

# 25. Player Weapon Death Test

Test:

```text
spawn unit
give Iron Sword
confirm it replaces Stone Sword
kill unit
```

Expected:

```text
exactly 1 Iron Sword drops
```

Not:

```text
Stone Sword
Emerald
Military Token
extra weapon
```

---

# 26. Player Armor Death Test

Test:

```text
spawn unit
give Iron Chestplate
kill unit
```

Expected:

```text
exactly 1 Iron Chestplate drops
```

If the unit also has player-provided weapon:

```text
1 weapon
+
1 armor item
```

each drops exactly once.

---

# 27. Full Equipment Death Test

Future-ready test:

```text
Diamond Sword
Iron Helmet
Iron Chestplate
Iron Leggings
Iron Boots
```

Kill unit.

Expected:

```text
each player-provided item drops once
```

No recruitment refund.

---

# 28. Save / Reload Test

Test:

```text
spawn unit
give Diamond Sword
save
reload
kill unit
```

Expected:

```text
Diamond Sword still drops exactly once
```

This proves provenance state survives reload.

Microsoft documents Entity Properties as persistent across save/load.

---

# 29. Upgrade Regression Test

Test:

```text
default Stone Sword
→ player gives Iron Sword
→ player later gives Diamond Sword
```

Expected:

```text
Iron Sword returned/dropped during replacement
Diamond Sword equipped
```

Then unit dies:

```text
Diamond Sword drops once
```

The old default Stone Sword never reappears.

---

# 30. Recruitment Item Test

If Phase 02 still temporarily uses Emerald recruitment for debug:

```text
recruit with Emerald
kill unit
```

Expected:

```text
Emerald is NOT dropped/refunded
```

Later when Phase 03 uses Military Token:

```text
Military Token is NOT dropped/refunded
```

---

# 31. Base Loot Decision

Final Phase 02 recommendation:

```text
BASE LOOT = NONE
```

This is intentionally simple.

A dead unit with no player-provided equipment drops:

```text
nothing
```

This avoids:

- allied unit farming;
- economic exploits;
- confusing loot;
- balancing work during Phase 02.

---

# 32. Future Flavor Loot

Flavor drops may be reconsidered during balancing.

Possible later ideas:

```text
Bread
Leather
small food chance
```

But not now.

Do not implement in Phase 02.

---

# 33. Loot Table Reference

Microsoft loot tables are still relevant for future base drops:

https://learn.microsoft.com/en-us/minecraft/creator/documents/createloottable?view=minecraft-bedrock-stable

However the Phase 02 policy intentionally uses:

```text
no valuable base loot
```

---

# 34. Phase 02 Addendum Checkpoint A — Default Equipment

- [ ] Villager Soldier spawns with Stone Sword.
- [ ] Mercenary spawns with Stone Sword.
- [ ] Stone Sword renders visually.
- [ ] Stone Sword-tier damage is active.
- [ ] Default source state is recorded.

---

# 35. Checkpoint B — Default Death

- [ ] Default Stone Sword does not drop.
- [ ] No Emerald drops.
- [ ] No Military Token drops.
- [ ] No valuable base loot drops.
- [ ] Entity with no player investment normally drops nothing.

---

# 36. Checkpoint C — Player Weapon

- [ ] Player can replace default Stone Sword.
- [ ] Player weapon source is recorded.
- [ ] Player weapon drops exactly once on death.
- [ ] No default Stone Sword reappears.

---

# 37. Checkpoint D — Player Armor

- [ ] Armor can be assigned/tested.
- [ ] Armor is considered player-provided.
- [ ] Player-provided armor drops exactly once on death.
- [ ] No duplication occurs.

---

# 38. Checkpoint E — Replacement

- [ ] Default → Player weapon replacement works.
- [ ] Player → Player weapon replacement does not destroy old player gear.
- [ ] Old player equipment is returned/dropped once.
- [ ] New equipment becomes authoritative.

---

# 39. Checkpoint F — Persistence

- [ ] Equipment source survives save/reload.
- [ ] Weapon tier survives save/reload.
- [ ] Player-provided equipment still returns after reload.
- [ ] Default equipment still does not drop after reload.

---

# 40. Acceptance Criteria

This addendum is complete when:

- [ ] Both custom units spawn with Stone Sword.
- [ ] Default Stone Sword is not treated as player property.
- [ ] Default Stone Sword does not need to drop.
- [ ] Base death loot is empty.
- [ ] Emerald recruitment cost never drops.
- [ ] Military Token never drops.
- [ ] Player-provided weapons drop exactly once.
- [ ] Player-provided armor drops exactly once.
- [ ] Equipment replacement does not destroy player investment.
- [ ] No duplicate equipment drops occur.
- [ ] Save/reload preserves equipment provenance.
- [ ] Stone Sword-tier damage remains active on fresh spawn.

---

# 41. Codex Instructions

Codex must:

1. Read the main Phase 02 document first.
2. Treat this file as the authoritative death-drop policy.
3. Give both custom units a default Stone Sword.
4. Mark default equipment separately from player-provided equipment.
5. Do not refund Emerald recruitment cost.
6. Do not refund Military Token.
7. Do not add valuable base loot.
8. Default death with no player investment should drop nothing.
9. Return player-provided weapon exactly once on death.
10. Return player-provided armor exactly once on death.
11. Prevent double-drop between `minecraft:equipment` and Script API.
12. Preserve source state across save/reload.
13. Test default → player weapon replacement.
14. Test player → player weapon upgrade.
15. Document the exact implementation chosen.
16. Stop before adding unrelated loot systems.

---

# 42. Final Policy Summary

```text
UNIT SPAWNS
→ Stone Sword
→ source = DEFAULT

UNIT DIES WITHOUT PLAYER EQUIPMENT
→ no Stone Sword
→ no Emerald
→ no Military Token
→ no valuable base loot
→ normally nothing drops

PLAYER GIVES WEAPON / ARMOR
→ source = PLAYER

UNIT DIES
→ every player-provided item returns exactly once

RECRUITMENT COST
→ never refunded
```

This policy applies to:

```text
minecraft:iron_golem  → Villager Soldier
minecraft:wolf        → Mercenary
```
