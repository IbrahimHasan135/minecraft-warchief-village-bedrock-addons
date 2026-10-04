
# Phase 04 Variant Simplification — Final Design Revision

This revision supersedes the older 28-catalog design.

Runtime testing showed that four variants on every profession created too much catalog RNG for resource access.

The economy should encourage population expansion primarily through:

- higher stock throughput;
- more simultaneous restocks;
- more purchasing capacity;
- more Emerald-income capacity;

not through forcing the player to hunt too many catalog combinations.

## Final Variant Count

| Vanilla Profession | Variant Count | Final Variants |
|---|---:|---|
| Farmer | 3 | Crop Farmer, Provisioner, Livestock & Specialty Farmer |
| Fletcher | 3 | Forester, Archer Supplier, Hunter & Exotic Supplier |
| Mason | 3 | Quarry Supplier, Structural Builder, Decorative & Luxury Mason |
| Toolsmith | 3 | Mining & Industrial Supplier, Tool Specialist, Precious Materials Broker |
| Weaponsmith | 4 | Militia Supplier, Infantry Smith, Specialist Arms Smith, Elite Weaponsmith |
| Armorer | 4 | Militia Armorer, Iron Quartermaster, Heavy Armorer, Elite Armorer |
| Librarian | 2 | Scholar & Enchantment Librarian, Warchief & Utility Administrator |

Total:

```
3 + 3 + 3 + 3 + 4 + 4 + 2 = 22 catalog identities
```

No new custom Villager profession is introduced.

The variants remain trade-catalog identities inside vanilla professions.

## Why Resource Professions Use Only Three Variants

Farmer, Fletcher, Mason, and Toolsmith are core resource-access professions.

Too many variants in these professions can make essential resources feel locked behind RNG.

Three variants are enough to preserve specialization while keeping access reliable.

Population growth remains valuable because each additional Villager increases:

- available stock;
- restock throughput;
- trade volume;
- Emerald generation;
- military/economic capacity.

## Why Weaponsmith and Armorer Keep Four Variants

Weapons and armor are not basic resource bottlenecks.

Four variants still provide meaningful military progression:

- cheap mass supply;
- standard army supply;
- premium specialization;
- elite late-game supply.

This keeps military logistics interesting without making basic resource acquisition frustrating.

## Why Librarian Uses Two Variants

Four Librarian variants were too fragmented.

The final design uses only:

### Scholar & Enchantment Librarian

Focus:

- Paper
- Books
- Bookshelves
- Lapis-related knowledge economy
- enchantment support
- normal academic utility

### Warchief & Utility Administrator

Focus:

- Conscription Writ
- normal Banner convenience trade
- Compass
- Clock
- Spyglass
- administrative and exploration utility

This keeps the Warchief path easy to understand and prevents the player from needing to reroll many Librarians.

---

# Resource Ownership and Controlled Overlap

The economy allows limited overlap where it improves usability.

## Coal

Primary supplier:

```
Toolsmith
```

Secondary supplier:

```
Mason
```

Reason:

Coal fits mining/industry, but also fits Mason's quarry, smelting, brick, stone, and construction economy.

Mason may therefore provide limited Coal access.

Toolsmith must remain the better Coal supplier in:

- price;
- quantity;
- stock;
- progression.

## Iron

Primary supplier:

```
Toolsmith
```

Secondary convenience supplier:

```
Mason
```

Mason may sell limited Iron because Iron is heavily used in construction/infrastructure contexts.

Examples:

- rails;
- buckets;
- hoppers;
- structural utility;
- construction logistics.

However Mason must not become an alternative full metal merchant.

Recommended rule:

```
Toolsmith
→ cheap/moderate Iron
→ larger quantity
→ better stock

Mason
→ more expensive Iron
→ smaller quantity
→ lower stock
```

Iron overlap exists for convenience, not profession replacement.

## Gold

Primary:

```
Toolsmith only
```

Mason should not normally sell Gold.

## Redstone

Primary:

```
Toolsmith only
```

Redstone belongs to mining/industrial progression.

## Lapis Lazuli

Primary:

```
Toolsmith
```

Secondary controlled overlap may exist in Scholar/Enchantment Librarian if useful for enchantment support.

## Diamond

