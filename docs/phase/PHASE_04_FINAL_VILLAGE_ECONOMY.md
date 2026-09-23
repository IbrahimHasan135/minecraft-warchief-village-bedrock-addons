# Phase 04 — Final Village Economy and Trade Architecture

## 1. Purpose

Phase 04 turns the Village into a practical economic network rather than a collection of isolated vanilla trades.

The central design goal is:

> A player should be able to specialize in one productive activity, sell its output for Emeralds, and use those Emeralds to obtain resources from other developed Villager professions.

The system must preserve normal Minecraft gathering as an option, but it should no longer force every player to mine, farm, build, gather wood, produce food, and manufacture equipment personally once the Village economy has matured.

This phase also exposes the Warchief progression through normal survival trading.

---

## 2. Final Economy Principle

Emerald remains the central exchange currency.

The intended loop is:

    Player specializes in one activity
              ↓
    produces a large amount of goods
              ↓
    sells those goods to the relevant Villager
              ↓
          earns Emeralds
              ↓
    buys resources from other professions
              ↓
    expands village, population, equipment, and army

Examples:

    Farming specialist
    → sells Wheat / Carrot / Potato / Pumpkin
    → earns Emeralds
    → buys Stone, Coal, Iron, Wood, Weapons, Armor

    Mining specialist
    → sells Coal / Copper / Iron-related goods
    → earns Emeralds
    → buys Food, Wood, Seeds, Building Blocks, Military supplies

    Forestry specialist
    → sells Logs / Sticks / Saplings
    → earns Emeralds
    → buys Food, Stone, Metals, Armor

The player may still gather any resource manually.

Trading is an alternative economic route, not a replacement for Minecraft survival.

---

## 3. Design Constraints

Phase 04 must satisfy all of these constraints:

1. No single Villager should sell everything.
2. The economy must not require an excessive number of Villagers.
3. Each profession must have a recognizable economic identity.
4. A player should be able to generate Emerald income from several different specialization paths.
5. Essential resources should be obtainable without depending on one extremely rare trade roll.
6. High-tier resources must remain expensive.
7. Trade loops must not create obvious infinite Emerald arbitrage.
8. Vanilla Novice → Apprentice → Journeyman → Expert → Master progression should remain recognizable.
9. Warchief progression must integrate into the Village economy rather than exist as a separate shop/menu system.
10. Trade design should be data-driven through Villager trade tables whenever practical.

---

# 4. Final Profession Count

Phase 04 uses **7 existing vanilla Minecraft Villager professions**.

No new custom Villager profession is required for the Phase 04 economy.

The seven professions are:

| # | Vanilla Profession | Main Economic Role |
|---|---|---|
| 1 | Farmer | Crops, food, seeds, population support |
| 2 | Fletcher | Wood, forestry, ranged supplies |
| 3 | Mason | Stone, construction blocks, bulk building materials |
| 4 | Toolsmith | Mining resources, metals, tools, utility materials |
| 5 | Weaponsmith | Weapons and military offensive equipment |
| 6 | Armorer | Armor and defensive equipment |
| 7 | Librarian | Administration, Warchief unlocks, books and strategic utility |

These are all vanilla profession identities.

Phase 04 only expands and reorganizes their trade catalogs.

The economy deliberately does **not** create new professions such as:

    Miner
    Lumberjack
    Ore Merchant
    Seed Merchant
    Food Merchant
    Military Merchant

Those roles are represented through trade-catalog variation inside the seven vanilla professions.

Seven professions are the intended middle ground:

- fewer professions would make individual Villagers too broad;
- more professions would require too many Villagers just to access normal resources.

Other vanilla professions may remain in the world unchanged.

They are simply outside the required expanded economy scope for Phase 04.

# 5. Catalog Variant System

Phase 04 uses:

    7 vanilla professions
    ×
    4 conceptual catalog variants
    =
    28 possible economic identities

No custom Villager profession is required.

The four variants per profession are:

| Vanilla Profession | Economy | Standard | Premium | Elite |
|---|---|---|---|---|
| Farmer | Crop Farmer | Provisioner | Livestock Supplier | Specialty Grower |
| Fletcher | Forester | Archer Supplier | Hunter Supplier | Exotic Forester |
| Mason | Quarry Supplier | Structural Builder | Decorative Mason | Luxury Mason |
| Toolsmith | Mining Supplier | Industrial Supplier | Tool Specialist | Precious Materials Broker |
| Weaponsmith | Militia Supplier | Infantry Smith | Specialist Arms Smith | Elite Weaponsmith |
| Armorer | Militia Armorer | Iron Quartermaster | Heavy Armorer | Elite Armorer |
| Librarian | Scholar | Warchief Administrator | Enchantment Specialist | Explorer / Utility Librarian |

Variant is expressed through the Villager's trade catalog, not a separate profession identifier.

The Novice catalog must expose the identity before the first trade.

Before first trade:

    inspect
    → keep or reroll workstation

After first trade:

    catalog committed
    → profession/trade identity remains locked

Economic caste is also visible from early pricing:

    Economy
    → cheapest basic throughput

    Standard
    → balanced

    Premium
    → specialized and more expensive

    Elite
    → intentionally poor early value, strongest late-game specialization

This price asymmetry is intentional.

It encourages the player to keep inexpensive practical Villagers early, then expand population later to support Premium and Elite catalogs.

Detailed catalog, price, level, stock, and variant definitions are maintained in:

    docs/phase/PHASE_04A_CORE_ECONOMY_CATALOGS.md
    docs/phase/PHASE_04B_WARCHIEF_HIGH_TIER_BALANCE.md

# 6. Guaranteed Trades vs Random Trades

Critical economic items must not rely entirely on random rolls.

Each profession should contain:

### Guaranteed Core Trades

Trades that define the profession and ensure the economy cannot become blocked.

Examples:

- Farmer always provides staple food.
- Mason always provides basic stone.
- Toolsmith eventually provides Iron.
- Librarian always provides Conscription Writ at the intended tier.

### Variant / Random Trades

Trades that provide diversity between Villagers.

Examples:

- Mason may specialize more heavily in Deepslate or Terracotta.
- Farmer may emphasize crops or cooked food.
- Toolsmith may emphasize raw materials or tools.

Recommended structure per level:

    1 guaranteed core trade
    +
    1–2 variant pool trades

The exact count should follow Bedrock trade-table behavior and be validated during implementation.

---

# 7. Profession 1 — Farmer

## Role

- Primary food supplier.
- Main agricultural Emerald-income route.
- Population support.
- Seed and crop supplier.

Farmer should make a pure farming playstyle economically viable.

## Player Sells To Farmer

Possible Emerald-income goods:

### Novice
- Wheat
- Carrot
- Potato
- Beetroot

### Apprentice
- Pumpkin
- Melon
- Beetroot-related produce

### Journeyman+
- Higher-volume agricultural deliveries
- Selected animal-derived food if balance permits

The important principle is that a player with a large farm can generate meaningful Emerald income without mining.

## Farmer Sells To Player

### Novice
- Bread
- Basic seeds
- Carrot
- Potato

### Apprentice
- Beetroot Seeds
- Pumpkin Seeds
- Melon Seeds
- Larger Bread bundles

### Journeyman
- Cooked/basic prepared food
- Golden Carrot in limited quantity if balance permits
- Larger food bundles

### Expert
- High-volume food logistics
- Population-support food bundles

### Master
- Premium food
- High-efficiency logistics food

## Catalog Variants

### Farmer A — Crop Farmer

Focus:
- seeds
- crops
- bread
- crop exchange

### Farmer B — Provision Farmer

Focus:
- prepared food
- larger food bundles
- population logistics

Farmer should not become the main source of mining or military goods.

---

# 8. Profession 2 — Fletcher

## Role

Fletcher becomes the **Forestry and Ranged Supply profession**.

This prevents wood resources from being pushed into Mason or Toolsmith and gives forestry its own Emerald-income path.

