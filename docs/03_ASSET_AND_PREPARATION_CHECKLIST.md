# Warchief Village Add-On — Asset & Preparation Checklist

## 1. Purpose

This document is a practical checklist for everything the project owner should prepare, decide, test, or collect before and during implementation.

It is not necessary to prepare every asset before coding starts.

The checklist is divided into:

- Required before implementation.
- Required during prototype.
- Required before visual polish.
- Required before release.

---

# 2. Project Information

## Required

- [x] Minecraft Bedrock target version: `1.26`.
- [ ] Development platform:
  - Windows Bedrock
  - Android Bedrock
  - Other Bedrock environment
- [ ] Whether Experimental APIs / Beta APIs are acceptable.
- [ ] Whether the Add-On must work in multiplayer.
- [ ] Whether dedicated-server support is required.
- [ ] Namespace approval:
  - Recommended: `warchief`

---

# 3. Repository Preparation

Recommended repository structure:

```text
repo/
├── behavior_pack/
├── resource_pack/
├── docs/
├── reference/
└── tools/
```

Prepare:

- [ ] Git repository.
- [ ] `.gitignore`.
- [ ] README.
- [ ] Bedrock test world.
- [ ] Backup test world.
- [ ] Versioning convention.

Suggested documentation folder:

```text
docs/
├── 01_GAME_CONCEPT.md
├── 02_IMPLEMENTATION_AND_ARCHITECTURE.md
├── 03_ASSET_AND_PREPARATION_CHECKLIST.md
└── 04_EXECUTION_PLAN_AND_ACCEPTANCE_CRITERIA.md
```

---

# 4. Gameplay Decisions Still Needed

Not all of these must be decided immediately.

## Military Token

- [ ] Final item name.
- [ ] Final icon.
- [ ] Librarian tier.
- [ ] Emerald price.
- [ ] Trade max uses.
- [ ] Whether trade restocks normally.

Suggested working name:

```text
Military Token
```

---

## Command Banner

- [ ] Custom item or special vanilla Banner.
- [ ] Item texture.
- [ ] Librarian tier.
- [ ] Price.
- [ ] Main-hand only or main-hand + off-hand.
- [ ] Maximum command radius.

Current requirement:
- Prefer main hand and off-hand if supported.
- Holding it causes owned Villager Soldiers to follow.

---

# 5. Villager Soldier Art Assets

## Required before visual-polish phase

### Geometry

Prototype decision:
- [ ] Use an Illager/Pillager-compatible humanoid base first.
- [ ] Prefer vanilla Pillager/Illager geometry and animations if they can be referenced cleanly by the target Bedrock version.
- [ ] If direct vanilla references fail, create or copy a local Pillager-like geometry file in the Resource Pack and keep the same animation assumptions.

Prepare or commission later only if the prototype base is not enough:
- [ ] Custom humanoid base model.
- [ ] Villager-inspired head/face.
- [ ] Weapon hand attachment position.
- [ ] Armor layer compatibility.

Recommended:
- Reuse one common Illager/Pillager-compatible skeleton for Villager Soldier and Mercenary if possible.

---

### Base Texture

Prepare:
- [ ] Villager Soldier base skin.
- [ ] Neutral/unclaimed visual variant if desired.
- [ ] Optional owner/recruited visual variant.

Possible styles:
- Village militia.
- Medieval villager.
- Guard.
- Simple soldier uniform.

Current prototype direction:
- Use the Pillager/Illager body style and replace only the texture first.
- Villager Soldier texture should look like a recruited village guard, not a hostile Pillager.

Avoid overdesign in MVP.

---

### Armor Visuals

Prepare at minimum:
- [ ] No armor.
- [ ] Iron armor.
- [ ] Diamond armor.
- [ ] Netherite armor.

Optional:
- [ ] Leather.
- [ ] Chainmail.

Armor can be:
- Texture overlays.
- Geometry overlays.
- Separate render states.

---

### Weapon Visuals

If vanilla held items cannot be directly rendered reliably:
- [ ] Wooden Sword visual.
- [ ] Stone Sword visual.
- [ ] Iron Sword visual.
- [ ] Diamond Sword visual.
- [ ] Netherite Sword visual.

Prefer leveraging vanilla item rendering if technically supported.

---

# 6. Mercenary Art Assets

## Base Design

Prepare one clear art direction.

Possible concept:

> A wandering humanoid fighter / ronin-like traveler using a Minecraft-compatible player body.

