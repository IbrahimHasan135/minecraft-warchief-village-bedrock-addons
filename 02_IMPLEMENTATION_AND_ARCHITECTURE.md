# Warchief Village Add-On — Implementation and Architecture

## 1. Purpose

This document defines the recommended technical architecture for implementing the Warchief Village Add-On in Minecraft Bedrock Edition.

The implementation should prioritize:

1. Vanilla compatibility.
2. Multiplayer safety.
3. Persistent ownership.
4. Maintainability.
5. Clear separation between gameplay systems.
6. Minimal overriding of vanilla entities.
7. Behavior Pack and Resource Pack compatibility.
8. Script API only where it meaningfully simplifies or stabilizes behavior.

This is an implementation guide, not an instruction to force one technical method if the current Bedrock API requires a better alternative.

The gameplay requirements in `01_GAME_CONCEPT.md` take priority over specific implementation suggestions in this file.

---

# 2. Recommended Pack Structure

Use one Behavior Pack and one Resource Pack.

Suggested namespace:

```text
warchief
```

Example root structure:

```text
WarchiefVillage/
├── behavior_pack/
│   ├── manifest.json
│   ├── entities/
│   ├── items/
│   ├── trading/
│   ├── loot_tables/
│   ├── functions/
│   ├── scripts/
│   │   ├── main.ts
│   │   ├── systems/
│   │   ├── entities/
│   │   ├── economy/
│   │   ├── military/
│   │   ├── population/
│   │   ├── raids/
│   │   └── worldgen/
│   └── ...
│
└── resource_pack/
    ├── manifest.json
    ├── entity/
    ├── models/
    │   └── entity/
    ├── textures/
    │   ├── entity/
    │   └── items/
    ├── animations/
    ├── animation_controllers/
    ├── render_controllers/
    ├── attachables/
    └── texts/
```

Do not create unnecessary folders if the current Bedrock format does not require them.

---

# 3. Core Technical Strategy

Use three layers:

## Layer 1 — Vanilla Minecraft

Preserve:
- Villager breeding.
- Beds.
- Farms.
- Villager professions.
- Vanilla Iron Golem spawning.
- Vanilla Pillagers.
- Vanilla raids.
- Normal crafting/mining.
- Vanilla dimensions.
- Normal survival progression.

---

## Layer 2 — Data-Driven Add-On Content

Use Behavior Pack / Resource Pack JSON for:

- Custom entities.
- Custom items.
- Entity components.
- AI goals.
- Trade tables.
- Loot tables.
- Models.
- Textures.
- Animations.
- Render controllers.
- Equipment visuals where practical.

---

## Layer 3 — Script API

Use Script API for systems that require dynamic context or player-specific state, especially:

- Military Token interaction.
- Villager conversion.
- Ownership assignment.
- Multiplayer ownership checks.
- Command Banner detection.
- Soldier anchor / hold-position logic.
- Equipment-state synchronization.
- Dynamic random Pillager attacks.
- Village threat scaling.
- Potential world-generation assistance.
- Debug commands.
- Persistent custom state if necessary.

Avoid using Script API for tasks already handled cleanly by data-driven components.

---

# 4. Entity Architecture

Recommended custom entity identifiers:

```text
warchief:villager_soldier
warchief:mercenary
```

Potential future entities:

```text
warchief:raid_controller
warchief:debug_marker
```

Use a controller entity only if Script API scheduling cannot cleanly manage the feature without one.

---

# 5. Villager Soldier State Machine

Recommended logical states:

```text
UNCLAIMED
OWNED_IDLE
OWNED_FOLLOW
OWNED_COMBAT
```

Potential armor/equipment states should be tracked separately.

---

## 5.1 UNCLAIMED

Created when:
- Player uses Military Token on eligible Villager.

Properties:
- No owner.
- Does not follow players.
- Does not wander excessively.
- May use default basic appearance.
- Waiting for valid weapon assignment.

Transition:

```text
UNCLAIMED
   +
valid player gives valid weapon
   ↓
OWNED_IDLE
```

At this transition:
- Save owner identity.
- Save weapon state.
- Consume or equip weapon according to design.
- Lock future ownership changes.

---

## 5.2 OWNED_IDLE

Behavior:
- Soldier belongs to a player.
- Soldier remains near current anchor.
- Does not follow owner unless Command Banner is active.
- Can defend itself.
- Can engage enemies within defined leash radius.

Anchor should be updated when appropriate.

---

## 5.3 OWNED_FOLLOW

Condition:
- Owner is holding the Command Banner.
- Soldier is within activation/search radius or otherwise eligible.