## Player Sells To Fletcher

Possible goods:

- Sticks
- Logs
- Planks
- Flint
- Feathers
- String
- selected saplings

The exact quantity must prevent trivial infinite Emerald generation from a single small tree farm.

## Fletcher Sells To Player

### Novice
- Sticks
- basic arrows
- common saplings

### Apprentice
- Logs
- Planks
- Flint
- larger Arrow bundles

### Journeyman
- multiple wood types
- String
- Feathers

### Expert
- Bow
- larger forestry bundles
- uncommon saplings

### Master
- higher-quality Bow-related trade
- large Arrow supply
- selected rare wood/sapling convenience trades

## Catalog Variants

### Fletcher A — Forester

Focus:
- Logs
- Planks
- Saplings
- Sticks

### Fletcher B — Archer Supplier

Focus:
- Bow
- Arrows
- Flint
- Feathers
- String

This profession directly supports Phase 03.5 ranged armies.

---

# 9. Profession 3 — Mason

## Role

- Construction supplier.
- Stone and terrain-material supplier.
- Main Builder-specialization partner.

Mason should reduce repetitive bulk block mining once the economy is mature.

## Player Sells To Mason

Possible goods:

- Cobblestone
- Stone
- Andesite
- Diorite
- Granite
- Clay
- Terracotta-related inputs
- selected Deepslate blocks

A Builder or quarry-focused player should be able to generate Emeralds from bulk materials.

## Mason Sells To Player

### Novice
- Cobblestone
- Stone

### Apprentice
- Stone Bricks
- Andesite
- Diorite
- Granite

### Journeyman
- Deepslate
- Cobbled Deepslate
- Bricks
- selected decorative stone

### Expert
- Terracotta families
- polished building materials
- Quartz-related construction materials

### Master
- premium decorative construction bundles
- larger bulk construction trades

## Catalog Variants

### Mason A — Stone Supplier

Focus:
- Stone
- Cobblestone
- Deepslate
- Stone Bricks

### Mason B — Decorative Builder

Focus:
- Granite
- Diorite
- Andesite
- Bricks
- Terracotta
- Quartz construction material

Mason should not be the main seller of Iron, Gold, Diamond, or Netherite.

Those belong to the mining/metal economy.

---

# 10. Profession 4 — Toolsmith

## Role

Toolsmith becomes the **Mining, Metal, and Utility Resource Broker** in addition to retaining tools.

This is the key profession that allows a non-mining player to obtain underground resources through Emeralds.

It is intentionally broader than vanilla Toolsmith but remains coherent:

> Mining resources and the tools used to obtain them.

## Player Sells To Toolsmith

Possible income goods:

### Early
- Coal
- Copper
- Flint if not reserved exclusively for Fletcher

### Mid
- Iron-related goods
- selected Redstone
- selected Lapis

### High tier

High-tier resources should generally **not** be easy Emerald generators.

Diamond and Netherite should primarily be expensive purchases rather than profitable sell-back goods.

## Toolsmith Sells To Player

### Novice
- Coal
- Copper
- Stone Pickaxe / utility tools

### Apprentice
- Iron
- Iron tools
- Coal bundles

### Journeyman
- Redstone
- Lapis Lazuli
- better Iron tools
- Gold in limited quantities

### Expert
- Diamond
- Diamond tools
- larger Gold / Redstone / Lapis access

### Master
- very expensive Diamond supply
- high-tier tools
- limited Netherite-related material

## Netherite Policy

Netherite must remain a late-game luxury.

Recommended Phase 04 approach:

- Master Toolsmith may provide **Netherite Scrap** or a very expensive Netherite-related trade.
- Stock should be extremely limited.
- Price should be substantially higher than Diamond-tier resources.
- Netherite should not be available from a Novice/Journeyman economy.
- Buying Netherite must not enable profitable sell-back loops.

Whether the final trade sells:

    Netherite Scrap

or:

    Netherite Ingot

should be decided during balance implementation.

Preferred safer first implementation:

    Netherite Scrap

