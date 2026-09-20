# Phase 02 Improvement — Equipment Visual Rendering Fix

> Project: **Minecraft Warchief Village Bedrock Add-On**  
> Scope: Fix the visual rendering of weapons and armor for the Phase 02 replacement entities:
>
> ```text
> minecraft:iron_golem → Villager Soldier
> minecraft:wolf       → Mercenary
> ```
>
> This document is an improvement/addendum for the current Phase 02 implementation.
>
> It does **not** redesign the existing recruitment, combat, healing, drop, or command systems unless required to make equipment visuals actually work.

---

# 1. Why This Improvement Exists

The current Phase 02 report shows that:

- default Stone Sword state exists;
- weapon tier changes damage;
- player-provided armor changes defensive values;
- player equipment provenance is tracked;
- weapon/armor interaction consumes the item;
- `rightArm` / `leftArm` bones were adjusted for compatibility.

However, the actual weapon and armor visuals still do not reliably appear in-game.

This means the implementation is currently proving:

```text
GAMEPLAY STATE
✓ weapon tier
✓ damage
✓ armor defense
✓ item consumption
✓ death-drop provenance
```

but has not yet fully proven:

```text
ACTUAL EQUIPMENT SLOT
+
CLIENT ATTACHABLE RENDERING
+
COMPATIBLE HUMANOID GEOMETRY
```

That is the focus of this improvement.

---

# 2. Source-Derived Diagnosis

The current Phase 02 Completion Report states:

```text
Both entities get default Stone Sword state on spawn/load.
```

It also states:

```text
Player-provided armor now has a scripted defensive effect
even if visual rendering is still being validated.
```

And:

```text
The Pillager prototype geometry bone names were aligned to
rightArm and leftArm so vanilla attachables have the expected
arm bones/locators for held item and armor rendering tests.
```

These statements strongly suggest that the implementation currently relies heavily on:

```text
dynamic properties
damage state
defense state
```

and not yet on a fully verified:

```text
actual ItemStack in actual equipment slot
```

for every visible equipment piece.

Therefore this improvement must explicitly verify the real entity equipment slots.

---

# 3. Official Documentation References

Codex should use these official Microsoft/Mojang references as the primary source.

## Client Entity and Attachables

**Client Entity Documentation Introduction**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/cliententitydocumentation/cliententitydocumentationintroduction?view=minecraft-bedrock-stable

Important field:

```text
enable_attachables
```

This must be enabled so the entity can render attachables such as held items and armor.

---

## Attachables

**Attachables Documentation**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/attachables?view=minecraft-bedrock-stable

Use this reference to understand:

```text
item attachables
armor attachables
holder slots
geometry binding
materials
textures
render controllers
```

---

## Equippable Component

**minecraft:equippable**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_equippable?view=minecraft-bedrock-stable

This is used to define entity equipment slots and acceptable equipment.

---

## Equipment Component

**minecraft:equipment**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_equipment?view=minecraft-bedrock-stable

Use this for default spawn equipment tables when appropriate.

---

## Script API Equippable

**EntityEquippableComponent**  
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityequippablecomponent?view=minecraft-bedrock-stable

The implementation must verify the exact current API available in the installed:

```text
@minecraft/server
```

version.

---

## Mojang Vanilla Samples

**Mojang Bedrock Samples Repository**  
https://github.com/Mojang/bedrock-samples

Useful references:

```text
resource_pack/entity/player.entity.json
resource_pack/entity/pillager.entity.json
resource_pack/attachables/
resource_pack/models/entity/
behavior_pack/entities/
```

Codex should compare the actual Warchief client entity against known working vanilla entities that render held items / armor.

---

# 4. Main Likely Problem — `enable_attachables`

The custom/replacement client entity must explicitly support attachables.

Required client entity field:

```json
"enable_attachables": true
```

This must exist for both:

```text
Villager Soldier
Mercenary
```

Conceptual example:

```json
{
  "format_version": "1.10.0",
  "minecraft:client_entity": {
    "description": {
      "identifier": "minecraft:iron_golem",

      "materials": {
        "default": "entity_alphatest"
      },

      "textures": {
        "default": "textures/entity/warchief/villager_soldier"
      },

      "geometry": {
        "default": "geometry.warchief.humanoid"
      },

      "animations": {
      },

      "render_controllers": [
        "controller.render.warchief_humanoid"
      ],

      "enable_attachables": true
    }
  }
}
```

