# Phase 04 — Economy Simplification Revision

## 1. Revision Goal

This revision simplifies the Phase 04 Villager economy after runtime testing.

The previous 28-catalog design created too many catalog combinations for resource-heavy professions.

The new design prioritizes:

- easier access to important resources;
- fewer RNG-dependent Villager rolls;
- population growth through **trade stock and throughput**, not only catalog completion;
- clear profession identity;
- limited, intentional overlap between related professions;
- faster Villager leveling through frequently used resource trades.

The economy should encourage the player to expand a Village because:

> More Villagers means more stock, more restocks, and more total economic throughput.

It should **not** require the player to collect a large number of narrowly different Villager variants just to obtain basic resources.

---

# 2. Final Variant Count

The revised target is:

| Vanilla Profession | Variant Count |
|---|---:|
| Farmer | 3 |
| Fletcher | 3 |
| Mason | 3 |
| Toolsmith | 3 |
| Weaponsmith | 4 |
| Armorer | 4 |
| Librarian | 2 |

Total:

    22 catalog identities

All remain vanilla Minecraft professions.

No new custom Villager profession is required.

---

# 3. Resource Ownership Principle

Each important resource has:

- one **Primary Supplier**;
- optionally one **Secondary Supplier**.

Primary supplier:
- best price;
- best stock;
- earlier access;
- strongest profession identity.

Secondary supplier:
- worse price;
- lower stock;
- later access;
- convenience / redundancy.

This allows small overlap without turning every Villager into a universal shop.

---

# 4. Mining Resource Ownership

## Coal

Primary supplier:

    Toolsmith

Secondary supplier:

    Mason

Reason:

Coal logically belongs to mining/industry, so Toolsmith remains the main source.

Mason may also provide Coal because:
- stone quarrying and construction logically overlap with excavation;
- it provides a fallback if the player has not obtained the desired Toolsmith yet;
- Coal is common enough that controlled overlap does not damage profession identity.

Recommended behavior:

### Toolsmith
- earlier Coal access;
- cheaper;
- higher stock.

### Mason
- slightly more expensive;
- lower stock;
- construction/quarry-oriented catalog only.

Coal should **not** become a major Armorer/Weaponsmith resource-sale item beyond their normal vanilla trades unless required for compatibility.

---

## Iron

Primary supplier:

    Toolsmith

Secondary supplier:

    Mason, limited

Iron must remain strongly associated with Toolsmith.

However, Mason may sell a **small amount of Iron** as a construction/structural convenience resource.

Reason:

Large construction projects often need:
- Iron Bars;
- Lantern-related crafting;
- Rails / infrastructure;
- hoppers and utility construction;
- general structural materials.

Therefore limited Mason Iron access is acceptable.

Recommended rule:

### Toolsmith
- Iron available earlier;
- better Emerald-to-Iron ratio;
- medium stock;
- main Iron supplier.

### Mason
- Iron available later;
- worse price;
- low stock;
- only Structural Builder or Quarry-oriented variant should provide it.

Mason must **not** become competitive with Toolsmith for bulk Iron.

Example target relationship:

    Toolsmith
    3E → 4 Iron

    Mason
    5E → 3 Iron

Exact balance remains subject to testing.

---

## Gold

Primary supplier:

    Toolsmith

Secondary supplier:

    none required

Gold is a mining/economic resource and should remain one of the reasons to develop Toolsmith.

Mason should not sell Gold.

---

## Redstone

Primary supplier:

    Toolsmith

Secondary supplier:

    none required

Redstone strongly represents industrial/mining infrastructure.

It should remain Toolsmith territory.

---

## Lapis Lazuli

Primary supplier:

    Toolsmith

Possible secondary use:

    Librarian may sell small amounts only for enchantment utility.

The Librarian overlap should be utility-focused, not bulk resource supply.

---

## Diamond

Primary supplier:

    Toolsmith

