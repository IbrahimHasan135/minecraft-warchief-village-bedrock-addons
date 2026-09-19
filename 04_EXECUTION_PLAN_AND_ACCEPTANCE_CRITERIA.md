# Warchief Village Add-On — Execution Plan and Acceptance Criteria

## 1. Purpose

This file is intended to be given directly to Codex or another coding agent.

The project must be implemented in phases.

Do not attempt to build the entire Add-On in one pass.

For every phase:

1. Inspect the existing repository first.
2. Preserve existing working behavior.
3. Implement only the requested scope.
4. Test the phase.
5. Document changed files.
6. Report limitations.
7. Do not silently redesign gameplay.

The design source of truth is:

1. `01_GAME_CONCEPT.md`
2. `02_IMPLEMENTATION_AND_ARCHITECTURE.md`
3. `03_ASSET_AND_PREPARATION_CHECKLIST.md`
4. This file.

If technical limitations require a design deviation, document the limitation before making a major substitute.

---

# 2. Phase 0 — Technical Discovery

## Goal

Establish the correct Minecraft Bedrock project foundation.

## Tasks

- Identify target Minecraft Bedrock version.
- Identify stable Script API package versions.
- Verify current manifest requirements.
- Verify whether TypeScript build tooling is required.
- Create Behavior Pack.
- Create Resource Pack.
- Establish namespace.
- Confirm packs load without errors.
- Create minimal script that logs startup.
- Create minimal custom item.
- Create minimal custom entity.

## Acceptance Criteria

- [ ] World loads successfully.
- [ ] Behavior Pack is recognized.
- [ ] Resource Pack is recognized.
- [ ] Script executes without startup error.
- [ ] Custom item can be obtained.
- [ ] Custom entity can be summoned.
- [ ] No repeated content log errors.

---

# 3. Phase 1 — Villager Soldier Prototype

## Goal

Create the basic Villager Soldier entity.

## Required Features

- Custom humanoid entity.
- Temporary player-like geometry accepted.
- Villager-inspired placeholder texture accepted.
- Melee combat.
- Basic movement.
- Basic HP.
- Basic hostile-target behavior.

## Do Not Implement Yet

- Military Token.
- Ownership.
- Banner.
- Armor.
- Final visuals.
- Raids.

## Acceptance Criteria

- [ ] Entity spawns.
- [ ] Entity renders correctly.
- [ ] Entity can walk.
- [ ] Entity can attack a hostile target.
- [ ] Entity does not crash world.
- [ ] Entity does not behave like an overpowered Iron Golem.

---

# 4. Phase 2 — Military Token and Villager Conversion

## Goal

Convert a normal Villager into an unclaimed Villager Soldier.

## Required Features

Create:

```text
warchief:military_token
```

Interaction:

```text
Player uses Military Token on eligible adult Villager
→ Military Token consumed
→ Villager removed
→ Villager Soldier created at same location
→ Soldier state = UNCLAIMED
```

## Validation

Do not convert:
- Baby Villager.
- Already converted Soldier.
- Invalid entity.
- Dead entity.
- Protected/unsupported variant if technically necessary.

## Acceptance Criteria

- [ ] Token obtainable.
- [ ] Token interaction works.
- [ ] Token consumed only on success.
- [ ] Villager disappears.
- [ ] Soldier appears in same location.
- [ ] No duplicate entities.
- [ ] New Soldier is unclaimed.

---

# 5. Phase 3 — Ownership and Weapon Claiming

## Goal

Assign Soldier ownership through first weapon interaction.

## Required Features

Supported initial weapons:

- Wooden Sword.
- Stone Sword.
- Iron Sword.
- Diamond Sword.
- Netherite Sword.

Flow:

```text
UNCLAIMED Soldier
+ Player gives valid weapon
→ weapon assigned
→ owner = that player
→ ownership locked
```

## Multiplayer Requirements

- Other player cannot claim owned soldier.
- Other player cannot transfer ownership.
- Ownership persists through save/reload.

## Acceptance Criteria

- [ ] First valid player claims Soldier.
- [ ] Owner identity stored.
- [ ] Ownership survives world reload.
- [ ] Second player cannot steal Soldier.
- [ ] Weapon state persists.

---

# 6. Phase 4 — Command Banner

## Goal

Enable Warchief follow control.

Create:

```text
warchief:command_banner
```

## Required Behavior

```text
Owner holds Command Banner
→ nearby owned Villager Soldiers follow owner
```

```text
Owner stops holding Banner
→ soldiers stop following
→ current position becomes anchor
```

## Requirements

- Only owner's soldiers respond.
- Multiplayer-safe.
- Test main hand.
- Test off-hand if supported.

## Acceptance Criteria

- [ ] Banner recognized.
- [ ] Owned soldiers follow.
- [ ] Other player's soldiers do not follow.
- [ ] Removing Banner disables follow.
- [ ] Soldier stays near release position.
- [ ] Re-equipping Banner resumes follow.

---