Current prototype direction:
- Use the same Illager/Pillager-compatible base as Villager Soldier.
- Differentiate Mercenary through texture first.
- Avoid creating a custom model unless the shared base blocks gameplay or rendering.

Prepare:
- [ ] Base geometry.
- [ ] Base texture.
- [ ] Weapon compatibility.
- [ ] Armor compatibility.

Mercenary should visually differ from Villager Soldier.

---

## Optional Variants

Not needed initially.

Possible future:
- [ ] Desert Mercenary.
- [ ] Snow Mercenary.
- [ ] Plains Mercenary.
- [ ] Ronin.
- [ ] Bandit-turned-hireling.
- [ ] Adventurer.

Do not make these mandatory for MVP.

---

# 7. Animation Assets

Minimum humanoid animation set:

- [ ] Idle.
- [ ] Walk.
- [ ] Run.
- [ ] Melee attack.
- [ ] Hurt.
- [ ] Death.

Optional:
- [ ] Look around.
- [ ] Guard idle.
- [ ] Sit/stay pose.
- [ ] Victory idle.
- [ ] Block/shield.
- [ ] Bow animation.

The first implementation may use available vanilla-compatible humanoid animations if possible.

---

# 8. Warchief Item Assets

Prepare item icons for:

- [ ] Military Token.
- [ ] Command Banner if custom.
- [ ] Any future military administration item.

Suggested Military Token icon concepts:
- Emerald coin with sword symbol.
- Villager seal.
- Military contract.
- Wax-sealed recruitment paper.
- Medal/token.

Suggested Command Banner concepts:
- Small battle standard.
- Villager emblem.
- Emerald-colored command insignia.

---

# 9. Trade Balance Sheet

Create a spreadsheet or Markdown table later containing:

```text
Profession
Tier
Trade Input
Input Quantity
Trade Output
Output Quantity
Max Uses
Villager XP
Notes
```

Example:

```text
Librarian | Journeyman | Emerald | ? | Military Token | 1 | ? | ? | Warchief unlock
```

Do not finalize prices before play-testing.

---

# 10. Profession Catalog Checklist

Decide expanded goods for:

- [ ] Farmer.
- [ ] Fisherman.
- [ ] Shepherd.
- [ ] Fletcher.
- [ ] Librarian.
- [ ] Cartographer.
- [ ] Cleric.
- [ ] Armorer.
- [ ] Weaponsmith.
- [ ] Toolsmith.
- [ ] Butcher.
- [ ] Leatherworker.
- [ ] Mason.

Not every profession needs major changes.

Focus on professions that support:
- Building.
- Food.
- Weapons.
- Armor.
- Resource acquisition.
- Warchief systems.

---

# 11. Resource Progression Decisions

Determine which tier can sell:

- [ ] Coal.
- [ ] Iron.
- [ ] Copper.
- [ ] Gold.
- [ ] Redstone.
- [ ] Lapis.
- [ ] Diamond.
- [ ] Ancient Debris / Netherite-related resource.
- [ ] Quartz.
- [ ] Obsidian.
- [ ] Ender-related items if desired.

Current principle:

> Even Netherite may be purchasable with Emerald, but only at very high progression and cost.

---

# 12. Population Testing Setup

Prepare a dedicated test village containing:

- [ ] 2 Villagers.
- [ ] 5 Villagers.
- [ ] 10 Villagers.
- [ ] 20+ Villagers.
- [ ] Several beds.
- [ ] Farmer workstation.
- [ ] Wheat/carrot/potato farm.
- [ ] Bell.
- [ ] Multiple houses.

Test:

- [ ] Farmer harvests correctly.
- [ ] Farmer replants.
- [ ] Farmer stores food.
- [ ] Food is shared.
- [ ] Villagers breed.
- [ ] Bed capacity behaves correctly.
- [ ] Population can grow without player throwing food manually.

Record what already works in vanilla before adding automation.

---

# 13. Military Testing Setup

Create a flat test area.

Prepare:
- [ ] Villager.
- [ ] Military Token.
- [ ] Soldier.
- [ ] Mercenary.
- [ ] Multiple sword tiers.
- [ ] Multiple armor tiers.
- [ ] Command Banner.
- [ ] Two multiplayer players if possible.

Test cases:
- [ ] Convert Villager.
- [ ] Claim soldier.
- [ ] Ownership survives reload.
- [ ] Other player cannot claim.
- [ ] Weapon replacement.
- [ ] Armor replacement.
- [ ] Banner follow.
- [ ] Banner release.
- [ ] Soldier stays near anchor.
- [ ] Combat does not drag soldier too far.
- [ ] Mercenary follows owner.
- [ ] Mercenary stays when commanded.

