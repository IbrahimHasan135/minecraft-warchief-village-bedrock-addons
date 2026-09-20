# Warchief Village Add-On — Game Concept

## 1. Project Identity

**Working Title:** Warchief Village Add-On  
**Platform:** Minecraft Bedrock Edition  
**Add-On Type:** Behavior Pack + Resource Pack + Script API where required  
**Core Principle:** Extend vanilla Minecraft systems instead of replacing them.

This project is not intended to turn Minecraft into a separate RTS game or a total-conversion mod. The goal is to preserve normal Minecraft gameplay while making village development, military management, economy, and population management significantly more useful and scalable.

The Add-On should allow a player to naturally transition from an ordinary Minecraft survivor into a village leader or **Warchief**.

The player must still be able to:
- Mine manually.
- Craft normally.
- Explore caves, the Nether, and the End.
- Build structures manually.
- Use vanilla mobs and mechanics.
- Trigger vanilla raids normally.
- Play standard survival if desired.

The Add-On introduces a second path in which the player may progressively rely on a developed village instead of personally performing every repetitive activity.

---

# 2. Design Philosophy

The central design rule is:

> The Add-On does not replace Minecraft gameplay. It makes a developed village sufficiently useful and autonomous that the player can shift from individual labor toward economy, population management, military leadership, and territorial expansion.

Vanilla Minecraft often requires the player to perform many roles simultaneously:

- Miner
- Farmer
- Builder
- Hunter
- Blacksmith
- Trader
- Soldier
- Explorer

This Add-On should allow specialization.

A player may focus on one profitable profession or resource pipeline, trade the result for Emeralds, and use those Emeralds to obtain other resources from developed Villagers.

Example:

```text
Player focuses on farming
        ↓
Trades crops
        ↓
Receives Emeralds
        ↓
Uses Emeralds to buy:
- stone
- ore
- weapons
- armor
- food
- building materials
        ↓
Village grows
        ↓
Player transitions into Warchief gameplay
```

Manual resource gathering remains possible at all times. It is simply no longer mandatory once the village economy becomes sufficiently advanced.

---

# 3. Core Gameplay Pillars

The Add-On is built around three mutually connected pillars:

1. **Economy**
2. **Population**
3. **Military / RTS-like Command**

These systems must support one another rather than behave like unrelated features.

```text
Economy
   ↓
Village Development
   ↓
Population Growth
   ↓
Military Capacity
   ↓
Defense / Expansion
   ↓
Loot / New Villages / New Trade Opportunities
   ↓
Larger Economy
```

---

# 4. Economy System

## 4.1 Emerald as the Economic Bridge

Emerald remains the central village currency.

The Add-On must not remove ordinary Minecraft resources. Instead, Villager trades should provide a broader alternative method for obtaining them.

The player may still mine Diamond manually, but a sufficiently developed village should eventually allow Diamond-related resources or equipment to be purchased at an appropriately high cost.

The intended economic loop is:

```text
Player performs chosen economic activity
        ↓
Trades with Villagers
        ↓
Earns Emeralds
        ↓
Purchases resources or equipment from other professions
        ↓
Develops village and army
```

---

## 4.2 Villager Trade Expansion

Vanilla professions remain recognizable and continue using the existing progression:

- Novice
- Apprentice
- Journeyman
- Expert
- Master

The Add-On expands the breadth of available trades at each level.

Higher levels should unlock:
- More useful resources.
- More expensive resources.
- Better equipment.
- Rare late-game materials.

The player should feel that leveling a Villager profession meaningfully improves the entire village economy.

---

## 4.3 Example Profession Roles

These examples are design targets rather than final balancing values.

### Farmer

Role:
- Food supplier.
- Population support.
- Agricultural economy.

Possible expanded catalog:
- Wheat
- Bread
- Carrot
- Potato
- Beetroot
- Pumpkin
- Melon
- Seeds
- Higher-volume food bundles
- Other appropriate vanilla foods

The Farmer should be important both for player logistics and Villager population growth.

---

### Mason