Behavior:
- Follow owner.
- Use normal pathfinding.
- Teleport only if absolutely necessary.
- Avoid following other players.
- Remain reasonably close.

When owner stops holding Banner:

```text
OWNED_FOLLOW
     ↓
store current position as anchor
     ↓
OWNED_IDLE
```

---

## 5.4 OWNED_COMBAT

Triggered when:
- Valid hostile target detected.

Combat rules:
- Prioritize raid / hostile mobs.
- Pursuit distance should be limited.
- After target is removed, return to previous operational state.
- If Banner active, return to owner-follow.
- If Banner inactive, return near anchor.

---

# 6. Ownership Persistence

Ownership is critical in multiplayer.

Do not rely only on proximity or current player reference.

Recommended options:

1. Native tame/owner component if compatible with entity design.
2. Entity dynamic property storing owner identity.
3. Tags plus persistent property.
4. Combination of native ownership and script validation.

Preferred owner identifier:
- Stable player ID / persistent identity supported by current API.

Avoid using only player display name if a more stable ID is available.

Ownership rules:

```text
owner == none
→ eligible for recruitment

owner != player
→ deny recruitment/equipment ownership transfer

owner == interacting player
→ allow authorized commands
```

---

# 7. Military Token

Suggested item:

```text
warchief:military_token
```

Primary source:
- Librarian trade.

Function:
- Convert eligible normal Villager into `warchief:villager_soldier`.

Required validation before conversion:
- Target is eligible Villager.
- Target is not a baby.
- Target is not already a custom soldier.
- Target is not otherwise protected from conversion.
- Player holds Military Token.
- Interaction is server-authoritative.
- Token is consumed only on successful conversion.

Conversion should preserve location and facing direction.

Optional data preservation:
- Villager name tag/custom name.
- Profession metadata for logging only.
- Selected cosmetic information if useful.

The original profession does not need to persist as gameplay functionality after military conversion unless later required.

---

# 8. Command Banner

Suggested custom item:

```text
warchief:command_banner
```

Alternative:
- Detect a specific vanilla Banner item.

Recommendation:
Use a custom identifiable item if Bedrock API stability is better that way.

Required behavior:

```text
Player holding command banner
→ only soldiers owned by that player respond
```

Potential detection:
- Main hand.
- Off-hand if API reliably supports it.

User explicitly wants the banner potentially usable from the off-hand.

Therefore implementation should test:
- Main-hand detection.
- Off-hand detection.
- Behavior while switching slots.

No command menu required in first release.

---

# 9. Soldier Follow Radius

Do not globally activate every owned soldier in the world every tick.

Recommended design:
- Only nearby owned soldiers enter active follow mode.
- Use a configurable radius.

Example configuration placeholder:

```ts
const SOLDIER_COMMAND_RADIUS = 48;
```

Final radius should be play-tested.

Use throttled updates instead of every-tick full-world entity queries where possible.

---

# 10. Anchor / Hold Position System

Every Villager Soldier should have a logical anchor.

Anchor fields conceptually:

```text
anchor_dimension
anchor_x
anchor_y
anchor_z
```

When Banner is released:
- Set current position as anchor.

Idle behavior:
- Small roam radius only.
- Return to anchor if exceeding allowed distance.

Example placeholder:

```text
IDLE_ROAM_RADIUS = 3–5 blocks
COMBAT_LEASH_RADIUS = 16–24 blocks
```

These are prototype values only.

Avoid exact final balancing until gameplay testing.

---

# 11. Mercenary Architecture

Identifier:

```text
warchief:mercenary
```

Logical states:

```text
UNCLAIMED
OWNED_FOLLOW
OWNED_STAY
OWNED_COMBAT
```

---

## 11.1 Spawn

Mercenaries should appear naturally or through a controlled spawning system.

The exact spawn design remains open.

Possible implementations:
- Biome spawn rules.
- Structure-associated spawn.
- Rare wilderness spawn.
- Roadside/wandering spawn.

The first prototype may use summon commands for testing.

---

## 11.2 Recruitment

Mercenary begins:
- Equipped with basic weapon.
- Unowned.

Player interacts with valid replacement weapon.

On success:
- Weapon updates.
- Player becomes permanent owner.
- Mercenary begins following owner.

---

## 11.3 Stay Command

The Mercenary needs a simple Wolf-like "stay" mechanic.

Possible interaction:
- Owner interacts while sneaking.
- Dedicated command item.
- Reuse contextual interaction.

Do not overdesign the first prototype.

Required states:
- Follow.
- Stay.

---

# 12. Equipment System