# 7. Phase 5 — Anchor and Combat Leash

## Goal

Prevent soldiers from getting lost.

## Required Features

When Banner is off:
- Soldier has anchor.
- Small idle radius.
- Limited combat pursuit.
- Return to anchor after combat.

When Banner is on:
- Follow owner.
- Combat allowed.
- Return toward owner after combat.

## Acceptance Criteria

- [ ] Soldier does not wander far while idle.
- [ ] Soldier can defend itself.
- [ ] Soldier does not chase enemies indefinitely.
- [ ] Soldier returns toward anchor.
- [ ] Follow behavior remains reliable.

---

# 8. Phase 6 — Mercenary Prototype

## Goal

Create player-owned personal army unit.

Create:

```text
warchief:mercenary
```

## Required Features

- Humanoid entity.
- Temporary mercenary/ronin texture.
- Starts unclaimed.
- Carries basic weapon.
- Player replaces/gives weapon to recruit.
- Owner stored permanently.
- Automatically follows owner.
- Stay command.

## Acceptance Criteria

- [ ] Mercenary exists independently.
- [ ] Player can recruit.
- [ ] Other player cannot steal.
- [ ] Mercenary follows owner.
- [ ] Stay works.
- [ ] Follow can resume.
- [ ] Ownership survives reload.

---

# 9. Phase 7 — Equipment System

## Goal

Implement Weapon + Armor equipment states.

## Weapon

Allow owner to replace weapon.

Weapon affects:
- Visual.
- Damage.

## Armor

Initial armor tiers:

```text
none
iron
diamond
netherite
```

Armor affects:
- Defense / effective durability.
- Visual.

## Acceptance Criteria

- [ ] Owner can change weapon.
- [ ] Weapon visual updates.
- [ ] Weapon stats update.
- [ ] Owner can change armor.
- [ ] Armor visual updates.
- [ ] Armor stats update.
- [ ] Other player cannot modify owned unit.

---

# 10. Phase 8 — Librarian Warchief Economy

## Goal

Expose Warchief system through normal Villager progression.

## Required Features

Librarian still acts as Librarian.

Add:
- Military Token trade.
- Command Banner trade.

Preserve:
- Novice → Master progression.

## Acceptance Criteria

- [ ] Librarian levels normally.
- [ ] Warchief items appear at intended tiers.
- [ ] Trades restock.
- [ ] Vanilla trading still works.
- [ ] No major regression to Librarian behavior.

---

# 11. Phase 9 — Expanded Village Economy

## Goal

Expand profession catalogs to reduce mandatory grinding.

## Priority Professions

1. Farmer.
2. Mason.
3. Weaponsmith.
4. Armorer.
5. Toolsmith.
6. Librarian.

Later:
- Other professions.

## Requirements

- Keep tier progression.
- Higher tier = better/rarer products.
- Master tier may sell very rare resources.
- Netherite-related goods allowed at high cost.

## Acceptance Criteria

- [ ] Player can increasingly rely on village economy.
- [ ] Basic resources available at lower tiers.
- [ ] High-tier resources remain expensive.
- [ ] Profession identity remains recognizable.
- [ ] No obvious infinite Emerald exploit.

---

# 12. Phase 10 — Population Automation Validation

## Goal

Determine how much population automation is already achieved by vanilla mechanics.

## Tasks

Create controlled test village.

Observe:
- Farmer harvesting.
- Food inventory.
- Food sharing.
- Breeding.
- Bed usage.

## Rule

Do not write a custom breeding simulator unless necessary.

If vanilla loop works sufficiently:
- Document result.
- Do not add unnecessary code.

If unreliable:
- Add minimal support only.

## Acceptance Criteria

- [ ] Village can grow with farm + beds.
- [ ] Player does not need to manually feed each Villager repeatedly.
- [ ] Growth still depends on infrastructure.
- [ ] No free infinite population.

---

# 13. Phase 11 — Random Pillager Attack MVP

## Goal

Create periodic non-vanilla-triggered attacks using vanilla enemy mobs.

## Initial Scope

Use:
- Pillager.
- Vindicator.
- Ravager where appropriate.

Attack tiers:

```text
SKIRMISH
ASSAULT
SIEGE
```

Ignore finer balancing initially.

## Required Behavior

- Detect eligible village.
- Determine attack tier.
- Spawn enemies at safe outer radius.
- Enemies move toward village naturally.
- Track cooldown.

## Acceptance Criteria

- [ ] Attack can occur without Bad Omen.
- [ ] Vanilla mobs are used.
- [ ] Small attack is genuinely small.
- [ ] Larger attack is visibly stronger.
- [ ] Vanilla Raid still works separately.
- [ ] No attack spam.

---

# 14. Phase 12 — Dynamic Raid Scaling

## Goal

Scale attack size with village development.

Initial metrics:
- Villager population.
- Soldier count.
- High-tier profession count.

Create internal threat score.

## Acceptance Criteria