Role:
- Construction supplier.
- Basic material supplier.

Possible catalog:
- Cobblestone
- Stone
- Stone Bricks
- Andesite
- Diorite
- Granite
- Deepslate
- Bricks
- Terracotta-related materials
- Quartz-related construction materials at high level
- Selected ore-related materials if balancing permits

The purpose is to reduce repetitive building-material grinding once the village economy matures.

---

### Toolsmith

Role:
- Tools and work equipment.

Possible catalog:
- Iron tools
- Diamond tools
- High-tier tools
- Utility equipment

Master-level offerings may be expensive enough to preserve late-game value.

---

### Weaponsmith

Role:
- Army weapons.
- Player weapons.

Possible catalog:
- Wooden weapon variants
- Stone weapons
- Iron weapons
- Diamond weapons
- Netherite weapons at Master tier and very high prices

---

### Armorer

Role:
- Army armor.
- Player armor.

Possible catalog:
- Basic armor
- Iron armor
- Diamond armor
- Netherite-related equipment at the highest tier

---

### Librarian

The Librarian is especially important.

The Librarian retains normal academic/library functionality but becomes the primary gateway to the Warchief system.

The Librarian may sell:

- **Military Token**
- **Command Banner**
- Additional Warchief utility items
- Normal Librarian goods

The exact tier at which Warchief items become available can be balanced later.

The Librarian conceptually represents knowledge, administration, military organization, and strategy.

---

# 5. Population System

## 5.1 Preserve Vanilla Population Logic

The Add-On should preserve the recognizable Minecraft population loop:

- Villagers require suitable conditions.
- Beds remain relevant.
- Housing remains player-built.
- Farmers remain relevant.
- Food remains relevant.
- Villager breeding remains recognizable.

The Add-On must not replace this with a menu-based population counter or a traditional RTS "build unit" button.

The player should still physically develop a Minecraft village.

---

## 5.2 Reduce Micromanagement

The problem with vanilla population expansion is not the underlying concept but the amount of individual management.

The target experience is:

```text
Build houses
        ↓
Provide beds
        ↓
Build farms
        ↓
Assign / maintain Farmers
        ↓
Food circulates through village
        ↓
Villagers breed automatically
```

The player should manage conditions rather than repeatedly throw Bread to individual Villagers.

If vanilla Villager food-sharing and farming behavior is sufficient, it should be preserved and made more reliable or aggressive rather than completely replaced.

---

## 5.3 Population Has Strategic Value

Villagers are not merely decorative NPCs.

Population represents:
- Economic workers.
- Trade professions.
- Future soldiers.
- Village expansion capacity.

Converting Villagers into soldiers therefore creates a meaningful economic and demographic decision.

---

# 6. Military System Overview

Military power has two major sources:

1. **Villager Soldiers**
2. **Mercenaries**

Vanilla Iron Golems remain separate.

---

# 7. Vanilla Iron Golems

Natural Iron Golem behavior should remain unchanged whenever possible.

Their role is:

> Automatic village defense.

They are not the main controllable army.

They should continue spawning through vanilla village mechanics and protecting Villagers.

This provides a passive defensive layer even before the player begins building a large military force.

---

# 8. Villager Soldier System

## 8.1 Recruitment

The player obtains a **Military Token** from a Librarian.

The player uses the Military Token on a normal Villager.

Expected flow:

```text
Normal Villager
     +
Military Token
     ↓
Villager is converted
     ↓
Unclaimed Villager Soldier
```

The original Villager is consumed/replaced as part of this conversion.

This makes military recruitment directly connected to population.

---

## 8.2 Visual Design

Villager Soldiers should not visually resemble vanilla Iron Golems.

Target appearance:
- Humanoid.
- Based on a player-like 3D body.
- Villager-inspired skin / face / clothing.
- Capable of more natural humanoid animations.
- Designed to visibly carry weapons and armor.

The body should support:
- Walking.
- Running.
- Melee attack animation.
- Holding a weapon.
- Wearing an armor visual layer.
- Idle animation.

Exact art direction can be refined later.