Only two conceptual slots are required:

```text
weapon
armor
```

---

## 12.1 Weapon

Weapon affects:
- Visual held item.
- Damage.
- Potential attack speed.
- Recruitment ownership transition.

Supported initial weapons may include:

```text
minecraft:wooden_sword
minecraft:stone_sword
minecraft:iron_sword
minecraft:diamond_sword
minecraft:netherite_sword
```

Future:
- Axe classes.
- Bow/ranged classes.

Do not include ranged classes in MVP unless explicitly requested.

---

## 12.2 Armor

Armor is a simplified soldier armor tier.

Suggested internal state:

```text
none
iron
diamond
netherite
```

Optionally:
- leather
- chainmail

Armor should affect:
- Defensive stats.
- Visual appearance.

The Add-On does not need individual helmet/chest/legs/boots management in MVP.

A single armor interaction may represent the whole tier.

---

## 12.3 Equipment Interaction Rules

Possible interaction:

```text
Owner holds valid weapon
+ interacts with owned unit
→ replace weapon

Owner holds valid armor item
+ interacts with owned unit
→ replace armor state
```

Questions to resolve during implementation:
- Return old weapon?
- Drop old weapon?
- Consume new armor item?
- Require full armor set or one representative item?

Recommended MVP:
- Use one representative item.
- Consume new item.
- Drop/return replaced equipment if technically reliable.

Document final behavior after prototype.

---

# 13. Visual Rendering

Use Resource Pack to create humanoid soldier visuals.

Recommended shared base:
- Player-like geometry.
- Shared skeleton where possible.
- Shared animation set where possible.

Separate textures:
- Villager Soldier.
- Mercenary.
- Armor overlays.

Possible animation set:
- Idle.
- Walk.
- Run.
- Melee attack.
- Hurt.
- Death.
- Hold weapon.

Potential future:
- Shield.
- Bow.
- Patrol.

---

# 14. Villager Trade Architecture

Do not replace the entire profession system unless necessary.

Goal:
- Preserve profession identity.
- Preserve Novice → Master progression.
- Expand trade possibilities.

Trade balancing should live in data files where possible, not hard-coded script.

Recommended configuration approach:

```text
trading/
├── farmer.json
├── mason.json
├── librarian.json
├── armorer.json
├── weaponsmith.json
├── toolsmith.json
└── ...
```

Actual Bedrock path/file structure should follow the target game version.

---

# 15. Librarian Warchief Trade Progression

Initial design example:

### Novice
- Mostly vanilla/basic books and academic items.

### Apprentice
- First Warchief utility items may become available.

### Journeyman
- Military Token access.

### Expert
- Command Banner access or better military logistics.

### Master
- Rare military administration items / future systems.

This is not final balancing.

Military Token and Command Banner may be placed earlier if testing shows Warchief gameplay starts too late.

---

# 16. Population Automation

First implementation should avoid rewriting Villager breeding entirely.

Prototype the vanilla loop first:

- Villager farm behavior.
- Farmer harvesting.
- Food inventory.
- Food sharing.
- Bed availability.
- Breeding.

Determine whether normal Minecraft behavior becomes sufficient when:
- Farms are larger.
- Farmers are reliable.
- Food supply is abundant.

Only add scripts if there is a demonstrated failure.

Potential script support may:
- Encourage food redistribution.
- Detect persistent starvation despite nearby food.
- Slightly increase reliability.

Do not create invisible free food.

The economy should still require farms and infrastructure.

---

# 17. Random Pillager Attack Controller

Use Script API for flexible attacks.

Do not modify vanilla Raid as the only mechanism.

Suggested controller responsibilities:

1. Find eligible village area.
2. Calculate threat score.
3. Determine whether an attack occurs.
4. Choose attack size.
5. Choose spawn ring.
6. Spawn vanilla hostile units.
7. Track active attack.
8. End attack when hostiles are eliminated or timeout occurs.

---

# 18. Village Detection

Potential signals:
- Bell.
- Villagers.
- Beds.
- Profession workstations.

Simplest MVP anchor:
- Bell-centered village controller.

Example:

```text
Bell
↓
search nearby Villagers
↓
population count
↓
calculate threat
```

If bell APIs are difficult, use alternative block/entity scanning strategies.

Avoid scanning enormous regions every tick.

---

# 19. Threat Score

Internal-only concept.

Example prototype formula:

```text
threat =
  villager_population
  + owned_soldiers * weight
  + high_tier_professions * weight
  + prosperity_metric
```

Do not expose exact numbers to the player initially.

