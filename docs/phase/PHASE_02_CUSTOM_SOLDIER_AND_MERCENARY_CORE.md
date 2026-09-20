# Phase 02 — Custom Soldier and Mercenary Core

> Project: **Minecraft Warchief Village Bedrock Add-On**  
> Target baseline: **Minecraft Bedrock 1.26.40**  
> Namespace: `warchief`  
> Purpose: master the successful Phase 01 vanilla replacements so `minecraft:iron_golem` fully becomes Villager Soldier and `minecraft:wolf` fully becomes Mercenary.

> **Implementation decision update:** Phase 02 does **not** create separate `warchief:*` custom entities. The active architecture is full replacement of the two vanilla entities already proven in Phase 01. This keeps spawn eggs, summon commands, model/texture replacement, sounds, ownership, equipment, and death-drop policy focused on the existing `minecraft:iron_golem` and `minecraft:wolf` overrides.

---

# 1. Phase 02 Goal

Phase 02 masters the temporary Phase 01 shells as the production alpha entities:

```text
minecraft:wolf
minecraft:iron_golem
```

They remain the authoritative playable units:

```text
minecraft:wolf        → Mercenary
minecraft:iron_golem  → Villager Soldier
```

Phase 02 is the point where:

- vanilla replacement identifiers remain authoritative;
- the new Mercenary and Villager Soldier textures are used;
- vanilla Wolf and Iron Golem are intentionally overridden as Warchief units;
- Phase 01 behavior discoveries are migrated selectively;
- Iron-Golem-specific bugs are removed instead of carried forward;
- equipment rendering compatibility is tested;
- water navigation is fixed;
- healing behavior is redesigned;
- drop behavior is defined;
- spawn eggs and entity names become Warchief-specific even though the backing identifiers remain vanilla.

Phase 02 is **not** yet the final ownership/equipment gameplay phase.

Phase 03 will implement:

- final Military Token flow;
- Villager → Soldier conversion;
- final multiplayer-safe ownership;
- full weapon equipment;
- full armor gameplay;
- final follow/patrol ownership flow.

---

# 2. Official Documentation References

Codex should treat these as primary technical references.

## Custom entities

**Creating New Entity Types**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoaddentity?view=minecraft-bedrock-stable

**Entity Behavior Introduction**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/entitybehaviorintroduction?view=minecraft-bedrock-stable

**Entity Components Guide**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/entitycomponentsguide?view=minecraft-bedrock-stable

**Entity Component Reference**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/componentlist?view=minecraft-bedrock-stable

## Current Bedrock version

**Minecraft Bedrock 1.26.40 Creator Update Notes**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.26.40?view=minecraft-bedrock-stable

## Navigation / water

**minecraft:navigation.walk**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_navigation.walk?view=minecraft-bedrock-stable

**Entity Components Guide — navigation.generic example**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/entitycomponentsguide?view=minecraft-bedrock-stable

## Combat / knockback

**minecraft:apply_knockback_rules**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_apply_knockback_rules?view=minecraft-bedrock-stable

**minecraft:knockback_resistance**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_knockback_resistance?view=minecraft-bedrock-stable

**minecraft:attack**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_attack?view=minecraft-bedrock-stable

## Interactions / healing

**minecraft:interact**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_interact?view=minecraft-bedrock-stable

**ItemFoodComponent**  
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemfoodcomponent?view=minecraft-bedrock-stable

## Loot / drops

**Creating a Loot Table**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/createloottable?view=minecraft-bedrock-stable

**minecraft:loot**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_loot?view=minecraft-bedrock-stable

**minecraft:equipment**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_equipment?view=minecraft-bedrock-stable

## Vanilla Iron Golem reference

**Current vanilla Iron Golem behavior sample**  
https://github.com/Mojang/bedrock-samples/blob/main/behavior_pack/entities/iron_golem.json

**Current vanilla Iron Golem client entity**  
https://github.com/Mojang/bedrock-samples/blob/main/resource_pack/entity/iron_golem.entity.json

## Spawn egg / entity naming

**Minecraft Entity Wizard — Spawn Egg**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/minecraftentitywizard?view=minecraft-bedrock-stable

---

# 3. Phase 01 Findings That Must Be Fixed in Phase 02