Primary:

```
Toolsmith
```

Diamond equipment may also appear through:

- Weaponsmith;
- Armorer;
- Tool Specialist.

Raw Diamond remains Toolsmith-owned.

## Netherite

Raw Netherite-related material:

```
Precious Materials Broker Toolsmith
```

Finished Netherite equipment:

- Elite Weaponsmith;
- Elite Armorer.

Mason does not sell Netherite.

---

# Resource Profession Final Responsibilities

## Farmer — 3 Variants

### Crop Farmer
- Wheat
- Carrot
- Potato
- Beetroot
- Seeds
- Pumpkin
- Melon

### Provisioner
- Bread
- Baked Potato
- cooked food
- Golden Carrot
- bulk food

### Livestock & Specialty Farmer
- Eggs
- Leather
- raw/cooked meat
- animal-feed crops
- specialty agriculture
- rare crop convenience

---

## Fletcher — 3 Variants

### Forester
- Logs
- Planks
- Sticks
- Saplings
- bulk common wood

### Archer Supplier
- Bow
- Arrows
- Flint
- Feathers
- String

### Hunter & Exotic Supplier
- String
- hunting-related resources
- uncommon Logs
- uncommon Saplings
- specialty forestry goods

Wood access remains primarily a Fletcher responsibility.

---

## Mason — 3 Variants

### Quarry Supplier
- Cobblestone
- Stone
- Deepslate
- Coal in limited overlap
- limited Iron convenience at later progression

### Structural Builder
- Stone Bricks
- Bricks
- polished/structural blocks
- Deepslate structural blocks
- limited Iron construction supply

### Decorative & Luxury Mason
- Granite
- Diorite
- Andesite
- Terracotta
- Glazed Terracotta
- Quartz
- premium decorative blocks

Mason's Coal/Iron overlap must remain weaker than Toolsmith.

---

## Toolsmith — 3 Variants

### Mining & Industrial Supplier
- Coal
- Copper
- Iron
- Redstone
- Lapis
- Gold
- industrial utility materials

This is the primary general resource supplier.

### Tool Specialist
- Pickaxe
- Axe
- Shovel
- Hoe
- Iron tools
- Diamond tools

### Precious Materials Broker
- premium Iron/Gold
- Lapis
- Diamond
- Netherite Scrap

This is the expensive late-game raw-resource path.

---

## Weaponsmith — 4 Variants

Unchanged:

- Militia Supplier
- Infantry Smith
- Specialist Arms Smith
- Elite Weaponsmith

---

## Armorer — 4 Variants

Unchanged:

- Militia Armorer
- Iron Quartermaster
- Heavy Armorer
- Elite Armorer

---

## Librarian — 2 Variants

### Scholar & Enchantment Librarian
- Paper
- Books
- Bookshelves
- enchantment-related economy
- Lapis support
- academic utility

### Warchief & Utility Administrator
- Conscription Writ
- Banner convenience
- Compass
- Clock
- Spyglass
- administration
- exploration utility

---

# Population Design After Simplification

The player should not need every catalog variant for the economy to function.

Population expansion now serves mainly to increase throughput.

Example:

```
1 Mining & Industrial Toolsmith
→ access to Iron/Coal/etc.

3 Mining & Industrial Toolsmiths
→ same resource identity
→ much larger available stock
→ much larger purchasing capacity
→ faster economic expansion
```

This is intentional.

The player expands the Village because additional workers increase economic capacity, not only because they unlock new catalog combinations.



---

# Phase 04B — Warchief Economy, High-Tier Catalogs, and Final Balance

## Phase 04B Scope Alignment — High-Tier Trades Return to Progression

The temporary all-Novice catalog layout was used to verify runtime catalog selection.

After the runtime path was confirmed, Warchief-added high-tier trades were redistributed back into normal Villager progression.

Phase 04B therefore continues to own final balancing for:

- Expert/Master Diamond throughput;
- Netherite-related Master trades;
- Conscription Writ pricing and stock;
- final anti-arbitrage and discount safety.

Catalog identity remains visible at Novice through signature trades, but high-tier goods no longer need to appear at Novice.

## 1. Goal

Phase 04B completes the economy established in Phase 04A.

Phase 04A establishes:

- 7 vanilla professions;
- 4 catalog variants per profession;
- 28 recognizable economic identities;
- Novice–Journeyman pricing;
- early/mid-game Emerald specialization;
- economic caste differentiation.

Phase 04B adds:

- Expert and Master trade identity;
- Diamond access;
- Netherite-related access;
- Warchief Administrator progression;
- Conscription Writ;
- military high-tier logistics;
- final stock/restock limits;
- anti-arbitrage validation;
- final price tuning.

---

# 2. High-Tier Rule

Expert and Master levels should reward Village investment.

High-tier access must not mean:

    one Villager
    + a few Emeralds
    = unlimited Diamond / Netherite

Instead:

    population growth
    + profession leveling
    + Emerald production
    + restock cycles
    = powerful late-game Village economy

High-tier Villagers should be strategically valuable infrastructure.

---

# 3. Expert / Master Caste Behavior

Economic caste continues into late game.

## Economy

- best throughput;
- common/basic goods;
- weaker rare-material access.

## Standard

- balanced throughput;
- stronger mid-tier catalog.

## Premium

- lower stock;
- expensive prices;
- specialized high-value goods.

## Elite

- weakest early efficiency;
- strongest late-game access;
- very low stock;
- highest Emerald cost.

Therefore an Elite Villager is not "better at everything".

It is expensive infrastructure that becomes valuable only when the player can afford it.

---

# 4. Farmer High-Tier Catalogs

## Crop Farmer — Economy

### Expert
- 2E → 16 crop bundle
- 2E → 12 planting supplies

### Master
- 3E → 24 crop logistics bundle
- high stock

Purpose:
- bulk agricultural throughput.

## Provisioner — Standard

### Expert
- 4E → 8 prepared food
- 4E → 6 Golden Carrot

### Master
- 5E → 12 premium food bundle

Purpose:
- army/population provisioning.

## Livestock Supplier — Premium

### Expert
- 5E → 8 cooked meat
- 4E → livestock support bundle

### Master
- 6E → 12 premium meat bundle

Purpose:
- expensive ranch logistics.

## Specialty Grower — Elite

### Expert
- 6E → specialty crop bundle
- 6E → premium Golden Carrot trade

### Master
- 8E → high-efficiency specialty food bundle
- low stock

Purpose:
- niche late-game agricultural convenience.

---

# 5. Fletcher High-Tier Catalogs

## Forester — Economy

### Expert
- 3E → 16 Logs
- 3E → 32 Planks

### Master
- 4E → 24 mixed Logs
- high stock

## Archer Supplier — Standard

### Expert
- 5E → Bow
- 3E → 32 Arrows

### Master
- 5E → 48 Arrows
- 6E → Bow / ranged logistics premium slot

## Hunter Supplier — Premium

### Expert
- 6E → Bow
- 5E → ranged utility bundle

### Master
- 7E → premium ranged supply
- low stock

## Exotic Forester — Elite

### Expert
- 7E → uncommon wood bundle
- 6E → uncommon Saplings

### Master
- 9E → rare wood / decorative forestry bundle
- very low stock

---

# 6. Mason High-Tier Catalogs

## Quarry Supplier — Economy

### Expert
- 3E → 24 Deepslate
- 3E → 24 Stone Bricks

### Master
- 4E → 32 bulk stone bundle

## Structural Builder — Standard

### Expert
- 4E → 24 structural blocks
- 5E → 16 polished blocks

### Master
- 6E → 32 structural bundle

## Decorative Mason — Premium

### Expert
- 6E → 12 Terracotta/decorative block
- 6E → 12 polished decorative block

### Master
- 8E → 16 premium decorative bundle

## Luxury Mason — Elite

### Expert
- 10E → 12 Quartz-related blocks
- low stock

### Master
- 14E → 16 Quartz/luxury building bundle
- very low stock

This preserves the caste distinction:

    Quarry Supplier
    = cheap volume

    Luxury Mason
    = expensive aesthetic access

---

# 7. Toolsmith High-Tier Catalogs

## Mining Supplier — Economy

### Expert
- 6E → 6 Gold Ingots
- 5E → 12 Redstone
- 5E → 8 Lapis

### Master
- 10E → 1 Diamond
- stock: Low