because it preserves some late-game crafting requirement.

## Catalog Variants

### Toolsmith A — Mining Supplier

Focus:
- Coal
- Copper
- Iron
- Gold
- Redstone
- Lapis
- Diamond
- Netherite-related material

### Toolsmith B — Tool Specialist

Focus:
- Pickaxe
- Axe
- Shovel
- Hoe
- increasing material tiers

Important:

Essential material access such as Iron must remain guaranteed somewhere in the Toolsmith progression rather than being entirely variant-dependent.

---

# 11. Profession 5 — Weaponsmith

## Role

- Offensive military equipment.
- Player weapons.
- Villager Soldier and Mercenary weapon logistics.

Weaponsmith should not become a raw-material merchant.

## Player Sells To Weaponsmith

Possible goods:

- Coal
- Iron-related inputs
- selected weapon-production materials

Sell trades should be limited enough that Toolsmith and Weaponsmith cannot be used for easy circular arbitrage.

## Weaponsmith Sells To Player

### Novice
- Wooden / Stone Sword convenience
- low-tier weapons

### Apprentice
- Iron Sword

### Journeyman
- better Iron weapon supply
- Bow-related crossover only if needed, though Fletcher remains primary ranged supplier

### Expert
- Diamond Sword

### Master
- Netherite Sword or Netherite weapon upgrade path at very high cost

Weaponsmith is a major military supply profession but should not sell armor.

## Catalog Variants

One primary catalog is enough.

Weapon tier progression already creates natural variation.

---

# 12. Profession 6 — Armorer

## Role

- Defensive equipment.
- Player armor.
- Mercenary armor logistics.
- General military defense supply.

## Player Sells To Armorer

Possible goods:

- Coal
- Iron-related materials
- Leather in limited cases

Avoid duplicating every Toolsmith material-buy trade.

## Armorer Sells To Player

### Novice
- Leather or basic defensive equipment

### Apprentice
- Chainmail / basic armor convenience

### Journeyman
- Iron Armor

### Expert
- Diamond Armor

### Master
- Netherite-related armor at very high cost

For current Warchief unit design:

- Villager Soldier retains fixed Iron Chestplate.
- Mercenary may use replaceable armor.

Therefore Armorer primarily benefits:
- player progression;
- Mercenary equipment;
- future military classes.

## Catalog Variants

One primary catalog is enough.

Armor tiers already provide the progression structure.

---

# 13. Profession 7 — Librarian

## Role

Librarian is the **administration and Warchief gateway profession**.

The Librarian must not become a general resource store.

## Existing Identity

Retain recognizable Librarian goods where practical:

- Paper economy
- Books
- Bookshelves
- Enchanted-book related progression where compatible

## Warchief Progression

Final Phase 04 decision:

### Conscription Writ

Internal item:

    warchief:military_token

Display name:

    Conscription Writ

Recommended availability:

    Journeyman

This is late enough that the Village must develop first, but early enough that military gameplay is not locked behind Master level.

### Command Banner

Phase 03 established that a normal vanilla Banner is the command item.

Therefore Phase 04 does **not** require a custom Command Banner.

The Librarian may optionally sell a normal Banner as a convenience trade, but the Warchief command system must continue accepting ordinary vanilla Banners obtained through normal Minecraft gameplay.

The economy must never require a special Banner trade simply to command Soldiers.

## Suggested Tier Identity

### Novice
- Paper / books / basic library goods

### Apprentice
- Bookshelves / selected utility

### Journeyman
- **Conscription Writ**
- normal Librarian progression

### Expert
- better administrative/utility trades
- optional Banner convenience trade

### Master
- premium library / strategy utility
- future Warchief administration item if later phases add one

## Catalog Variants

One primary catalog.

The Conscription Writ must be guaranteed at its intended tier, not left to a rare random trade roll.

---

# 14. Resource Coverage Matrix

The seven professions must collectively provide the following economic coverage.