Phase 01 discovered several issues caused by using vanilla Iron Golem and Wolf as temporary shells.

These issues must **not** be copied blindly into the final custom entities.

---

# 4. Finding A — Iron Golem Knockback Is Too Strong

The Phase 01 Iron Golem prototype still knocks enemies too far away during combat.

This is not appropriate for a normal Villager Soldier.

The current vanilla Iron Golem definition includes a dedicated:

```text
minecraft:apply_knockback_rules
```

configuration.

Current Mojang vanilla samples show Iron Golem-specific values approximately like:

```json
"minecraft:apply_knockback_rules": {
  "presets": [
    {
      "horizontal_power": 0.52,
      "vertical_power": 0.39,
      "vertical_velocity_cap": 0.8
    }
  ]
}
```

Phase 02 must **not inherit this Iron Golem knockback profile**.

---

# 5. Villager Soldier Knockback Policy

The Villager Soldier should feel like a sword-wielding humanoid.

Desired result:

```text
hit enemy
→ normal/minor knockback
→ enemy remains in reasonable melee range
```

Not:

```text
hit enemy
→ enemy launches several blocks away
```

Recommended approach:

## Option A — Preferred

Do not define a special `minecraft:apply_knockback_rules` component at all unless testing proves it is necessary.

Use normal/default melee knockback behavior.

## Option B — Explicit reduced knockback

If the custom entity still produces undesirable knockback, define a reduced rule.

Prototype starting point:

```json
"minecraft:apply_knockback_rules": {
  "presets": [
    {
      "horizontal_power": 0.2,
      "vertical_power": 0.1,
      "vertical_velocity_cap": 0.2
    }
  ]
}
```

These values are not final balance values.

Codex must test:

```text
default
0.20 / 0.10
0.15 / 0.05
```

and select the most natural soldier-like result.

---

# 6. Finding B — Iron Golem Sinks and Cannot Recover from Water

Phase 01 revealed that the Iron Golem prototype sinks in water and cannot naturally return to land.

This comes from vanilla Iron Golem navigation assumptions and must not exist on the custom Villager Soldier.

Microsoft documents navigation fields including:

```text
can_swim
can_sink
can_path_over_water
is_amphibious
```

The current custom Soldier should behave as a humanoid unit.

---

# 7. Villager Soldier Water Navigation

Recommended custom navigation:

```json
"minecraft:navigation.walk": {
  "avoid_damage_blocks": true,
  "can_path_over_water": true,
  "can_swim": true,
  "can_sink": false,
  "can_walk": true,
  "can_open_doors": true,
  "can_pass_doors": true
}
```

Exact supported fields must be validated against the current schema.

The intent is:

```text
walk on land
→ enter water if required
→ remain capable of pathfinding
→ swim toward destination / shore
→ exit water
→ continue follow/patrol
```

Do not intentionally preserve Iron Golem sinking.

---

# 8. Water Behavior Acceptance

The Soldier does not need player-quality swimming animation in Phase 02.

Mechanical correctness matters first.

Required:

- can enter shallow water;
- can cross a river;
- does not permanently sink to the bottom;
- can path toward shore;
- can exit onto a normal one-block shoreline;
- FOLLOW mode continues working after water crossing;
- PATROL mode does not trap unit underwater.

Animation polish can happen later.

---

# 9. Finding C — Iron Ingot Healing Must Be Removed

Vanilla Iron Golem uses:

```text
Iron Ingot
→ repair/heal
```

The current Mojang vanilla behavior includes an interaction that heals the Iron Golem when a player uses an Iron Ingot.

This mechanic must **not** exist on:

```text
minecraft:iron_golem  → Villager Soldier
minecraft:wolf        → Mercenary
```

They are humanoid military units, not constructs.

Required Phase 02 rule:

```text
Iron Ingot
→ NO healing
→ NO repair sound
→ NO special interaction
```

---

# 10. New Healing Design — Food

Both custom units should be healable with food.

Desired UX:

```text
unit is damaged
+
player right-clicks unit with food
        ↓
food consumed
        ↓
unit heals
```

Phase 02 should support **any item that Bedrock recognizes as food**, where technically feasible.

---