Purpose:
- cheapest Diamond access but very limited throughput.

## Industrial Supplier — Standard

### Expert
- 7E → 6 Gold
- 6E → 12 Redstone
- 6E → 10 Lapis

### Master
- 12E → 1 Diamond
- stock: Low

Purpose:
- broad resource logistics.

## Tool Specialist — Premium

### Expert
- 14E → Diamond Pickaxe
- 12E → Diamond Axe
- stock: Low

### Master
- 18E → premium Diamond tool
- 16E → second Diamond tool option

Purpose:
- manufactured equipment, not raw-material efficiency.

## Precious Materials Broker — Elite

This is where the early expensive catalog pays off.

### Expert
- 9E → 1 Diamond
- stock: Low
- 8E → 6 Gold
- stock: Low

### Master
- 18E → 2 Diamonds
- stock: Very Low
- 24E → 1 Netherite Scrap
- stock: Very Low

Initial Netherite policy:

> Sell Netherite Scrap, not Netherite Ingot.

Reasons:
- keeps Nether crafting relevant;
- preserves some Ancient Debris progression;
- prevents Village trading from instantly replacing the Nether;
- allows a mature economic hub to supplement Netherite progression.

The initial target is:

    24 Emeralds → 1 Netherite Scrap
    stock 1–2 per restock cycle

This must be tested aggressively for balance.

---

# 8. Weaponsmith High-Tier Catalogs

## Militia Supplier — Economy

### Expert
- 8E → Iron Sword
- high stock

### Master
- 14E → Diamond Sword
- Low stock

Purpose:
- mass military supply.

## Infantry Smith — Standard

### Expert
- 9E → Iron Sword
- Medium stock

### Master
- 16E → Diamond Sword
- Low stock

## Specialist Arms Smith — Premium

### Expert
- 12E → improved weapon slot
- Low stock

### Master
- 18E → Diamond Sword
- Low stock
- specialty offensive supply

## Elite Weaponsmith — Elite

### Expert
- 14E → Diamond Sword
- Very Low stock

### Master
- 28E → Netherite Sword
- Very Low stock

This direct Netherite equipment trade is allowed only at Elite/Master and must remain extremely expensive.

If runtime balance makes it too strong, replace with:

    Diamond Sword + Netherite Upgrade material route

rather than lowering the price.

---

# 9. Armorer High-Tier Catalogs

## Militia Armorer — Economy

### Expert
- 10E → Iron armor piece
- Medium stock

### Master
- 16E → Diamond armor piece
- Low stock

## Iron Quartermaster — Standard

### Expert
- 12E → Iron Chestplate
- Medium stock

### Master
- 18E → Diamond armor piece
- Low stock

## Heavy Armorer — Premium

### Expert
- 16E → Diamond Boots/Helmet-equivalent slot
- Low stock

### Master
- 22E → Diamond Chestplate / premium armor
- Very Low stock

## Elite Armorer — Elite

### Expert
- 18E → Diamond armor piece
- Very Low stock

### Master
- 32E → Netherite armor piece
- Very Low stock

Netherite armor should remain rarer and more expensive than Diamond.

---

# 10. Librarian High-Tier Catalogs

## Scholar — Economy

### Expert
- affordable books/library utility

### Master
- bulk knowledge/library convenience

No military-exclusive role.

## Enchantment Specialist — Premium

### Expert
- high-cost enchantment-related trade

### Master
- premium enchantment slot

This remains expensive by design.

## Warchief Administrator — Standard / Strategic

This is the required military-economy variant.

### Journeyman

Guaranteed signature:

    8E → 1 Conscription Writ
    stock: 4

The exact price may move between 6E and 10E during testing.

Starting target:

    8 Emeralds

Reason:
- one Writ should represent meaningful military investment;
- mass conscription should require a real Emerald economy;
- it should not be so expensive that Phase 03 gameplay becomes unreachable.

### Expert

Optional convenience:

    3E → 1 normal vanilla Banner
    stock: Low

Important:

Any normal vanilla Banner obtained through crafting remains valid for Soldier command.

The trade is convenience only.

### Master

Potential Warchief administrative utility:

- additional Conscription Writ stock;
- future military administration item;
- no mandatory new custom item required for Phase 04.