Mercenary must also have:

```json
"enable_attachables": true
```

Do not assume Pillager-like geometry automatically enables equipment rendering.

---

# 5. Important Concept — State Is Not Equipment

These are **not equivalent**:

```text
weapon_tier = stone
```

and:

```text
mainhand slot contains minecraft:stone_sword
```

Similarly:

```text
armor_points = 5
```

is not the same as:

```text
chest slot contains minecraft:leather_chestplate
```

A visible item requires an actual equipped item.

The correct architecture is:

```text
GAMEPLAY STATE
+
ACTUAL EQUIPMENT SLOT
+
CLIENT ATTACHABLE RENDERING
```

All three must agree.

---

# 6. Mandatory Equipment Pipeline

For visible weapon/armor, the pipeline must be:

```text
ItemStack exists
        ↓
ItemStack is assigned to entity equipment slot
        ↓
Entity has compatible equipment slot definition
        ↓
Client entity has enable_attachables = true
        ↓
Geometry contains compatible humanoid bones
        ↓
Vanilla/generic attachable binds to holder
        ↓
Item becomes visible
```

If any one of these fails, gameplay state may still work while the item remains invisible.

---

# 7. Default Spawn Equipment — New Requirement

Both units should spawn with:

```text
Stone Sword
+
Full Leather Armor
```

Default spawn set:

```text
Mainhand:
minecraft:stone_sword

Head:
minecraft:leather_helmet

Chest:
minecraft:leather_chestplate

Legs:
minecraft:leather_leggings

Feet:
minecraft:leather_boots
```

Applies to:

```text
minecraft:iron_golem → Villager Soldier
minecraft:wolf       → Mercenary
```

Reason:

- immediately proves weapon rendering;
- immediately proves all four armor slots;
- makes visual regression obvious;
- gives both units a clear low-tier military appearance;
- later player upgrades are easy to compare.

---

# 8. Default Spawn Equipment Is Still DEFAULT Gear

The default Stone Sword + Leather Armor are:

```text
DEFAULT SPAWN EQUIPMENT
```

They are **not** player-provided.

Therefore death behavior remains:

```text
default Stone Sword
→ no required drop

default Leather Armor
→ no required drop
```

Player-provided replacement equipment remains the only gear that must return/drop on death.

---

# 9. Updated Default Provenance

Recommended persistent source state:

```text
warchief:weapon_source = default
warchief:helmet_source = default
warchief:chest_source = default
warchief:legs_source = default
warchief:boots_source = default
```

When player replaces any slot:

```text
source = player
```

Do not confuse:

```text
equipment tier
```

with:

```text
equipment source
```

---

# 10. Actual Equipment Must Be Verified

Codex must not assume the default equipment is equipped just because properties were written.

After spawn, explicitly inspect the actual slots.

Required runtime verification:

```text
Mainhand
→ minecraft:stone_sword

Head
→ minecraft:leather_helmet

Chest
→ minecraft:leather_chestplate

Legs
→ minecraft:leather_leggings

Feet
→ minecraft:leather_boots
```

If any slot is empty:

```text
the visual issue is Behavior Pack / Script equipment assignment
```

If slots are correctly populated but visuals are invisible:

```text
the issue is Resource Pack / attachable / geometry / render pipeline
```

This distinction is mandatory.

---

# 11. Recommended Spawn Initialization

On spawn/load:

```text
if Mainhand empty:
    equip Stone Sword

if Head empty:
    equip Leather Helmet

if Chest empty:
    equip Leather Chestplate

if Legs empty:
    equip Leather Leggings

if Feet empty:
    equip Leather Boots
```

Do not overwrite player equipment on load.

Only apply default gear when the slot is empty and the corresponding source state is not `player`.

---

# 12. Preferred Native Default Equipment

If `minecraft:equipment` can populate all default slots reliably, prefer native data-driven equipment.

Conceptual:

```json
"minecraft:equipment": {
  "table": "loot_tables/equipment/warchief_default_loadout.json"
}
```

The equipment table should provide:

```text
Stone Sword
Leather Helmet
Leather Chestplate
Leather Leggings
Leather Boots
```

However, if the engine does not assign the exact intended slots predictably from the equipment table, use Script API to set the slots explicitly.

Correctness is more important than forcing a data-driven implementation.

---

# 13. Script API Explicit Equipment Option

If needed, use `EntityEquippableComponent`.

Conceptual pseudocode:

```ts
const equippable = entity.getComponent("minecraft:equippable");

equippable.setEquipment(
  EquipmentSlot.Mainhand,
  new ItemStack("minecraft:stone_sword", 1)
);

equippable.setEquipment(
  EquipmentSlot.Head,
  new ItemStack("minecraft:leather_helmet", 1)
);

equippable.setEquipment(
  EquipmentSlot.Chest,
  new ItemStack("minecraft:leather_chestplate", 1)
);

equippable.setEquipment(
  EquipmentSlot.Legs,
  new ItemStack("minecraft:leather_leggings", 1)
);

equippable.setEquipment(
  EquipmentSlot.Feet,
  new ItemStack("minecraft:leather_boots", 1)
);
```

Exact enum names / API signatures must be verified against the installed stable typings.

Do not copy pseudocode blindly.

---

# 14. `minecraft:equippable` Must Be Present

Both replacement entities should explicitly support equipment slots.

At minimum:

```text
Mainhand
Head
Chest
Legs
Feet
```

The actual JSON schema must be taken from the current Bedrock documentation.

Required accepted items should include:

## Weapon

```text
minecraft:wooden_sword
minecraft:stone_sword
minecraft:iron_sword
minecraft:diamond_sword
minecraft:netherite_sword
```

## Armor

At minimum:

```text
Leather
Iron
Diamond
Netherite
```

for:

```text
helmet
chestplate
leggings
boots
```

Gold can be added if desired, but it is not required for this improvement.

---

# 15. Geometry Requirements

The Pillager-compatible base geometry is still usable.

However, equipment rendering requires compatible bone naming and hierarchy.

Minimum bones:

```text
root
body
head
rightArm
leftArm
rightLeg
leftLeg
```

Possible held-item helper bones/locators:

```text
rightItem
leftItem
```

Only add these if the actual vanilla/generic attachable pipeline expects them.

Do not invent locators without checking a known working Mojang entity.

---

# 16. Bone Hierarchy Matters

Correct naming alone is not enough.

Bad example:

```text
rightArm
```

exists, but is parented incorrectly to:

```text
root
```

when animation/attachable expects it under:

```text
body
```

Potential result:

```text
weapon appears at origin
armor floats
armor clips badly
item invisible
```

Codex must compare the Warchief geometry hierarchy to a working humanoid vanilla model.

---

# 17. Recommended Bone Hierarchy

Preferred conceptual structure:

```text
root
├── body
│   ├── head
│   ├── rightArm
│   └── leftArm
├── rightLeg
└── leftLeg
```

If the current Pillager-compatible geometry already works for Pillager animation, preserve that hierarchy unless official vanilla attachable compatibility requires adjustment.

---

# 18. Weapon Rendering Test Comes First

Do not debug armor and sword simultaneously.

First target:

```text
Stone Sword
```

Required test sequence:

```text
spawn entity
→ inspect actual mainhand slot
→ slot must contain minecraft:stone_sword
→ check visual
```

Outcome A:

```text
slot empty
→ fix equipment assignment
```

Outcome B:

```text
slot correct
visual absent
→ fix RP attachable / client entity / geometry
```

Outcome C:

```text
slot correct
visual correct
→ weapon pipeline passed
```

Only after C, continue to armor.

---

# 19. Armor Rendering Test Order

Test one slot at a time.

Recommended order:

```text
1. Leather Chestplate
2. Leather Helmet
3. Leather Leggings
4. Leather Boots
```

Why:

- chestplate is easiest to see;
- helmet validates head binding;
- leggings validate body/leg binding;
- boots validate lower-leg/feet alignment.

---

# 20. Leather Armor Is the Default Visual Test

The new baseline after this improvement is:

```text
Villager Soldier
Stone Sword
Leather Helmet
Leather Chestplate
Leather Leggings
Leather Boots

Mercenary
Stone Sword
Leather Helmet
Leather Chestplate
Leather Leggings
Leather Boots
```

Armor does not need dyes/custom colors yet.

Use vanilla Leather Armor first.

---

# 21. Generic Armor Attachables

Do not assume every vanilla armor attachable is valid for non-player entities.

Some Mojang attachables are player-specific.

Avoid variants that explicitly filter:

```text
query.owner_identifier == 'minecraft:player'
```

for a replacement entity whose actual identifier is:

```text
minecraft:iron_golem
minecraft:wolf
```

Prefer generic humanoid armor attachables when available.

---