# 11. Food Detection Strategy

Because `minecraft:interact` is easiest when matching explicit item IDs, supporting every food item with a huge hard-coded list is not ideal.

Preferred implementation:

```text
PlayerInteractWithEntity
        ↓
inspect ItemStack
        ↓
does held item expose food component?
        ↓ yes
consume one item
heal unit
```

Use the stable Script API item-food component if supported by the installed `@minecraft/server` version.

The documentation exposes `ItemFoodComponent`.

Codex must verify the exact runtime API before implementation.

Do not assume arbitrary items are food based on their name.

---

# 12. Food Healing Amount

Keep Phase 02 simple.

Recommended baseline:

```text
Any valid food item
→ heal 4 HP
```

Do not implement detailed hunger/nutrition-based scaling yet unless it is trivial.

Reason:

- Phase 02 focuses on entity foundation;
- complex healing balance belongs later;
- every food item should behave predictably.

Alternative allowed if easy:

```text
heal = clamp(food nutrition, 2, 8)
```

But if this complicates the code, use fixed `4 HP`.

Recommended default for Codex:

```text
4 HP
```

---

# 13. Food Interaction Rules

Required:

```text
unit at full health
→ food is NOT consumed

unit damaged
→ player uses valid food
→ consume exactly 1
→ heal

iron_ingot
→ nothing

non-food random item
→ nothing
```

Phase 02 does not need final owner-gating for food healing unless the existing ownership infrastructure makes it trivial.

Preferred UX:

- any friendly player can feed unit in Phase 02 testing;
- final owner policy can be decided in Phase 03.

---

# 14. Mercenary Water Navigation

The Mercenary should also use humanoid-compatible navigation.

Do not blindly copy vanilla Wolf navigation if the custom humanoid behaves poorly.

Both entities should share a common navigation philosophy:

```text
land movement
water traversal
door/path compatibility
normal jumping
```

They may have different movement speeds.

---

# 15. Phase 02 Entity Identifiers

Create:

```text
warchief:villager_soldier
warchief:mercenary
```

Both must be:

```text
is_summonable: true
is_spawnable: true
```

during Phase 02 development/testing.

`is_spawnable: true` creates spawn eggs for Creative testing.

Phase 03/Release may revisit whether spawn eggs should remain visible.

---

# 16. Spawn Egg Names Must Be Correct

Phase 02 must stop presenting these prototypes as:

```text
Wolf
Iron Golem
```

Creative inventory should show:

```text
Spawn Villager Soldier
Spawn Mercenary
```

Entity names should show:

```text
Villager Soldier
Mercenary
```

Recommended localization:

```text
entity.minecraft:iron_golem.name=Villager Soldier
item.spawn_egg.entity.minecraft:iron_golem.name=Spawn Villager Soldier

entity.minecraft:wolf.name=Mercenary
item.spawn_egg.entity.minecraft:wolf.name=Spawn Mercenary
```

---

# 17. Spawn Egg Appearance

Do not reuse Wolf or Iron Golem spawn egg appearance.

Use either:

## Option A — simple colors

Villager Soldier:

```text
base: olive / village green
overlay: brown / tan
```

Mercenary:

```text
base: dark gray
overlay: dark red
```

## Option B — custom 16x16 spawn egg texture

Allowed if easy.

Not required for Phase 02 completion.

---

# 18. New Texture Assets

Use the user's new textures.

Recommended paths:

```text
resource_pack/textures/entity/warchief/villager_soldier.png
resource_pack/textures/entity/warchief/mercenary.png
```

Do not bake armor into these textures.

These are base clothing / identity textures.

---

# 19. Custom Client Entities

Create:

```text
resource_pack/entity/villager_soldier.entity.json
resource_pack/entity/mercenary.entity.json
```

Each custom client entity should define:

- identifier;
- materials;
- textures;
- geometry;
- animations;
- animation controllers;
- render controllers;
- spawn egg visual.

The identifier must match the Behavior Pack entity exactly.

---

# 20. Geometry Strategy

Reuse the working Pillager-compatible humanoid geometry from Phase 01 if it already looks correct.

Do not unnecessarily rebuild the model.

Recommended:

```text
geometry.warchief.humanoid
```