Secondary sources:

    Weaponsmith / Armorer only through finished equipment.

Rule:

- Toolsmith sells raw Diamond.
- Weaponsmith sells Diamond weapons.
- Armorer sells Diamond armor.
- Mason never sells Diamond.
- Librarian never sells Diamond.

This preserves clear profession identity.

---

## Netherite

Primary raw-material route:

    Toolsmith — Precious Materials Broker

Recommended raw item:

    Netherite Scrap

Finished Netherite equipment:

    Elite Weaponsmith
    Elite Armorer

No Mason Netherite access.

---

# 5. Farmer — 3 Variants

## A. Crop Farmer

Role:
- crop-based Emerald income;
- seeds;
- staple agriculture.

Focus:
- Wheat
- Carrot
- Potato
- Beetroot
- Pumpkin
- Melon
- common Seeds

This is the easiest pure farming economy.

---

## B. Provisioner

Role:
- prepared food;
- player food logistics;
- population support;
- army provisioning.

Focus:
- Bread
- Baked Potato
- Cooked Chicken
- Cooked Beef
- Golden Carrot
- larger food bundles

---

## C. Livestock & Specialty Farmer

Combines the previous Livestock Supplier and Specialty Grower.

Role:
- animal farming;
- specialty crops;
- higher-value agricultural products.

Focus:
- Eggs
- Leather
- Beef
- Chicken
- Mutton
- Pumpkin
- Melon
- Beetroot
- Sweet Berries
- Glow Berries
- specialty agricultural goods

Reason for merge:

The previous four Farmer variants created unnecessary RNG.

Livestock and specialty agriculture are different enough from basic Crop Farmer/Provisioner, but not important enough to require two separate Villagers.

---

# 6. Fletcher — 3 Variants

Fletcher is also the primary forestry profession.

## A. Forester

Primary wood supplier.

Focus:
- Sticks
- Logs
- Planks
- common Saplings

Wood acquisition should be easy to identify:

    Need wood?
    → Find a Fletcher
    → Forester is the best catalog

Population expansion then increases wood throughput through additional Foresters.

---

## B. Archer Supplier

Primary ranged military logistics.

Focus:
- Bow
- Arrows
- Flint
- Feathers
- String

Directly supports:
- Archer Villager Soldier;
- Bow Mercenary.

---

## C. Hunter & Exotic Forester

Combines:
- Hunter Supplier;
- Exotic Forester.

Focus:
- String
- Feathers
- Leather
- Rabbit Hide
- uncommon Logs
- uncommon Saplings
- hunting utility
- exotic forestry

Reason for merge:

Both were secondary/niche Fletcher catalogs and did not need to consume two separate variant slots.

---

# 7. Mason — 3 Variants

## A. Quarry Supplier

Caste:
- Economy

Role:
- cheap bulk building resources;
- excavation economy.

Focus:
- Cobblestone
- Stone
- Cobbled Deepslate
- Coal as secondary access
- small late Iron access if needed

This should be the easiest Mason for an early player to use.

---

## B. Structural Builder

Caste:
- Standard

Role:
- prepared structural construction materials.

Focus:
- Stone Bricks
- Deepslate Bricks
- Bricks
- Chiseled Stone
- Polished Deepslate
- limited Iron construction supply

This is the most appropriate Mason variant for secondary Iron access.

Important:

Iron here is convenience only.

Toolsmith must remain cheaper and better stocked.

---

## C. Decorative & Luxury Mason

Caste:
- Premium

Combines:
- Decorative Mason;
- Luxury Mason.

Focus:
- Granite
- Diorite
- Andesite
- polished variants
- Terracotta
- Glazed Terracotta
- Quartz
- Quartz Pillar
- Amethyst-related decorative supply

Reason for merge:

Decorative and Luxury Mason served the same broad player role:
building aesthetics.

One broader catalog is more useful than forcing the player to search for two separate building-decoration Villagers.

---

# 8. Toolsmith — 3 Variants