---

# 14. Multiplayer Test Matrix

At minimum test two players.

### Player A / Player B

- [ ] A recruits Soldier A.
- [ ] B recruits Soldier B.
- [ ] A's Banner only moves Soldier A.
- [ ] B's Banner only moves Soldier B.
- [ ] A cannot steal Soldier B.
- [ ] B cannot replace Soldier A equipment.
- [ ] Mercenary ownership is isolated.
- [ ] Ownership survives reconnect.
- [ ] Ownership survives world reload.

---

# 15. Raid Test Assets

No custom enemy art is required initially.

Use vanilla enemies.

Prepare test commands/debug tools for:
- [ ] Pillager.
- [ ] Vindicator.
- [ ] Ravager.
- [ ] Witch if desired.
- [ ] Evoker if desired.

Prepare at least:
- [ ] Small village attack.
- [ ] Medium village attack.
- [ ] Large village attack.

---

# 16. World Generation References

Collect screenshots or seed examples showing desired density.

Prepare references for:

- [ ] Desired typical Village spacing.
- [ ] Desired Pillager Outpost density.
- [ ] Example route from Village A to Village B.
- [ ] Example "dangerous corridor" with hostile outposts.

This will help determine whether custom structures are required.

---

# 17. Pillager Outpost Assets

First preference:
- Use vanilla structure if technically controllable.

If custom structures become necessary:

Prepare:
- [ ] Vanilla-style small outpost.
- [ ] Medium camp.
- [ ] Road checkpoint.
- [ ] Watchtower.
- [ ] Larger Pillager stronghold.

Only one additional outpost template is required for first prototype.

---

# 18. Additional Village Assets

Only required if Bedrock cannot safely increase vanilla village frequency.

Possible minimal approach:
- Use small satellite settlements rather than full villages.

Prepare:
- [ ] Small Plains settlement.
- [ ] 2–4 houses.
- [ ] Beds.
- [ ] Bell.
- [ ] Workstations.
- [ ] Villager spawn points.

Do not commit to this until native world-generation options are tested.

---

# 19. Audio

Not required for MVP.

Optional later:

- [ ] Recruitment sound.
- [ ] Command Banner sound.
- [ ] Soldier acknowledgement.
- [ ] Attack warning horn.
- [ ] Siege horn.

Use vanilla sounds where practical.

---

# 20. UI

No custom RTS UI is required.

Possible future UI:
- Army count.
- Threat indicator.
- Village population.
- Raid warning.

Do not build this in first prototype unless needed for debugging.

---

# 21. Balancing Data to Record During Testing

For every test session record:

- Soldier HP.
- Soldier damage.
- Mercenary HP.
- Mercenary damage.
- Armor reduction.
- Follow speed.
- Pathfinding reliability.
- Soldier loss rate.
- Average Emerald income.
- Cost of Military Token.
- Cost of weapons.
- Cost of armor.
- Population growth speed.
- Raid frequency.
- Raid enemy count.
- Village survival rate.

The goal is to balance from gameplay data rather than guess everything before testing.

---

# 22. Recommended Asset Priority

## Priority A — Required for code prototype

- [ ] Temporary Military Token icon.
- [ ] Temporary Command Banner icon.
- [ ] Temporary Villager Soldier model/texture.
- [ ] Temporary Mercenary model/texture.

Placeholder assets are acceptable.

---

## Priority B — Required for functional alpha

- [ ] Clean Soldier model.
- [ ] Clean Mercenary model.
- [ ] Basic weapon visuals.
- [ ] Basic armor visuals.
- [ ] Expanded trade tables.

---

## Priority C — Required for polished release

- [ ] Final textures.
- [ ] Final animation polish.
- [ ] Trade balance.
- [ ] Worldgen tuning.
- [ ] Audio polish.
- [ ] Localization.
- [ ] Icons.
- [ ] Documentation screenshots.

---

# 23. What the Project Owner Does NOT Need to Prepare Yet

Do not spend time creating:

- Complex formation animations.
- Dozens of soldier classes.
- Custom dimensions.
- Full conquest map.
- RTS cursor.
- Detailed HUD.
- Large castle assets.
- Massive custom village library.
- Multiple mercenary skins.
- New bosses.

These can be added later if the core loop proves fun.