or separate geometry only if needed:

```text
geometry.warchief.villager_soldier
geometry.warchief.mercenary
```

---

# 21. Equipment-Ready Geometry

Phase 02 must prepare the model for later equipment rendering.

Required bone/locator review:

```text
head
body
rightArm
leftArm
rightLeg
leftLeg
```

Recommended held-item locator/bone if the chosen render pipeline requires it:

```text
rightItem
leftItem
```

Do not draw weapon directly into the entity texture.

---

# 22. Equipment Rendering Proof-of-Concept

Phase 02 should test compatibility, not implement final gameplay.

Required tests:

## Test A — sword

Try to visually render:

```text
minecraft:iron_sword
```

in the unit's main hand.

Success means:

```text
custom entity
→ main-hand equipment state
→ sword visibly appears
```

## Test B — armor

Test one armor item or one simple set.

Preferred first test:

```text
minecraft:iron_chestplate
```

or full Iron set if easier.

The purpose is only to answer:

> Can this custom humanoid entity render equipment cleanly?

---

# 23. Equipment Rendering Is Not Yet Full Equipment Gameplay

Phase 02 must **not** implement all armor tiers as production gameplay.

Do not expand into:

```text
Iron
Diamond
Netherite
full armor stats
ownership
replacement rules
durability
full persistence
```

unless required solely to prove rendering.

Those belong to Phase 03.

---

# 24. Villager Soldier Base Combat

Recommended initial values:

```text
Health: 24–28
Base no-sword damage: 2–3
Movement: approximately Pillager / humanoid speed
```

Do not copy:

- vanilla Iron Golem health;
- vanilla Iron Golem 7–21 damage;
- Iron Golem high knockback;
- Iron Golem water avoidance/sinking behavior.

---

# 25. Mercenary Base Combat

Recommended initial values:

```text
Health: 22–24
Base damage: 2–3
Movement: slightly faster than Villager Soldier if desired
```

Phase 02 should preserve Mercenary identity as a mobile personal fighter.

---

# 26. Basic Melee AI

Both custom entities should have a clear basic melee stack.

At minimum:

```text
target hostile
approach target
melee attack
return to normal mode
```

Avoid copying dozens of Iron Golem-specific behavior goals.

Prefer small, explicit custom entity definitions.

---

# 27. Villager Soldier Command Foundation

Port the Phase 01 Improvement design:

```text
PATROL
FOLLOW
```

Do not restore Banner-based individual follow.

Default:

```text
PATROL
```

Owner interaction:

```text
PATROL ↔ FOLLOW
```

If ownership is still prototype-level in Phase 02, keep it simple.

The purpose is to prove the custom entity can reproduce the Phase 01 command feel.

Final multiplayer-safe ownership belongs to Phase 03.

---

# 28. FOLLOW Mode

Use native:

```text
minecraft:behavior.follow_owner
```

or the cleanest native owner-follow approach available to the custom entity.

Desired:

```text
near
→ normal pathfinding

far / stuck
→ native teleport recovery allowed
```

Do not implement continuous Script API teleport movement.

---

# 29. PATROL Mode

Use:

```text
random_stroll
home/restriction if practical
move_towards_restriction if practical
```

Goal:

```text
patrol locally
fight nearby enemies
return to duty area
```

Mercenary may keep Wolf-style sit/stay as the stop-follow toggle. Any ugly or missing humanoid sitting animation is acceptable for Phase 02 as long as the gameplay state works.

---

# 30. Iron Golem Player-Build Ritual Must Be Disabled

Desired project rule:

```text
Iron Block structure
+
Carved Pumpkin
→ should not leave any spawned entity alive
```

Reason:

- player-built Iron Golem ritual is not part of the Warchief unit flow;
- Villager Soldier should be created by the allowed spawn/test/recruitment paths, not the vanilla iron structure;
- no wolf, cat, golem, Soldier, or other entity should remain spawned from this ritual.

---

# 31. Important Technical Note — Iron Golem Construction

Current vanilla Iron Golem behavior contains distinct events:

```text
minecraft:from_player
minecraft:from_village
```

The Mojang vanilla sample shows:

```text
minecraft:from_player
→ player_created component group

minecraft:from_village
→ village_created component group
```