| Resource Category | Primary Profession |
|---|---|
| Wheat / Carrot / Potato / Beetroot | Farmer |
| Bread / prepared food | Farmer |
| Seeds | Farmer |
| Logs / Planks | Fletcher |
| Saplings | Fletcher |
| String / Feathers / Flint | Fletcher |
| Bow / Arrows | Fletcher |
| Cobblestone / Stone | Mason |
| Deepslate | Mason |
| Stone Bricks / decorative stone | Mason |
| Bricks / Terracotta / Quartz building material | Mason |
| Coal | Toolsmith |
| Copper | Toolsmith |
| Iron | Toolsmith |
| Gold | Toolsmith |
| Redstone | Toolsmith |
| Lapis Lazuli | Toolsmith |
| Diamond | Toolsmith |
| Netherite-related material | Toolsmith, Master only |
| Tools | Toolsmith |
| Swords / offensive weapons | Weaponsmith |
| Armor | Armorer |
| Books / academic utility | Librarian |
| Conscription Writ | Librarian |
| Command Banner | normal vanilla Banner; optional Librarian convenience sale |

This matrix is a responsibility rule.

Do not casually duplicate every resource across many professions.

Some controlled overlap is acceptable, especially for common inputs such as Coal or Iron, but each category should have one obvious primary supplier.

---

# 15. Player Specialization Paths

Phase 04 must support at least these specialization styles.

## Farmer Economy

    crops
    → Farmer
    → Emerald
    → buy metals / stone / wood / equipment

## Forestry Economy

    logs / sticks / saplings
    → Fletcher
    → Emerald
    → buy food / stone / metals / armor

## Quarry / Builder Economy

    stone / clay / decorative blocks
    → Mason
    → Emerald
    → buy food / wood / metals / equipment

## Miner Economy

    coal / copper / iron-related goods
    → Toolsmith / limited Smith demand
    → Emerald
    → buy food / wood / construction / military supply

## Academic Economy

    paper / books and related goods
    → Librarian
    → Emerald
    → buy resources elsewhere

The objective is not to make all paths perfectly identical.

The objective is to make multiple long-term economic identities viable.

---

# 16. Emerald Income Design

Emerald generation must come primarily from the player supplying useful goods to the Village.

Recommended rule:

> Common renewable goods generate steady but modest Emerald income; harder or less renewable goods generate better income but should not create circular trade exploits.

Examples:

### Renewable / Farmable

- crops
- logs
- sticks
- stone from industrial mining
- paper

Characteristics:
- repeatable;
- higher quantity required per Emerald;
- suitable for specialization.

### Semi-Limited / Mining Goods

- coal
- copper
- iron

Characteristics:
- lower quantity required;
- controlled trade stock;
- useful mid-game income.

### Rare Resources

- Diamond
- Netherite

Recommended:
- do not make these primary Emerald farming goods;
- preserve their strategic value;
- treat them mainly as expensive outputs of a mature economy.

---

# 17. Purchase Pricing Philosophy

No final numeric price should be considered permanent until play-testing.

Use relative bands first.

## Tier A — Common

Examples:
- Bread
- Seeds
- Cobblestone
- Stone
- Logs
- Planks
- Coal

Price:
- low Emerald cost;
- larger stock.

## Tier B — Developed Economy

Examples:
- Iron
- Redstone
- Lapis
- Gold
- prepared food bundles
- better building materials

Price:
- moderate Emerald cost;
- moderate stock.

## Tier C — High Value

Examples:
- Diamond
- Diamond tools
- Diamond weapon
- Diamond armor

Price:
- high Emerald cost;
- limited stock.

## Tier D — Strategic / Late Game

Examples:
- Netherite Scrap
- Netherite Sword
- Netherite armor-related equipment
- future strategic Warchief items

Price:
- very high Emerald cost;
- very limited stock;
- Master profession only.

---

# 18. Stock and Restock Philosophy

Availability matters as much as price.

A resource should not become effectively infinite simply because the player has an Emerald farm.

Recommended behavior:

### Common resources
- higher stock;
- normal restocking.

### Iron / Gold / Redstone / Lapis
- moderate stock.