- [ ] Small village gets mostly smaller attacks.
- [ ] Larger village can trigger stronger attacks.
- [ ] Scaling is configurable.
- [ ] No visible "level" required.

---

# 15. Phase 13 — World Generation Research

## Goal

Determine best way to increase strategic-location density.

Research in this order:

### A. Vanilla structure distribution
Can village/outpost frequency be safely changed?

### B. Custom structure features
Can additional village-like/outpost structures be generated safely?

### C. Script-assisted structure placement
Use only if required.

## Deliverable

Before implementation, create:

```text
WORLDGEN_RESEARCH.md
```

containing:
- Supported methods.
- Limitations.
- Recommended method.
- Performance concerns.
- Experimental requirements.

## Acceptance Criteria

- [ ] Technical approach selected based on actual Bedrock capability.
- [ ] No speculative implementation.
- [ ] Existing worlds are not corrupted.
- [ ] New-world requirements documented.

---

# 16. Phase 14 — Increased Pillager Territory

## Goal

Make enemy territory more common.

Initial implementation may use:
- Additional small outposts.
- Camps.
- Watchtowers.

Do not require every site to be a full vanilla Pillager Outpost.

## Acceptance Criteria

- [ ] Player encounters hostile bases more often.
- [ ] Bases contain Pillagers.
- [ ] Bases provide useful loot.
- [ ] Travel becomes meaningfully more dangerous.
- [ ] Density is not excessive.

---

# 17. Phase 15 — Increased Village Availability

## Goal

Reduce excessive distance between population centers.

Possible implementation:
- More vanilla villages if supported.
- Small custom settlements if necessary.

## Acceptance Criteria

- [ ] Villages/settlements are easier to find.
- [ ] Exploration still matters.
- [ ] World is not saturated with settlements.
- [ ] New population centers support trade and expansion.

---

# 18. Phase 16 — Balancing Pass

Balance:

- Military Token price.
- Command Banner price.
- Resource trade prices.
- Soldier HP.
- Soldier damage.
- Mercenary HP.
- Mercenary damage.
- Armor effectiveness.
- Attack frequency.
- Attack size.
- Population growth.
- Outpost density.

Do not balance only from code assumptions.

Play-test.

---

# 19. Phase 17 — Visual Polish

Replace placeholders.

Required:
- Villager Soldier model/skin.
- Mercenary model/skin.
- Armor visuals.
- Weapon visuals.
- Military Token icon.
- Command Banner icon.
- Improved animations.

---

# 20. Phase 18 — Release Validation

Test:

## Single Player
- [ ] New world.
- [ ] Existing world.
- [ ] Save/reload.
- [ ] Nether travel.
- [ ] End travel.
- [ ] Death/rejoin.

## Multiplayer
- [ ] Two players.
- [ ] Ownership separation.
- [ ] Simultaneous Banner use.
- [ ] Disconnect/reconnect.
- [ ] Equipment authority.

## Economy
- [ ] Trade progression.
- [ ] Trade restocking.
- [ ] No obvious duplication.
- [ ] No obvious infinite Emerald exploit.

## Population
- [ ] Stable breeding.
- [ ] Stable Iron Golem vanilla behavior.

## Military
- [ ] Soldier ownership.
- [ ] Mercenary ownership.
- [ ] Follow.
- [ ] Stay.
- [ ] Anchor.
- [ ] Combat.
- [ ] Equipment.

## Attacks
- [ ] Random attacks.
- [ ] Scaling.
- [ ] Vanilla Raid compatibility.

## Worldgen
- [ ] No severe chunk-generation lag.
- [ ] No structure spam.
- [ ] No broken terrain.

---

# 21. Definition of MVP

The minimum playable Warchief experience is achieved when:

1. Player can develop normal Villagers.
2. Librarian can sell Military Token and Command Banner.
3. Player can convert a Villager into Villager Soldier.
4. Player can claim Soldier with a weapon.
5. Soldier ownership is multiplayer-safe.
6. Banner causes owned Soldiers to follow.
7. Banner removal leaves Soldiers near their position.
8. Mercenary can be recruited and follows owner.
9. Weapons and armor modify units.
10. Expanded Villager trades reduce mandatory grinding.
11. Population can grow through village infrastructure.
12. Random Pillager attacks create recurring military pressure.

World-generation density improvements are highly desirable but should not block the first playable MVP if Bedrock worldgen requires additional research.

---

# 22. Coding-Agent Rules

Codex must:

- Read all design documents before coding.
- Avoid redefining core gameplay.
- Prefer incremental commits.
- Keep configurable values centralized.
- Use clear names.
- Add comments only where useful.
- Avoid hard-coding player names.
- Avoid world-wide per-tick scans.
- Preserve multiplayer ownership.
- Preserve vanilla Iron Golem mechanics.
- Preserve vanilla Raid mechanics.
- Preserve normal Minecraft survival.

When uncertain about a technical limitation:
- Investigate.
- Prototype.
- Document.
- Do not invent a silent workaround that changes the gameplay requirement.