However, the actual iron-block + carved-pumpkin pattern recognition is not exposed as a simple documented custom-entity toggle.

Therefore Phase 02 must treat this as a targeted vanilla override / research task.

Do **not** disable natural village Iron Golem spawning.

---

# 32. Iron Golem Construction Disable Strategy

Override the vanilla:

```text
minecraft:from_player
```

event so that player-created Iron Golems are immediately removed while leaving non-player-created behavior separate.

Expected behavior:

```text
player builds Iron Golem structure
→ game attempts to spawn minecraft:iron_golem
→ from_player applies disable group
→ spawned entity is removed immediately
```

Codex must verify:

1. whether any visible entity remains after the ritual;
2. whether Iron Blocks/Pumpkin are consumed before Bedrock fires `minecraft:from_player`;
3. whether `/summon minecraft:iron_golem` still works for test spawning;
4. whether natural village spawning behavior remains acceptable for the current replacement phase.

---

# 33. Construction UX Requirement

Best user experience:

```text
player places carved pumpkin on iron structure
→ no entity remains spawned
```

If this does not happen in runtime testing:

- document exact behavior;
- check `minecraft:from_player` handling;
- keep ritual disable as the target behavior.

---

# 34. Vanilla Iron Golem Spawn Egg

Vanilla Iron Golem itself is not the Soldier anymore.

Do not rename the vanilla `minecraft:iron_golem` to Villager Soldier.

Instead:

```text
Vanilla Iron Golem
→ remains Iron Golem

warchief:villager_soldier
→ Spawn Villager Soldier
```

The same applies to Wolf:

```text
Vanilla Wolf
→ remains Wolf

warchief:mercenary
→ Spawn Mercenary
```

Phase 02 must remove the Phase 01 visual/behavior override that made vanilla mobs appear as Warchief units.

---

# 35. Vanilla Restoration

After Phase 02 migration:

```text
minecraft:wolf
```

must once again behave/render like a normal Wolf.

```text
minecraft:iron_golem
```

must once again behave/render like a normal Iron Golem, except for the intentional player-build disable experiment described above.

Do not leave Phase 01 textures on vanilla entities.

---

# 36. Drop Item Design

Recommended Phase 02 design:

> Custom units should not generate free valuable loot beyond equipment they were already carrying.

This prevents recruitment/spawn abuse.

Do not make units drop:

```text
Emeralds
Diamonds
Iron Ingots
Military Tokens
random high-value loot
```

by default.

---

# 37. Equipment Drop Policy

Recommended final direction:

```text
equipped weapon
→ 100% drop on death

equipped armor
→ 100% drop on death
```

Why:

- player invested those items;
- losing unit should not destroy expensive equipment;
- prevents frustrating loss;
- does not create duplication if the item was actually removed from player inventory when equipped.

Bedrock `minecraft:equipment` supports:

```text
slot_drop_chance
```

for equipment slots.

For Phase 02:

- prove main-hand equipped item can drop reliably;
- armor drop can remain proof-of-concept if armor system is not final yet.

---

# 38. Base Loot Policy

Recommended Phase 02 loot table:

```text
No guaranteed base material drops.
```

Optional flavor later:

```text
0–1 bread
very low chance
```

But this is not recommended yet.

Keep Phase 02 simple.

Suggested:

```json
{
  "pools": []
}
```

or no base loot table if equipment dropping is handled separately.

The only meaningful death drops should be equipment already owned by the unit.

---

# 39. Why No Emerald Drop

Do not refund the recruitment Emerald on death.

Reason:

- Emerald is the recruitment cost;
- refund creates loop abuse;
- later Military Token / economy system needs meaningful cost.

---

# 40. Death Drop Tests

Required:

```text
unit with no weapon
→ dies
→ no valuable free loot

unit with iron sword
→ dies
→ iron sword drops exactly once

unit with equipment
→ save/reload
→ dies
→ equipment still drops exactly once
```

No duplication.

---

# 41. Suggested Behavior Pack Structure

```text
behavior_pack/
├── entities/
│   ├── villager_soldier.json
│   └── mercenary.json
├── loot_tables/
│   └── entities/
│       ├── villager_soldier.json
│       └── mercenary.json
├── equipment/
│   └── ...
├── scripts/
│   └── main.js
└── texts/
```