Recommended:

    10E → 2 Conscription Writ
    stock: Low

This is a bulk convenience trade, not a cheaper infinite loop.

## Explorer / Utility Librarian — Elite

### Expert
- expensive utility/exploration item

### Master
- premium exploration/utility item

No required Warchief progression is locked behind this variant.

---

# 11. Warchief Economy Loop

Final military economy:

    productive specialization
        ↓
    sell goods
        ↓
    Emerald income
        ↓
    Warchief Administrator Librarian
        ↓
    Conscription Writ
        ↓
    convert Villager to Soldier
        ↓
    recruit with 1 Emerald
        ↓
    equip through economy

Infantry:

    Weaponsmith
    → Sword

Archer:

    Fletcher
    → Bow / Arrow supply

Mercenary:

    Armorer
    → Armor

    Weaponsmith / Fletcher
    → Sword / Bow

This creates a direct relationship:

    economic population
    ↔
    military population

Converting a useful Villager into a Soldier carries an opportunity cost because the Village loses that worker's economic catalog.

---

# 12. Population Expansion Incentive

The economy should make population growth desirable even if the player does not need more Soldiers.

Example developed Village:

    2 Farmers
    2 Fletchers
    3 Masons
    4 Toolsmiths
    2 Weaponsmiths
    2 Armorers
    2 Librarians

The player does not need every possible variant.

But additional population increases:

- resource coverage;
- restock throughput;
- access to Premium/Elite catalogs;
- Diamond acquisition speed;
- Netherite supplement access;
- army logistics.

Therefore:

    more population
    ≠ duplicated NPC clutter

Instead:

    more population
    = economic infrastructure

---

# 13. Anti-Arbitrage Rules

All prices in this document are subject to one hard rule:

> No obvious direct or processed trade loop may produce net Emerald profit without meaningful external input.

Mandatory checks:

1. player buys resource from profession A;
2. player sells same resource to profession B;
3. player crafts/processes it and sells output;
4. player exploits Hero of the Village/reputation discounts;
5. player repeats after restock.

Examples to prevent:

    3E → 4 Iron
    then
    4 Iron → 5E

or:

    1E → 16 Logs
    → craft Sticks
    → sell Sticks
    → receive more than 1E reliably

Renewable automation is allowed to generate Emerald income.

Circular merchant arbitrage is not.

---

# 14. Price Spread Target

Initial design target:

When the Village sells an item:

    effective Emerald value
    should normally be at least
    1.5×–3×
    the Village's direct buy-back value.

Premium and Elite items may use wider spreads.

This is not a strict mathematical law because stack sizes differ, but it is the balance target.

---

# 15. Discount Safety

Vanilla reputation and discount mechanics may reduce displayed Emerald prices.

Therefore anti-arbitrage testing must include:

- normal price;
- favorable discount;
- repeated trade/restock;
- cross-profession comparison.

If a trade becomes exploitable only after a strong discount, adjust:

- base price;
- quantity;
- stock;
- or remove the reverse trade.

Do not disable normal Villager reputation merely to avoid balancing the tables.

---

# 16. Stock Rules

Recommended final stock:

| Resource Type | Stock |
|---|---|
| common renewable goods | High |
| basic construction resources | High |
| Iron/Copper/Coal | Medium |
| Gold/Redstone/Lapis | Medium–Low |
| Diamond | Low |
| Diamond equipment | Low |
| Netherite Scrap | Very Low |
| Netherite equipment | Very Low |
| Conscription Writ | Low–Medium |

Emerald wealth should increase access, but not turn rare resources into unlimited instant supply.

---

# 17. Variant Lock and Player Information

The player must be able to identify catalog identity before first trade.

Required:

- signature Novice trade;
- clear enough trade composition to infer the variant;
- no hidden "surprise" where the actual specialization only appears at Expert.

After first trade:

- the catalog is considered committed;
- player is expected to keep or replace the Villager through population management, not workstation reroll exploitation.

This creates a deliberate strategic decision:

    keep this Villager
    or
    reroll before committing

Once committed:

    invest and level
    or
    breed/expand for another Villager

---

# 18. Phase 04B Final Validation Matrix

Test at minimum:

## Specialization