## A. Mining & Industrial Supplier

Combines:
- Mining Supplier;
- Industrial Supplier.

This becomes the main raw-resource Villager.

Focus:
- Coal
- Copper
- Iron
- Redstone
- Lapis
- Gold

Primary resource route:

    Need common mined resources?
    → Toolsmith
    → Mining & Industrial Supplier

This catalog should have:
- good stock;
- better basic resource prices;
- faster Villager XP gain through resource transactions.

---

## B. Tool Specialist

Role:
- finished tools.

Focus:
- Pickaxe
- Axe
- Shovel
- Hoe
- Iron tools
- Diamond tools

This catalog provides convenience rather than cheap raw resources.

---

## C. Precious Materials Broker

Role:
- high-value mining economy.

Focus:
- Gold
- Lapis
- Diamond
- Netherite Scrap

Early-game value may remain intentionally weaker.

Late-game value becomes the reason to keep and level this Villager.

---

# 9. Weaponsmith — 4 Variants

Weaponsmith remains at four variants because weapon progression is not a basic-resource bottleneck.

## A. Militia Supplier
- cheapest mass weapon supply;
- Stone / Iron Sword;
- army quantity.

## B. Infantry Smith
- balanced regular army weapons;
- Iron weapons;
- Shield logistics.

## C. Specialist Arms Smith
- higher-price specialized weapons;
- stronger late-game weapon supply.

## D. Elite Weaponsmith
- Diamond weapon access;
- Master Netherite weapon access;
- very low stock.

Population expansion here increases military equipment throughput.

---

# 10. Armorer — 4 Variants

Armorer remains at four variants because armor catalogs represent military tiers rather than core-resource access.

## A. Militia Armorer
- cheap basic armor.

## B. Iron Quartermaster
- organized Iron armor supply.

## C. Heavy Armorer
- heavier / premium defense;
- Diamond progression.

## D. Elite Armorer
- elite Diamond armor;
- Master Netherite armor;
- very low stock.

---

# 11. Librarian — 2 Variants

Four Librarian variants were unnecessarily fragmented.

The revised system uses only two.

## A. Scholar & Enchanter

Combines:
- Scholar;
- Enchantment Specialist.

Role:
- academic economy;
- enchanting support.

Focus:
- Paper
- Books
- Bookshelves
- Lapis utility
- Glass / Lantern convenience
- enchantment-related goods

This is the general-purpose knowledge Villager.

---

## B. Warchief Administrator & Utility

Combines:
- Warchief Administrator;
- Explorer / Utility Librarian.

Role:
- military administration;
- strategic utility;
- exploration convenience.

Focus:
- Conscription Writ
- normal Banner convenience trade
- Compass
- Clock
- Spyglass
- administrative utility

Important:

Conscription Writ remains a guaranteed strategic trade for this catalog.

Normal vanilla Banner remains valid for Soldier command.

The Banner trade is convenience only.

---

# 12. Final Catalog Structure

Final revised structure:

    Farmer — 3
    ├── Crop Farmer
    ├── Provisioner
    └── Livestock & Specialty Farmer

    Fletcher — 3
    ├── Forester
    ├── Archer Supplier
    └── Hunter & Exotic Forester

    Mason — 3
    ├── Quarry Supplier
    ├── Structural Builder
    └── Decorative & Luxury Mason

    Toolsmith — 3
    ├── Mining & Industrial Supplier
    ├── Tool Specialist
    └── Precious Materials Broker

    Weaponsmith — 4
    ├── Militia Supplier
    ├── Infantry Smith
    ├── Specialist Arms Smith
    └── Elite Weaponsmith

    Armorer — 4
    ├── Militia Armorer
    ├── Iron Quartermaster
    ├── Heavy Armorer
    └── Elite Armorer

    Librarian — 2
    ├── Scholar & Enchanter
    └── Warchief Administrator & Utility

Total:

    22 catalog identities