If the project uses TypeScript modules:

```text
src/
├── main.ts
└── phase02/
    ├── healing.ts
    ├── command.ts
    └── debug.ts
```

Only create files actually needed.

---

# 42. Suggested Resource Pack Structure

```text
resource_pack/
├── entity/
│   ├── villager_soldier.entity.json
│   └── mercenary.entity.json
├── models/
│   └── entity/
│       └── warchief_humanoid.geo.json
├── textures/
│   └── entity/
│       └── warchief/
│           ├── villager_soldier.png
│           └── mercenary.png
├── animations/
├── animation_controllers/
├── render_controllers/
├── attachables/
└── texts/
```

---

# 43. Localization

Add:

```text
entity.warchief:villager_soldier.name=Villager Soldier
item.spawn_egg.entity.warchief:villager_soldier.name=Spawn Villager Soldier

entity.warchief:mercenary.name=Mercenary
item.spawn_egg.entity.warchief:mercenary.name=Spawn Mercenary
```

Do not reuse:

```text
Wolf
Iron Golem
```

for custom entities.

---

# 44. Phase 02 Implementation Order

Codex must implement in this order.

## Step 1

Inspect the current repository and Phase 01 reports.

## Step 2

Copy working Phase 01 visual assets into new Warchief custom paths.

## Step 3

Create:

```text
warchief:villager_soldier
warchief:mercenary
```

Behavior Pack entities.

## Step 4

Create matching Resource Pack client entities.

## Step 5

Restore vanilla Wolf / Iron Golem RP overrides.

## Step 6

Restore vanilla Wolf / Iron Golem BP overrides unless an explicit construction-disable patch still needs Iron Golem behavior override.

## Step 7

Add basic movement/navigation.

## Step 8

Fix water navigation.

## Step 9

Add basic combat.

## Step 10

Remove Iron-Golem-style outgoing knockback.

## Step 11

Port FOLLOW / PATROL behavior.

## Step 12

Implement food healing.

## Step 13

Verify Iron Ingot no longer heals custom Soldier/Mercenary.

## Step 14

Add custom spawn eggs/names.

## Step 15

Test held sword rendering.

## Step 16

Test one armor rendering path.

## Step 17

Implement equipment death-drop proof.

## Step 18

Research/test disabling player-built vanilla Iron Golems while preserving village-created Iron Golems.

## Step 19

Run full Phase 02 test matrix.

## Step 20

Write `PHASE_02_RESULT.md`.

---

# 45. Checkpoint A — Replacement Entity Registration

Required:

```text
/summon minecraft:iron_golem
/summon minecraft:wolf
```

Both commands work and present as Warchief replacement units.

Creative inventory contains appropriate spawn eggs.

No Wolf/Iron Golem naming remains.

---

# 46. Checkpoint B — Visual Migration

Villager Soldier:

- uses new Villager Soldier texture;
- humanoid geometry correct;
- walking animation works;
- attack animation usable.

Mercenary:

- uses new Mercenary texture;
- humanoid geometry correct;
- walking animation works;
- attack animation usable.

Vanilla Wolf and Iron Golem return to vanilla visuals.

---

# 47. Checkpoint C — Movement

Both:

- walk on flat terrain;
- climb normal one-block height;
- navigate around basic obstacle;
- do not jitter;
- do not slide artificially.

Villager Soldier:

- patrol mode works;
- follow mode works.

Mercenary:

- basic owner-follow-ready behavior works.

---

# 48. Checkpoint D — Water

Test river width:

```text
3 blocks
8 blocks
15 blocks
```

For each:

- enter water;
- move/swim toward destination;
- do not remain stuck on bottom;
- exit water;
- resume navigation.

Also test:

```text
FOLLOW owner across river
```

Expected:

```text
unit eventually reaches owner
```

---

# 49. Checkpoint E — Combat / Knockback

Test against:

```text
Zombie
Pillager
Vindicator
```

Record:

- hits to kill;
- horizontal knockback;
- vertical launch;
- chase behavior.

Required:

```text
no Iron-Golem-style launch
```

Enemy should remain in normal melee combat distance.