### Diamond
- low stock.

### Netherite
- extremely low stock.

This creates an economy where:

    Emerald wealth
    ≠
    unlimited instant Netherite

The player may still need:
- several developed Villagers;
- multiple restock cycles;
- significant Emerald production.

---

# 19. Anti-Arbitrage Rules

This is a mandatory Phase 04 requirement.

The system must prevent obvious loops such as:

    buy item for 1 Emerald
    → sell same item to another profession
    → receive 2 Emeralds
    → infinite money

Rules:

1. Never allow direct buy price to be lower than another profession's guaranteed sell-back value.
2. Apply a meaningful spread between Village purchase and Village sale prices.
3. Do not create reversible processing loops with positive Emerald output.
4. High-tier resources should usually be purchased by the player, not sold back for profit.
5. Common overlapping materials such as Coal and Iron require explicit cross-profession review.
6. Trade discounts must be considered because vanilla reputation effects may reduce prices.
7. Basic testing must include max-discount / favorable-price scenarios where practical.

A simple design target:

    Village buys from player cheaply
    Village sells to player at a premium

The economy rewards production, not arbitrage.

---

# 20. Avoiding Economy Deadlock

The economy must not require the player to already possess every profession before it becomes useful.

Minimum viable developed Village:

    1 Farmer or Fletcher
    +
    1 Mason or Toolsmith
    +
    1 Librarian

This should already provide:

- an Emerald income route;
- food or material access;
- basic building/resource access;
- Warchief unlock progression.

A larger Village improves variety and throughput but should not be required just to begin.

---

# 21. Recommended Village Scale

Phase 04 should feel useful at these approximate population scales.

## Small Village

3–5 professional Villagers.

Expected:
- basic Emerald generation;
- food;
- building resources;
- early Warchief access.

## Developed Village

6–10 professional Villagers.

Expected:
- most core resource categories available;
- stable military logistics;
- Diamond access begins becoming practical.

## Economic Hub

10+ professional Villagers.

Expected:
- multiple catalog variants;
- better stock throughput;
- high-tier military and construction logistics.

This is not a hard requirement.

The design specifically avoids requiring one Villager for every individual resource.

---

# 22. Technical Architecture

Phase 04 should primarily be **data-driven**.

Preferred structure:

    behavior_pack/
    └── trading/
        ├── farmer.json
        ├── fletcher.json
        ├── mason.json
        ├── toolsmith.json
        ├── weaponsmith.json
        ├── armorer.json
        └── librarian.json

The exact filenames and vanilla override paths must follow the Bedrock 1.26.40/1.26.x trade template actually used by the project.

Do not guess trade schema from old tutorials.

Before implementation:

1. Snapshot the current vanilla trade tables for the seven professions.
2. Preserve their profession identity and level progression.
3. Modify only the required trade pools.
4. Keep old recognizable trades where they do not conflict with the economy design.
5. Add Warchief-specific Librarian trade.
6. Validate each JSON file against the current Bedrock trade-table format.

---

# 23. Trade Table Design

Each profession should retain:

    Novice
    Apprentice
    Journeyman
    Expert
    Master

Recommended conceptual structure:

    profession
    ├── level 1
    │   ├── guaranteed core trade
    │   └── variant trade pool
    ├── level 2
    │   ├── guaranteed core trade
    │   └── variant trade pool
    ├── level 3
    │   ├── guaranteed progression trade
    │   └── variant trade pool
    ├── level 4
    │   ├── high-value trade
    │   └── specialization trade
    └── level 5
        ├── premium trade
        └── rare/late-game trade

Do not put the entire profession catalog at Novice.

Profession leveling must matter.

---

# 24. Variant Implementation Strategy

Preferred first implementation:

Use vanilla trade-pool randomness within the same profession.

Do not create new custom profession identifiers merely for:

- Crop Farmer
- Provision Farmer
- Forester
- Archer Supplier
- Stone Supplier
- Decorative Builder
- Mining Supplier
- Tool Specialist