Previous:

    28 catalog identities

Reduction:

    6 catalog identities

---

# 13. Resource Coverage Matrix

| Resource | Primary Supplier | Secondary Supplier |
|---|---|---|
| Food | Farmer | — |
| Seeds | Farmer | — |
| Logs / Planks | Fletcher / Forester | Hunter & Exotic Fletcher |
| Saplings | Fletcher | — |
| Bow / Arrows | Fletcher / Archer Supplier | Weaponsmith only if later needed |
| Cobblestone / Stone | Mason | — |
| Deepslate | Mason | — |
| Decorative Blocks | Mason | — |
| Quartz building blocks | Mason | — |
| Coal | Toolsmith | Mason |
| Copper | Toolsmith | — |
| Iron | Toolsmith | Mason, limited |
| Gold | Toolsmith | — |
| Redstone | Toolsmith | — |
| Lapis | Toolsmith | Librarian, small enchantment utility |
| Diamond | Toolsmith | Weaponsmith/Armorer as finished equipment |
| Netherite Scrap | Toolsmith | — |
| Netherite weapons | Weaponsmith | — |
| Netherite armor | Armorer | — |
| Books / enchanting utility | Librarian | — |
| Conscription Writ | Warchief Librarian | — |

---

# 14. Population Expansion Philosophy

The revised design changes the reason for Village expansion.

Old pressure:

    Need more Villagers
    because I need to collect many different catalog combinations.

New pressure:

    Need more Villagers
    because I need more trade stock and restock throughput.

Example:

One Mining & Industrial Toolsmith may provide enough Iron for a small base.

A large city/army may require:

    3–4 Mining & Industrial Toolsmiths

not because their catalogs are different, but because:

- stock per Villager is limited;
- restock is limited;
- total resource demand increases.

This is the intended population-growth loop.

---

# 15. Villager XP / Leveling Revision

Resource trading should level Villagers faster than the previous implementation.

Reason:

If the player is actively supplying the economy with useful goods, the Villager should progress at a noticeable pace.

Recommended custom trade XP targets:

| Tier where trade is used | Suggested Trader XP |
|---|---:|
| Novice | 4–5 |
| Apprentice | 8–10 |
| Journeyman | 12–15 |
| Expert | 18–20 |
| Master | XP irrelevant for unlock, normal reward acceptable |

Resource purchases may also provide slightly more trader XP than before.

Target experience:

- Novice should not require excessive repeated transactions.
- Apprentice → Journeyman should be reachable through normal resource trading.
- Expert/Master should still require meaningful use, but not grinding one trade dozens of times.

Exact XP values should be implemented and then adjusted after runtime testing.

---

# 16. Emerald Income Rule

The existing Phase 04 rule remains:

> Every catalog should provide useful item → Emerald routes.

For resource professions, this is especially important.

Examples:

Farmer:
- crops → Emerald.

Fletcher:
- sticks/logs/flint/feathers → Emerald.

Mason:
- stone/deepslate/clay/quartz-related materials → Emerald.

Toolsmith:
- coal/copper/iron/redstone/gold → Emerald.

This allows the player to specialize economically and earn Emeralds without being forced into one specific farm.

---

# 17. Implementation Scope

This document is a **design revision only**.

No trade JSON or Villager catalog-selection code is changed by this document commit.

Next implementation should:

1. reduce catalog selector groups from 28 to 22;
2. merge the resource-heavy catalogs according to this document;
3. change selector weights for 3-variant and 2-variant professions;
4. preserve 4 variants for Weaponsmith and Armorer;
5. add Coal as controlled Mason overlap;
6. add limited Iron to Mason;
7. keep Gold/Redstone/Diamond raw-resource dominance in Toolsmith;
8. increase resource-trade trader XP;
9. update validators from 28 expected catalogs to 22;
10. preserve spawned-Villager routing and workstation reroll behavior;
11. preserve version/package naming until the implementation release decision is made.