Threat determines:
- Chance of attack.
- Attacker count.
- Ravager eligibility.
- Stronger raid mob eligibility.

---

# 20. Attack Tiers

Prototype example:

```text
SAFE
SKIRMISH
ASSAULT
MAJOR_ASSAULT
SIEGE
```

Example composition placeholder:

```text
SKIRMISH
- few Pillagers

ASSAULT
- Pillagers
- some Vindicators

MAJOR_ASSAULT
- more melee/ranged units
- possible Ravager

SIEGE
- largest formation
- Ravagers
- multiple groups
```

Final composition must be play-tested.

---

# 21. Attack Scheduling

Do not necessarily use fixed five-minute attacks.

A fixed interval may become repetitive.

Recommended:
- Randomized attack check window.
- Cooldown after attack.
- Minimum peaceful period.

Example configurable values:

```text
MIN_ATTACK_COOLDOWN
MAX_ATTACK_COOLDOWN
ATTACK_CHECK_INTERVAL
```

Keep these in one configuration file.

---

# 22. Vanilla Raid Compatibility

Vanilla Bad Omen / Raid must remain functional.

Custom attacks should not:
- Cancel vanilla Raid.
- Remove vanilla Raid mobs.
- Replace vanilla Raid rewards.
- Hijack vanilla Raid state.

If custom attack occurs during active vanilla Raid:
Recommended MVP behavior:
- Delay custom attack.

---

# 23. World Generation Strategy

This is a technical risk area.

Gameplay requirement:
- More villages.
- More Pillager Outposts.
- Shorter distance between strategic locations.
- More enemy-controlled territory.

Do not assume vanilla structure frequency can always be safely overridden.

Implementation order:

### Option A — Native worldgen modification
Investigate whether current Bedrock format safely supports adjusting structure distribution.

If stable:
- Prefer this.

### Option B — Custom structure generation
Use structure templates or features to place additional compatible settlements/outposts.

### Option C — Script-assisted placement
Use scripted region/chunk checks and place structures under controlled conditions.

Only use this if A/B are insufficient.

---

# 24. Performance Requirements

Avoid:
- Querying every entity in the world every tick.
- Repeated full-dimension scans.
- Per-tick village population scans.
- Large-radius pathfinding for hundreds of soldiers.

Recommended:
- Update military commands at controlled intervals.
- Cache ownership state.
- Cache village metrics for short periods.
- Use event-driven interactions.
- Use nearest/limited radius searches.
- Keep raid controller count minimal.

---

# 25. Configuration

Create a central config module.

Example:

```ts
export const CONFIG = {
  soldierCommandRadius: 48,
  soldierIdleRadius: 4,
  soldierCombatLeash: 20,
  raidCheckIntervalTicks: 1200,
  minRaidCooldownTicks: 12000,
  maxRaidCooldownTicks: 36000,
};
```

Values above are examples only.

The objective is to avoid scattering balancing constants throughout the codebase.

---

# 26. Debugging Tools

Development builds should include debug commands or script utilities.

Recommended capabilities:
- Spawn Villager Soldier.
- Spawn Mercenary.
- Assign owner.
- Clear owner.
- Set armor tier.
- Set weapon.
- Force attack tier.
- Print threat score.
- Print ownership ID.
- Set soldier anchor.
- Teleport unit to owner.

These tools should be removable or disabled in release builds.

---

# 27. Save / Reload Testing

Every persistent feature must survive:

- World save.
- World exit.
- Game restart.
- Player reconnect.
- Multiplayer reconnect.
- Dimension travel where applicable.

Test especially:
- Soldier ownership.
- Mercenary ownership.
- Stay/follow state.
- Equipment state.
- Anchor position.
- Raid cooldown/controller state if persistence is required.

---

# 28. Multiplayer Rules

Required:
- Player A cannot command Player B's soldiers.
- Player B cannot steal Player A's Mercenary.
- Banner only affects owned Villager Soldiers.
- Equipment modification should require ownership.
- Friendly ownership state must survive disconnects.

Future optional:
- Team/alliance support.

Not required for MVP.

---

# 29. Development Principle

Do not solve every feature simultaneously.

Recommended technical order:

1. Pack bootstrapping.
2. Custom Villager Soldier entity.
3. Military Token conversion.
4. Ownership.
5. Weapon handling.
6. Banner follow.
7. Anchor logic.
8. Mercenary.
9. Armor.
10. Trade expansion.
11. Population testing.
12. Random attacks.
13. World-generation density.
14. Balancing/polish.

See `04_EXECUTION_PLAN_AND_ACCEPTANCE_CRITERIA.md`.