- crop-only player can earn Emeralds;
- forestry player can earn Emeralds;
- quarry/builder player can earn Emeralds;
- mining player can earn Emeralds;
- paper/library economy can earn Emeralds.

## Cross-Supply

Each path should be able to use Emeralds to obtain resources outside its own specialty.

Example:

    Farmer
    → Emeralds
    → Toolsmith
    → Iron / Diamond

## Population

Verify that:

- one Villager is useful;
- multiple variants are meaningfully different;
- additional population increases economic power;
- missing one exact Elite variant does not completely block progression.

## Military

Verify:

- Conscription Writ purchase;
- Soldier conversion;
- Soldier recruitment;
- Sword purchase;
- Bow purchase;
- Mercenary armor purchase;
- military logistics through restocking.

## High Tier

Measure:

- Emeralds required per Diamond;
- Diamonds per restock cycle;
- Emeralds required per Netherite Scrap;
- Netherite Scrap per restock cycle;
- Diamond/Netherite equipment acquisition time.

## Exploit

Attempt:

- direct buy/sell loops;
- crafting loops;
- workstation reroll before trade;
- workstation break after trade;
- discount abuse;
- multi-Villager arbitrage.

---

# 19. Phase 04B Checkpoint

Phase 04B is complete when:

- Expert/Master identity exists for all 28 catalog variants;
- Diamond is obtainable but expensive;
- Netherite-related access is Master-only and stock-limited;
- Warchief Administrator reliably sells Conscription Writ;
- normal vanilla Banner remains the command item;
- Premium/Elite variants justify their poor early-game pricing with stronger late-game specialization;
- Economy variants remain useful for bulk throughput;
- population growth materially expands economic capability;
- no critical resource is locked behind absurd RNG;
- no obvious infinite Emerald loop exists;
- save/reload preserves trade identity and progression;
- Phase 03/03.5 Soldier and Mercenary logistics integrate with the economy.

After this checkpoint, Phase 04 is complete.


---

## 20. Implementation Status — Executed

Phase 04B is implemented in the repository.

Release:

```
0.4.1
Warchief_Village_0-4-1.mcaddon
```

### Implemented Strategic Trades

```
Precious Materials Broker — Master
24 Emeralds → 1 Netherite Scrap
stock: Very Low

Elite Weaponsmith — Master
28 Emeralds → 1 Netherite Sword
stock: Very Low

Elite Armorer — Master
32 Emeralds → 1 Netherite Chestplate
stock: Very Low

Warchief Administrator — Journeyman
8 Emeralds → 1 Conscription Writ
stock: 4

Warchief Administrator — Expert
3 Emeralds → 1 White Banner
stock: Low

Warchief Administrator — Master
10 Emeralds → 2 Conscription Writ
stock: Low
```

The normal vanilla Banner remains a valid Soldier command item. The Librarian Banner trade is only a convenience source.

### High-Tier Caste Result

- Economy variants retain the best bulk throughput.
- Standard variants remain balanced.
- Premium variants focus on specialized/manufactured value.
- Elite variants have the strongest late-game access with low or very-low stock.

### Emerald-Income Rule Preserved

Phase 04B preserves the Phase 04A requirement:

> Every catalog variant has at least one item → Emerald trade at every Villager tier.

High-tier purchasing therefore does not remove the player's ability to earn Emeralds while leveling and using the same Villager.

### Validation Scope

Repository validation now explicitly checks the required Phase 04B strategic trades.

Static validation does not replace runtime play-testing.

The following remain runtime balance checks:

- actual Villager restock behavior;
- reputation / curing / Hero-of-the-Village discounts;
- save/reload persistence;
- exact Diamond throughput;
- exact Netherite throughput;
- workstation reroll before first trade;
- direct and crafted arbitrage under actual Bedrock discount behavior.


---

## 21. Post-Test Resource Economy Adjustment

After runtime testing, resource-heavy professions were simplified:

- Toolsmith: 4 → 3 variants.
- Mason: 4 → 3 variants.

Other professions remain unchanged for now.

The revised economic principle is:

> Population growth should primarily increase stock, restock throughput, and total economic capacity rather than force the player to hunt too many resource-catalog combinations.

Resource trades also provide more trader XP so normal economic use unlocks later tiers faster.