---

# 50. Checkpoint F — Food Healing

Test damaged unit with:

```text
Bread
Carrot
Cooked Beef
Apple
Potato
other vanilla foods
```

Expected:

```text
food recognized
1 item consumed
unit heals
```

Test at full health:

```text
food not consumed
```

Test:

```text
Iron Ingot
```

Expected:

```text
no heal
no consume
no repair sound
```

---

# 51. Checkpoint G — Equipment Rendering

Test:

```text
Iron Sword
```

Expected:

- item assigned to main hand;
- visually appears if attachable/equipment rendering works;
- no duplicate item.

Test:

```text
Iron Chestplate
```

Expected:

- proof-of-concept visual if supported;
- clipping documented.

Phase 02 does not fail if final armor visual needs Phase 03, but the compatibility result must be documented.

---

# 52. Checkpoint H — Drops

Test:

```text
no equipment
→ death
```

Expected:

```text
no valuable free loot
```

Test:

```text
iron sword equipped
→ death
```

Expected:

```text
one iron sword drop
```

No duplicate.

---

# 53. Checkpoint I — Vanilla Entity Restoration

Spawn:

```text
minecraft:wolf
minecraft:iron_golem
```

Expected:

```text
normal vanilla visuals
normal vanilla identity
```

Custom entity spawn eggs remain separate.

---

# 54. Checkpoint J — Iron Golem Build Ritual Disable

Construct:

```text
4 Iron Blocks in normal Golem pattern
+
Carved Pumpkin
```

Record:

- whether any entity remains spawned;
- whether blocks are consumed;
- whether `minecraft:from_player` applies the disable group;
- whether `/summon minecraft:iron_golem` still works for manual testing.

Required design goal:
The ritual must not leave a spawned entity alive.

```text
player-built Golem disabled
village-created Golem preserved
```

If block-loss side effects cannot be safely solved, document it explicitly.

---

# 55. Checkpoint K — Spawn Egg Identity

Creative inventory should include:

```text
Spawn Villager Soldier
Spawn Mercenary
```

Do not show custom units as:

```text
Wolf
Iron Golem
```

Vanilla eggs/entities retain vanilla names.

---

# 56. Regression Test — Phase 01 Features

Verify that migration did not accidentally lose:

- basic weapon-tier architecture;
- basic patrol/follow logic;
- humanoid visual;
- normal movement;
- basic hostile targeting;
- Emerald prototype logic only if intentionally retained for debugging.

Phase 03 may replace recruitment logic later.

---

# 57. Save / Reload Test

Spawn both entities.

Change state / equipment.

Save and reload.

Expected:

- custom entities survive;
- no missing entity;
- no lost texture;
- no corrupt command state;
- equipment proof state remains if persistence is implemented;
- no duplicate drops.

---

# 58. Performance Requirements

Do not:

- scan every entity every tick;
- continuously teleport units;
- create global water polling;
- poll inventories continuously;
- spam logs.

Prefer:

```text
native navigation
native AI goals
event-driven interactions
small Script API helpers
```

---

# 59. Phase 02 Acceptance Criteria

## Replacement entities

- [ ] `minecraft:iron_golem` presents as Villager Soldier.
- [ ] `minecraft:wolf` presents as Mercenary.
- [ ] Both summon correctly.
- [ ] Both have renamed/recolored spawn eggs.
- [ ] Spawn egg/entity names are correct.

## Visuals

- [ ] New Villager Soldier texture is used.
- [ ] New Mercenary texture is used.
- [ ] Vanilla Wolf visual restored.
- [ ] Vanilla Iron Golem visual restored.
- [ ] Humanoid animation is usable.

## Movement

- [ ] Soldier navigation works naturally.
- [ ] Mercenary navigation works naturally.
- [ ] Soldier no longer sinks permanently in water.
- [ ] Soldier can exit water.
- [ ] River crossing is functional.

## Combat

- [ ] Villager Soldier fights basic hostile mobs.
- [ ] Mercenary fights basic hostile mobs.
- [ ] Iron-Golem-style high outgoing knockback is removed.
- [ ] Damage remains soldier-scale.

## Healing