These are conceptual catalog variants.

If Bedrock trade-pool behavior allows it, one Villager may receive a mixed selection from its profession's variant pool while guaranteed core trades remain fixed.

This means the player does not need to search for a perfectly named custom subtype.

---

# 25. Trade Persistence

Trade progression should remain vanilla-like.

Required behavior:

- Villager keeps profession.
- Villager keeps trade level.
- Existing used trades continue to restock normally.
- Trade selection remains stable after it has been generated, following normal Bedrock behavior.
- Warchief-specific trade should not disappear unexpectedly after Villager reload.

No Script API persistence layer should be added unless vanilla trade-table behavior proves insufficient.

---

# 26. Warchief Integration

Phase 04 connects economy to military progression.

Final loop:

    economic specialization
          ↓
       Emeralds
          ↓
    Librarian progression
          ↓
    Conscription Writ
          ↓
    Villager → Villager Soldier
          ↓
    1 Emerald recruitment
          ↓
    Weaponsmith / Fletcher / Armorer logistics
          ↓
    larger military

Examples:

### Infantry supply

    Toolsmith
    → Iron

    Weaponsmith
    → Sword

    Librarian
    → Conscription Writ

### Archer supply

    Fletcher
    → Bow / Arrows

    Librarian
    → Conscription Writ

### Mercenary supply

    Emerald income
    → recruit Mercenary

    Weaponsmith / Fletcher
    → weapon

    Armorer
    → armor

This makes the economic system directly useful for Warchief gameplay.

---

# 27. Conscription Writ Economy

The Conscription Writ must have a meaningful cost.

It represents conversion of civilian population into military capacity.

Recommended starting design:

- available from Journeyman Librarian;
- costs multiple Emeralds;
- limited restock stock;
- price high enough that mass conscription requires an actual economy.

Do not make it:

- free;
- one trivial crop trade equivalent;
- Master-only unless testing shows military progression starts too quickly.

Exact numeric price belongs to implementation/balance testing.

---

# 28. Vanilla Banner Decision

Phase 03 finalized the command system around ordinary vanilla Banners.

Therefore:

- no custom Command Banner is required in Phase 04;
- any normal supported Banner remains usable for Soldier command;
- Librarian may sell a normal Banner as convenience;
- obtaining the Banner through crafting remains fully valid.

This avoids locking military command behind one specific trade.

---

# 29. Resources Explicitly Required by Phase 04

The mature Village economy should provide practical access to at least:

### Food / Agriculture
- Wheat
- Bread
- Carrot
- Potato
- Beetroot
- common Seeds
- Pumpkin
- Melon
- selected prepared foods

### Forestry
- Logs
- Planks
- Sticks
- Saplings
- String
- Feathers
- Flint

### Construction
- Cobblestone
- Stone
- Stone Bricks
- Deepslate
- Granite
- Diorite
- Andesite
- Bricks
- Terracotta-related blocks
- Quartz-related building materials

### Mining / Materials
- Coal
- Copper
- Iron
- Gold
- Redstone
- Lapis Lazuli
- Diamond
- Netherite-related material

### Equipment
- tools
- swords
- Bow
- Arrows
- armor

### Warchief
- Conscription Writ
- optional convenience Banner

Additional vanilla resources may be added later, but Phase 04 should not try to sell every item in Minecraft.

---

# 30. What Phase 04 Should Not Become

Do not turn the economy into:

### One universal merchant

A single Villager that buys and sells every category destroys profession identity.

### A profession explosion

Do not create separate professions such as:

    Coal Merchant
    Iron Merchant
    Gold Merchant
    Diamond Merchant
    Wood Merchant
    Seed Merchant
    Bread Merchant

That would make the Village population requirement unreasonable.

### A Creative-mode shop

Rare resources must still have cost, stock, and progression restrictions.

### A mandatory system

Mining, farming, exploring, and crafting manually must remain valid alternatives.

---

# 31. Phase 04 Execution Structure

Phase 04 remains one economy phase with two checkpoints:

## Phase 04A — Core Economy

Detailed design:

    docs/phase/PHASE_04A_CORE_ECONOMY_CATALOGS.md

Scope:

- seven vanilla professions;
- four catalog variants per profession;
- 28 economic identities;
- Novice → Journeyman;
- Emerald income;
- normal resource purchases;
- economic caste differentiation;
- stock/restock targets;
- pre-trade reroll and post-trade commitment.

## Phase 04B — Warchief and High-Tier Economy

Detailed design:

    docs/phase/PHASE_04B_WARCHIEF_HIGH_TIER_BALANCE.md

Scope:

- Expert → Master;
- Diamond;
- Netherite-related access;
- Conscription Writ;
- Warchief logistics;
- final pricing;
- final stock;
- anti-arbitrage;
- final economy validation.

These are checkpoints inside Phase 04, not separate major project phases.

# 32. Phase 04 Checkpoint

Phase 04 checkpoint:

> A developed Village functions as a multi-profession economic network where a player can specialize in one productive activity, earn Emeralds, purchase resources from other professions, and fund Warchief military growth without any single Villager becoming a universal shop.

Concrete checkpoint:

- at least three different specialization paths can generate Emeralds;
- all major resource categories have a clear supplier;
- Iron, Gold, Redstone, Lapis, and Diamond are purchasable through progression;
- Netherite-related material exists only as expensive late-game access;
- food, wood, seeds, stone, and construction blocks are purchasable;
- weapons, Bow/Arrows, tools, and armor are economically obtainable;
- Librarian provides Conscription Writ;
- normal vanilla Banner remains usable;
- no critical economy resource depends on one rare random roll;
- no obvious infinite Emerald loop exists.

---

# 33. Acceptance Criteria

- [ ] Seven core economic professions are used.
- [ ] No universal "everything shop" Villager exists.
- [ ] Farmer supports a viable farming economy.
- [ ] Fletcher supports forestry and ranged logistics.
- [ ] Mason supports building-material economy.
- [ ] Toolsmith provides mining-resource progression.
- [ ] Weaponsmith provides offensive equipment.
- [ ] Armorer provides defensive equipment.
- [ ] Librarian provides Conscription Writ.
- [ ] Player can buy Coal.
- [ ] Player can buy Iron.
- [ ] Player can buy Gold.
- [ ] Player can buy Redstone.
- [ ] Player can buy Lapis Lazuli.
- [ ] Player can eventually buy Diamond.
- [ ] Netherite-related material is available only at very high progression/cost.
- [ ] Player can buy common food.
- [ ] Player can buy Seeds.
- [ ] Player can buy Logs/Planks.
- [ ] Player can buy Stone/construction materials.
- [ ] Player can buy tools.
- [ ] Player can buy weapons.
- [ ] Player can buy Bow/Arrows.
- [ ] Player can buy armor.
- [ ] At least three independent economic specialization paths produce Emerald income.
- [ ] Profession progression remains Novice → Master.
- [ ] Essential trades are not all dependent on random rolls.
- [ ] Trade restocking works.
- [ ] Save/reload preserves normal Villager trade state.
- [ ] No obvious direct buy/sell Emerald exploit exists.
- [ ] Phase 03/03.5 military equipment remains compatible with the economy.

---

# 34. Final Recommended Profession Summary

The final Phase 04 target is:

    7 professions
    11 conceptual catalog variants

Detailed:

    Farmer
    ├── Crop Farmer
    └── Provision Farmer

    Fletcher
    ├── Forester
    └── Archer Supplier

    Mason
    ├── Stone Supplier
    └── Decorative Builder

    Toolsmith
    ├── Mining Supplier
    └── Tool Specialist

    Weaponsmith
    └── Weapon Supplier

    Armorer
    └── Armor Supplier

    Librarian
    └── Warchief / Knowledge Supplier

This is the intended balance between:

    profession identity
    +
    resource variety
    +
    manageable Village population
    +
    player specialization freedom

The player should feel that the Village is a connected economy, not seven unrelated shops.