---

## 8.3 Unclaimed State

A newly converted Villager Soldier is not immediately owned.

The soldier remains neutral/unclaimed until a player provides a weapon.

This state should prevent accidental ownership.

---

## 8.4 Ownership

The first player to give the soldier a valid weapon becomes the permanent owner of that soldier.

Example:

```text
Unclaimed Soldier
      ↓
Player A gives Iron Sword
      ↓
Owner = Player A
```

After ownership is established:
- Player B cannot claim the soldier.
- Player B cannot replace ownership.
- The soldier should obey only Player A's military command logic.
- Multiplayer ownership must be persistent when possible.

Ownership should survive save/reload.

---

## 8.5 Soldier Equipment

Keep equipment intentionally simple.

Required conceptual slots:

1. **Weapon**
2. **Armor**

Weapon examples:
- Wooden Sword
- Stone Sword
- Iron Sword
- Diamond Sword
- Netherite Sword

Armor may use simplified full-set categories rather than individual player armor slots.

Example:

```text
No Armor
Iron Armor
Diamond Armor
Netherite Armor
```

The exact implementation may use:
- Entity properties.
- Equipment components.
- Component groups.
- Script-maintained state.
- Render-controller states.

The gameplay requirement is more important than the technical representation.

---

## 8.6 Command Banner

Villager Soldiers do not automatically follow the owner at all times.

The owner must hold the designated **Command Banner**.

Required behavior:

```text
Owner holding Command Banner
          ↓
Owned Villager Soldiers nearby
          ↓
Follow owner
```

When the Banner is no longer held:

```text
Follow behavior disabled
          ↓
Soldiers remain near their current position
```

They should not casually wander far away.

The command system is intentionally simple.

No complex formation system is required.

No drag selection, waypoint UI, squad UI, or RTS cursor system is required.

---

## 8.7 Hold Position Philosophy

When Banner-follow is disabled:
- Soldier should remain close to its current anchor position.
- Random wandering should be minimal.
- Combat pursuit should be limited by a leash radius if possible.
- After combat, soldier should return near its previous anchor.

This helps the player:
- Protect specific areas.
- Leave guards near a road or settlement.
- Avoid losing soldiers during travel.
- Organize military positions manually.

---

# 9. Mercenary System

## 9.1 Role

Mercenaries are the equivalent of the player's personal Wolf army.

Their behavior concept is inspired by tamed Wolves, but visually they are humanoid fighters.

They represent:
- Ronin.
- Wanderers.
- Hired swords.
- Independent fighters.
- Personal bodyguards.

---

## 9.2 Visual Design

Mercenaries use a humanoid player-like body.

They should have a different visual identity from Villager Soldiers.

Possible themes:
- Traveling warrior.
- Ronin.
- Adventurer.
- Mercenary.
- Wanderer.

They should spawn already carrying a basic weapon.

---

## 9.3 Recruitment / Taming

An unclaimed Mercenary exists independently in the world.

Giving/replacing the Mercenary's weapon recruits it to that player.

After recruitment:
- Owner is locked.
- Mercenary follows its owner automatically.
- Other players cannot steal ownership.

---

## 9.4 Follow Behavior

Mercenary behavior is conceptually similar to vanilla Wolf behavior:

```text
Active
→ Follow owner

Stay command
→ Remain in position
```

A Command Banner is not required for Mercenaries.

They are the player's personal army rather than a village military formation.

---

# 10. Military Identity

The distinction should remain clear:

| Unit | Source | Primary Role | Follow Logic |
|---|---|---|---|
| Vanilla Iron Golem | Vanilla village mechanics | Passive village defense | Vanilla |
| Villager Soldier | Villager + Military Token | Organized village army | Banner-based |
| Mercenary | World / hired unit | Personal army / bodyguard | Wolf-like owner follow |

---

# 11. Combat Philosophy

The military system should use ordinary Minecraft combat as much as possible.

Soldiers and Mercenaries should:
- Fight hostile mobs.
- Fight Pillagers.
- Fight raid enemies.
- Defend their owner where appropriate.
- Use melee weapons initially.