- [ ] Iron Ingot does not heal Soldier.
- [ ] Iron Ingot does not heal Mercenary.
- [ ] Valid food heals damaged units.
- [ ] Food is not consumed at full health.
- [ ] Healing does not duplicate items.

## Command foundation

- [ ] Soldier PATROL works.
- [ ] Soldier FOLLOW works.
- [ ] Banner is not required for individual follow.
- [ ] Natural pathfinding is used.

## Equipment readiness

- [ ] Main-hand sword rendering is tested.
- [ ] At least one armor rendering path is tested.
- [ ] Result is documented even if visual clipping remains.

## Drops

- [ ] Unit without equipment does not generate valuable loot.
- [ ] Equipped weapon drop is tested.
- [ ] No duplicate equipment drops.
- [ ] No Emerald refund on death.

## Vanilla Iron Golem ritual

- [ ] Player-built Iron Golem disable approach is tested.
- [ ] Natural village Golem behavior is verified separately.
- [ ] Any block-consumption limitation is documented.

## Stability

- [ ] Save/reload works.
- [ ] No repeated severe content error.
- [ ] No repeated Script API exception.
- [ ] No per-tick movement hack remains.

---

# 60. Phase 02 Result Report

Codex must create:

```text
docs/PHASE_02_RESULT.md
```

Required structure:

```markdown
# Phase 02 Result

## Environment
- Bedrock version:
- @minecraft/server version:

## Custom Entities
### Villager Soldier
- Identifier:
- Texture:
- Geometry:
- Animations:
- Spawn egg:

### Mercenary
- Identifier:
- Texture:
- Geometry:
- Animations:
- Spawn egg:

## Navigation
- Land:
- Water:
- River crossing:
- Exit-water behavior:

## Combat
- Base damage:
- Knockback implementation:
- Knockback test result:

## Healing
- Food detection method:
- Heal amount:
- Full-health behavior:
- Iron Ingot result:

## Command
- Patrol:
- Follow:
- Teleport recovery:

## Equipment Rendering
- Sword:
- Armor:
- Clipping/issues:

## Drops
- Base loot:
- Weapon drop:
- Armor drop:
- Duplication result:

## Vanilla Restoration
- Wolf:
- Iron Golem:

## Player-Built Iron Golem Disable
- Build ritual result:
- from_player behavior:
- Block consumption result:
- Remaining limitation:

## Content Log Errors

## Files Changed

## Recommendation for Phase 03
```

---

# 61. Codex Rules

Codex must:

1. Read all Phase 01 reports first.
2. Do not rebuild the project from scratch.
3. Create true custom Warchief entities.
4. Stop using vanilla Wolf/Iron Golem as visual/gameplay shells.
5. Reuse successful Phase 01 assets/logic selectively.
6. Use the user's new textures.
7. Do not bake armor or swords into base texture.
8. Remove Iron Golem special knockback from Soldier.
9. Fix Soldier water navigation.
10. Remove Iron Ingot healing.
11. Implement food healing.
12. Make custom spawn egg names correct.
13. Test sword rendering.
14. Test one armor-render path.
15. Define safe equipment drop behavior.
16. Do not add valuable farmable base loot.
17. Research/test player-created Iron Golem disable without breaking natural village Golems.
18. Preserve natural village Iron Golem unless technically impossible and explicitly documented.
19. Avoid per-tick movement hacks.
20. Run all checkpoints.
21. Produce `PHASE_02_RESULT.md`.
22. Stop after Phase 02.

---

# 62. Definition of Phase 02 Success

Phase 02 is successful when:

```text
VILLAGER SOLDIER
custom warchief entity
+ new texture
+ humanoid animation
+ normal soldier knockback
+ proper land/water navigation
+ PATROL/FOLLOW foundation
+ food healing
+ no Iron Ingot repair
+ equipment-ready rendering
+ custom spawn egg/name

MERCENARY
custom warchief entity
+ new texture
+ humanoid animation
+ natural movement
+ basic combat
+ food healing
+ equipment-ready rendering
+ custom spawn egg/name

VANILLA ENTITIES
Wolf restored
Iron Golem restored
except intentional player-build-disable experiment
```

Phase 03 can then build the real recruitment, ownership, weapon, armor, and multiplayer systems on top of clean custom entities.