# 22. Player-Specific Attachables Are a Common Trap

If Codex uses files such as:

```text
*.player.json
```

and the attachable contains an owner identifier condition for `minecraft:player`, the armor may never render on:

```text
minecraft:iron_golem
minecraft:wolf
```

Therefore:

```text
player-specific attachable
≠ safe for Warchief replacement unit
```

This must be checked explicitly.

---

# 23. Generic Humanoid Armor Geometry

Vanilla armor attachables often use humanoid armor geometry.

Conceptually:

```text
geometry.humanoid.armor.*
```

This is desirable for the Warchief model because the model is intentionally Pillager/humanoid-like.

Do not replace the base Soldier/Mercenary geometry with armor geometry.

Armor remains an attachable layer over the base entity.

---

# 24. Render Controllers

The base entity still uses its own render controller.

Equipment visuals should come from attachables.

Do not try to manually draw:

```text
Stone Sword texture
Leather Chestplate texture
```

inside the base Warchief render controller unless vanilla attachables fundamentally fail.

Preferred:

```text
Base entity render controller
+
Attachable render controllers
```

---

# 25. Do Not Bake Armor Into Base Texture

The current custom Soldier/Mercenary textures must remain:

```text
base clothing only
```

Do not paint:

```text
Leather Helmet
Leather Chestplate
Sword
```

directly into the entity PNG.

Reason:

- equipment upgrades must visually change;
- player-provided armor must replace default visuals;
- weapon tier must remain dynamic.

---

# 26. Default Leather Armor Stats

This improvement focuses on visuals.

If current armor-defense logic already supports Leather Armor:

```text
use its existing low-tier defense value
```

If Leather Armor was not previously handled:

add the lowest intended armor tier.

Do not make default Leather Armor overly strong.

The purpose is:

```text
visible starter equipment
```

not a major balance buff.

---

# 27. Default Stone Sword Damage

Default Stone Sword remains the starter weapon.

Expected weapon tier:

```text
stone
```

Use the project's current Stone Sword normalized damage value.

Do not accidentally fall back to:

```text
base no-sword damage
```

when Stone Sword is visibly equipped.

---

# 28. Player Weapon Upgrade Flow

Example:

```text
Spawn
→ Stone Sword visible
→ source = default

Player gives Iron Sword
→ default Stone Sword removed
→ Iron Sword assigned to Mainhand
→ weapon_source = player
→ weapon_tier = iron
→ Iron Sword becomes visible
```

The visual must change immediately.

---

# 29. Player Armor Upgrade Flow

Example:

```text
Spawn
→ Leather Chestplate visible
→ chest_source = default

Player gives Iron Chestplate
→ Leather Chestplate removed
→ Iron Chestplate assigned to Chest
→ chest_source = player
→ Iron Chestplate becomes visible
```

The defense state and actual equipment slot must both update.

---

# 30. Default Gear Replacement Policy

When player replaces default equipment:

```text
default equipment
→ deleted/replaced
→ no refund required
```

Examples:

```text
Leather Chestplate default
→ player gives Iron Chestplate
→ Leather Chestplate disappears
→ no Leather Chestplate returned
```

and:

```text
Stone Sword default
→ player gives Diamond Sword
→ Stone Sword disappears
→ no Stone Sword returned
```

This remains consistent with the death-drop policy.

---

# 31. Player Gear Replacement Policy

When player replaces player-provided gear:

```text
player gear A
→ player gives gear B
```

the old player-provided item must not be destroyed.

Preferred:

```text
return/drop old player item exactly once
```

Then:

```text
new item becomes equipped
```

---

# 32. Death Drop Policy Must Remain Unchanged

Default gear:

```text
Stone Sword
Leather Helmet
Leather Chestplate
Leather Leggings
Leather Boots
```

does not need to drop.

Player-provided equipment:

```text
weapon
helmet
chestplate
leggings
boots
```

must drop exactly once.

Recruitment resources still do not drop:

```text
Emerald
Military Token
```

---

# 33. Important Anti-Duplication Rule

Do not combine:

```text
native equipment auto-drop
```

and:

```text
Script API manual drop
```

for the same player-provided item.

The implementation must choose one authoritative drop path per slot/state.

---

# 34. Render Isolation Debug Mode

Add a temporary debug mode if useful.

Recommended debug output when entity spawns:

```text
[Warchief Equipment Debug]
Entity: Villager Soldier
Mainhand: minecraft:stone_sword
Head: minecraft:leather_helmet
Chest: minecraft:leather_chestplate
Legs: minecraft:leather_leggings
Feet: minecraft:leather_boots
Attachables: expected enabled
```

Do not leave chat spam enabled for release.

Console/log output is preferable.

---

# 35. Mandatory First Test — Villager Soldier

Spawn:

```mcfunction
/summon minecraft:iron_golem ~ ~ ~
```

Expected gameplay identity:

```text
Villager Soldier
```

Expected visual equipment immediately:

```text
Stone Sword
Leather Helmet
Leather Chestplate
Leather Leggings
Leather Boots
```

If any visual is missing, stop and diagnose before moving to Mercenary.

---

# 36. Mandatory Second Test — Mercenary

Spawn:

```mcfunction
/summon minecraft:wolf ~ ~ ~
```

Expected gameplay identity:

```text
Mercenary
```

Expected visual equipment:

```text
Stone Sword
Full Leather Armor
```

Mercenary follow/sit behavior may remain Wolf-based internally, but visual equipment must still function.

---

# 37. Checkpoint A — Client Entity

For both replacement client entities:

- [ ] `enable_attachables: true` exists.
- [ ] custom texture still renders.
- [ ] custom humanoid geometry still renders.
- [ ] base animations still work.
- [ ] no severe content log error.

---

# 38. Checkpoint B — Actual Equipment Slots

Immediately after spawn:

- [ ] Mainhand = Stone Sword.
- [ ] Head = Leather Helmet.
- [ ] Chest = Leather Chestplate.
- [ ] Legs = Leather Leggings.
- [ ] Feet = Leather Boots.

Do not accept dynamic-property-only state as passing.

---

# 39. Checkpoint C — Stone Sword Visual

- [ ] Stone Sword visibly appears in hand.
- [ ] Sword follows hand/arm animation.
- [ ] Sword is not at entity origin.
- [ ] Sword is not floating behind entity.
- [ ] Sword does not remain static while arm moves.
- [ ] Stone-tier damage still applies.

---

# 40. Checkpoint D — Leather Chestplate

- [ ] Leather Chestplate visibly appears.
- [ ] Chestplate follows torso.
- [ ] Chestplate does not float away.
- [ ] Chestplate is not rendered at world origin.
- [ ] Major clipping is documented.

---

# 41. Checkpoint E — Full Leather Set

- [ ] Helmet visible.
- [ ] Chestplate visible.
- [ ] Leggings visible.
- [ ] Boots visible.
- [ ] Walking animation remains usable.
- [ ] Attack animation remains usable.
- [ ] Follow/patrol remains functional.

---

# 42. Checkpoint F — Weapon Upgrade

Test:

```text
Stone Sword
→ Iron Sword
→ Diamond Sword
```

Each step:

- [ ] previous equipment slot changes;
- [ ] visual changes immediately;
- [ ] damage tier changes;
- [ ] provenance changes correctly;
- [ ] no duplicate item.

---

# 43. Checkpoint G — Armor Upgrade

Test:

```text
Leather Chestplate
→ Iron Chestplate
→ Diamond Chestplate
```

Each step:

- [ ] actual Chest slot changes;
- [ ] visual changes;
- [ ] defense state changes;
- [ ] source state changes;
- [ ] no duplicate.

---

# 44. Checkpoint H — Save / Reload

Spawn unit with defaults.

Save/reload.

Expected:

- [ ] Stone Sword still equipped.
- [ ] Leather Armor still equipped.
- [ ] visuals still render.
- [ ] source remains default.

Then replace with player gear.

Save/reload.

Expected:

- [ ] player weapon remains.
- [ ] player armor remains.
- [ ] visuals remain.
- [ ] provenance remains player.

---

# 45. Checkpoint I — Death Drop

Default loadout death:

```text
Stone Sword + Leather Armor
```

Expected:

```text
no required equipment drops
```

Player-upgraded loadout death:

```text
Iron Sword + Iron Chestplate
```

Expected:

```text
1 Iron Sword
1 Iron Chestplate
```

exactly once.

---

# 46. Failure Classification

Codex must classify any visual failure.

## Category A — Equipment assignment failure

Symptoms:

```text
actual equipment slot is empty
```

Fix:

```text
Behavior Pack / Script equipment assignment
```

---

## Category B — Attachable disabled

Symptoms:

```text
slot contains correct item
but no held item / armor appears
```

First check:

```text
enable_attachables = true
```

---

## Category C — Wrong attachable variant

Symptoms:

```text
slot correct
enable_attachables true
some armor still invisible
```

Check:

```text
player-specific attachable
owner_identifier filter
```

Use generic humanoid attachable.

---

## Category D — Geometry mismatch

Symptoms:

```text
item appears in wrong place
armor floating
armor badly rotated
```

Check:

```text
bone names
bone hierarchy
locators
pivot positions
```

---

## Category E — Render-controller/material issue

Symptoms:

```text
geometry seems attached
but texture/material invisible or broken
```

Check:

```text
attachable materials
textures
render controllers
```

---

# 47. Content Log Requirement

Codex must inspect the Bedrock content log.

Record any message involving:

```text
attachable
geometry
bone
render controller
material
texture
equipment
equippable
slot
```

Do not simply say:

```text
visual not working
```

Record the exact error/warning.

---

# 48. Required Completion Report Update

Update:

```text
PHASE_02_COMPLETION_REPORT.md
```

Add:

```markdown
## Equipment Visual Rendering Fix

### Client Entity
- enable_attachables Villager Soldier:
- enable_attachables Mercenary:

### Default Loadout
- Stone Sword slot:
- Leather Helmet slot:
- Leather Chestplate slot:
- Leather Leggings slot:
- Leather Boots slot:

### Weapon Visual
- Stone Sword:
- Iron Sword:
- Diamond Sword:

### Armor Visual
- Leather Helmet:
- Leather Chestplate:
- Leather Leggings:
- Leather Boots:
- Iron Chestplate:

### Geometry
- bone hierarchy:
- rightArm:
- leftArm:
- head:
- body:
- legs:
- locators:

### Attachables
- generic/player-specific:
- custom copied attachables:
- render controllers:

### Save / Reload
- default equipment:
- player equipment:

### Known Visual Limitations

### Content Log Messages
```

---

# 49. Codex Implementation Order

Codex must follow this order.

1. Inspect current Phase 02 behavior files.
2. Inspect current Phase 02 client entity files.
3. Verify actual equipment slot implementation.
4. Add/verify `minecraft:equippable`.
5. Add `enable_attachables: true`.
6. Set Stone Sword as actual Mainhand equipment.
7. Test Stone Sword visual only.
8. If invisible, debug attachable/client/geometry before continuing.
9. Set Leather Chestplate as actual Chest equipment.
10. Test Chest visual.
11. Add Leather Helmet.
12. Add Leather Leggings.
13. Add Leather Boots.
14. Verify full Leather set.
15. Verify Soldier.
16. Verify Mercenary.
17. Test Iron Sword replacement.
18. Test Iron Chestplate replacement.
19. Test save/reload.
20. Test death-drop provenance.
21. Update Completion Report.
22. Stop after this visual improvement.

---

# 50. Do Not Do These Things

Do not:

- bake sword into the texture;
- bake armor into the texture;
- fake weapon visibility with a static texture;
- rely only on dynamic properties;
- rely only on damage state;
- claim success without inspecting actual slots;
- use player-only armor attachables without checking owner filters;
- add unrelated Phase 03 systems;
- rewrite follow/patrol unless equipment changes break it;
- change healing/drop policies unless required for equipment correctness.

---

# 51. Final Expected Spawn Appearance

## Villager Soldier

```text
Villager Soldier base texture
+
Leather Helmet
+
Leather Chestplate
+
Leather Leggings
+
Leather Boots
+
Stone Sword
```

Expected:

```text
low-tier village military unit
```

---

## Mercenary

```text
Mercenary base texture
+
Leather Helmet
+
Leather Chestplate
+
Leather Leggings
+
Leather Boots
+
Stone Sword
```

Expected:

```text
low-tier armed wandering fighter
```

---

# 52. Definition of Success

This Phase 02 improvement is complete only when:

```text
spawn unit
        ↓
actual equipment slots contain:
Stone Sword
Leather Helmet
Leather Chestplate
Leather Leggings
Leather Boots
        ↓
all equipment is visually rendered
        ↓
weapon/armor moves correctly with animation
        ↓
player equipment upgrades replace visuals
        ↓
save/reload preserves visuals
        ↓
death-drop provenance still works
```

The key success criterion is:

> Equipment must exist as **real equipped ItemStacks** and must be rendered by the **attachable-enabled humanoid client entity**.

Dynamic properties alone do not count as successful equipment rendering.