Ranged classes may be added later, but are not required for the first implementation unless explicitly added to scope.

The Add-On should first establish a robust generic soldier system before introducing many troop classes.

---

# 12. Raid and Enemy Pressure

## 12.1 Preserve Vanilla Raid

Vanilla Raid mechanics must remain available.

If the player triggers a vanilla Raid through standard Minecraft mechanics, it should still work.

The Add-On must not intentionally remove or replace it.

---

## 12.2 Random Pillager Attacks

A separate Warchief attack system should create periodic hostile pressure without requiring the player to manually trigger Bad Omen first.

The visual experience should still feel like Minecraft:
- Pillagers.
- Vindicators where appropriate.
- Ravagers at higher attack levels.
- Other vanilla raid enemies where appropriate.

The Add-On does not require every internal vanilla Raid rule to be reproduced.

---

## 12.3 Attack Sizes

Random attacks should support multiple scales, for example:

- No Attack / Safe period
- Skirmish
- Assault
- Major Assault
- Siege

Exact names are not important.

What matters is that not every attack is a full vanilla-scale Raid.

A small village should sometimes face only a few attackers.

A mature village should eventually face significantly larger forces.

---

## 12.4 Dynamic Scaling

Attack size should increase as the player's village becomes more developed.

Potential scaling inputs:
- Nearby Villager population.
- Number of military units.
- Number of high-level Villager professions.
- Village prosperity.
- Time/progression.
- Other stable metrics.

This does not need to be exposed as a visible "Village Level."

Internally the Add-On may calculate a threat score.

---

# 13. World Expansion and Territorial Gameplay

The game is not primarily a conquest game, but expansion is an important emergent objective.

Desired world experience:

```text
Village A
   ↓
Dangerous wilderness
   ↓
Pillager territory / Outposts
   ↓
Enemy resistance
   ↓
New region
   ↓
Village B
```

The player gradually becomes capable of traveling farther as military power improves.

---

## 13.1 More Villages

Villages should ideally be easier to encounter than in ordinary world generation.

Goals:
- Reduce excessively long travel between population centers.
- Give players more opportunities to discover new economic centers.
- Support territorial expansion.
- Allow military campaigns between settlements.

Exact implementation depends on Bedrock world-generation limitations.

---

## 13.2 More Pillager Outposts

Pillager Outposts should ideally be significantly more common.

They serve as:
- Enemy territory.
- Military targets.
- Loot sources.
- Obstacles between settlements.
- Reasons to maintain an army.

Destroying or clearing Outposts should make travel through a region safer.

---

# 14. Progression Philosophy

There is no required visible campaign or conquest meter.

Progression should emerge naturally.

Example:

```text
Early Game
- vanilla survival
- first village
- basic trading

Mid Game
- specialized economy
- stronger Villager professions
- population growth
- first soldiers
- first Mercenaries

Late Game
- large village economy
- high-tier resources purchased via Emerald
- large army
- frequent hostile attacks
- regional exploration
- multiple villages
- Pillager strongholds/outposts cleared
```

The player may continue indefinitely.

---

# 15. Player Freedom

The Add-On should never force one playstyle.

A player may:
- Ignore the Warchief system entirely.
- Mine everything manually.
- Use only Villager trading.
- Build a small village.
- Build a large military empire.
- Travel with Mercenaries.
- Maintain defensive Villager armies.
- Continue normal Minecraft progression.

This freedom is essential to the project identity.

---

# 16. Non-Goals

The first release does NOT need:

- Complex RTS formation mathematics.
- Top-down camera.
- RTS selection boxes.
- Drag-select.
- Waypoint command UI.
- Custom conquest map.
- Entirely new crafting system.
- Replacement of vanilla villages.
- Replacement of vanilla raids.
- Replacement of vanilla Iron Golem mechanics.
- Dozens of military classes.
- Complex city simulation.
- Fully autonomous building construction.

The goal is a Minecraft-native Warchief experience, not a separate strategy game running inside Minecraft.
