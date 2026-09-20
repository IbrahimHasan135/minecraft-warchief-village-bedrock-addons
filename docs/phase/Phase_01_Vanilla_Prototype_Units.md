# Phase 01 — Vanilla Prototype Units: Wolf Mercenary and Iron-Golem Soldier

> Project: **Minecraft Warchief Village Bedrock Add-On**  
> Phase dependency: Phase 00 must be complete.  
> Target baseline when this document was prepared: **Bedrock 1.26.40**, stable `@minecraft/server` **2.9.0**.

---

# 1. Objective

Phase 01 is a **technical gameplay prototype**, not the final entity architecture.

The purpose is to prove that the intended Warchief interaction loop is feasible before building final custom entities.

Use:

- Vanilla **Wolf** as the temporary behavior shell for the future `warchief:mercenary`.
- Vanilla **Iron Golem** as the temporary behavior shell for the future `warchief:villager_soldier`.
- Pillager/Illager-compatible humanoid visuals as temporary art.
- One **Emerald** as the temporary recruitment/taming item for both prototypes.
- Right-click/use interaction for sword equipment.
- A normal vanilla Banner as the temporary command item for the Iron Golem prototype.
- Simplified rebalanced combat stats.

Phase 02 will move these prototypes into proper custom entities and restore vanilla Wolf/Iron Golem behavior if Phase 01 overrides them.

---

# 2. Official Documentation References

Codex should use these pages as technical references.

## Entity Behavior

**Entity Behavior Introduction**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/entitybehaviorintroduction?view=minecraft-bedrock-stable

**Entity Components Guide**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/entitycomponentsguide?view=minecraft-bedrock-stable

**Entity AI Components List**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/aigoallist?view=minecraft-bedrock-stable

## Interaction and Equipment

**minecraft:interact**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_interact?view=minecraft-bedrock-stable

**minecraft:equippable**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_equippable?view=minecraft-bedrock-stable

**PlayerInteractWithEntityBeforeEvent**  
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerinteractwithentitybeforeevent?view=minecraft-bedrock-stable

**EntityEquippableComponent**  
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityequippablecomponent?view=minecraft-bedrock-stable

## Combat

**minecraft:attack**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_attack?view=minecraft-bedrock-stable

**minecraft:behavior.melee_attack**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitygoals/minecraftbehavior_melee_attack?view=minecraft-bedrock-stable

## Banner-follow prototype

**minecraft:behavior.tempt**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitygoals/minecraftbehavior_tempt?view=minecraft-bedrock-stable

## Entity properties

**Introduction to Entity Properties**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoentityproperties?view=minecraft-bedrock-stable

## Visuals

**Creating New Entity Types**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoaddentity?view=minecraft-bedrock-stable

**Client Entity JSON**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/cliententitydocumentation/cliententitydocumentationintroduction?view=minecraft-bedrock-stable

**Animations Overview**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/animations/animationsoverview?view=minecraft-bedrock-stable

**Custom Behaviors and Render Controllers**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/behaviorrendercontrollers?view=minecraft-bedrock-stable

## Vanilla templates

**Latest Vanilla Behavior Pack Template**  
https://aka.ms/behaviorpacktemplate

---

# 3. Key Phase 01 Decisions

## 3.1 Emerald recruitment / taming

Primary recruitment method:

```text
Player holds 1 Emerald
        +
right-click / use on prototype unit
        ↓
unit becomes owned/recruited by that player
        ↓
1 Emerald is consumed
```

This applies to both Phase 01 prototypes:

- Wolf/Mercenary shell.
- Iron-Golem/Soldier shell.

Expected rule:

```text
not recruited
→ does not accept sword equipment
→ does not obey command-follow

recruited by Player A
→ accepts sword equipment from Player A
→ follows/commands for Player A
```

For the Wolf prototype, prefer changing/augmenting vanilla Wolf taming so `minecraft:emerald` is the required tame item with 100% success.

For the Iron Golem prototype, test whether adding `minecraft:tameable` with `minecraft:emerald` can create a usable owner relationship. If native tame ownership does not work cleanly on Iron Golem, use `minecraft:interact` or stable Script API fallback to store a prototype owner marker.

Phase 01 ownership is still prototype ownership. It is allowed to be simpler than the final multiplayer-safe ownership system, but it must prove that the command/equipment loop can be gated behind Emerald recruitment.

## 3.2 Sword interaction

Primary gameplay method:

```text
Player holds valid sword
        +
right-click / use on prototype unit
        ↓
unit receives sword state/equipment
```

Do **not** use item dropping as the intended mechanic.

Dropping a sword near the entity is only a diagnostic fallback if direct interaction/equipping cannot be made to work during the prototype.

Reason:

- `minecraft:interact` is designed for direct player → entity interactions.
- It can filter based on the item held.
- It can equip an item slot and trigger an event.
- Script API can also inspect the `itemStack`, `player`, and `target` for player/entity interactions.
- Drop pickup introduces unnecessary ambiguity and multiplayer race conditions.

---

# 4. Prototype Scope

Phase 01 must prove:

### Wolf prototype

- [ ] Wolf visually appears humanoid / Pillager-like.
- [ ] Wolf can be tamed/recruited with exactly 1 Emerald.
- [ ] Wolf still follows its owner.
- [ ] Wolf stay/sit **behavioral state** is preserved if possible.
- [ ] A matching humanoid sitting animation is not required.
- [ ] Player can right-click it with a sword after Emerald recruitment.
- [ ] Non-owner sword interaction is denied or documented as a prototype limitation.
- [ ] Sword tier is detected.
- [ ] Sword can be represented visually if feasible.
- [ ] Sword tier changes attack damage.
- [ ] Wolf is stronger than vanilla baseline if required for useful combat.

### Iron Golem prototype

- [ ] Iron Golem visually appears humanoid / Pillager-like.
- [ ] Iron Golem can be recruited with exactly 1 Emerald.
- [ ] It still moves and fights.
- [ ] Its excessive vanilla strength is reduced.
- [ ] Player can right-click it with a sword after Emerald recruitment.
- [ ] Non-owner sword interaction is denied or documented as a prototype limitation.
- [ ] Sword tier is detected.
- [ ] Sword can be represented visually if feasible.
- [ ] Sword tier changes attack damage.
- [ ] It follows its recruiting player holding any vanilla Banner within a reasonable radius.
- [ ] Removing the Banner stops command-follow behavior.

---

# 5. Important Prototype Limitation

Phase 01 implements **prototype ownership**, not the final production ownership system.

During Phase 01:

```text
Player A gives 1 Emerald
→ prototype owner/recruited player = Player A
→ Player A can equip/command the prototype
```

This is required because Phase 01 must prove the loop:

```text
Emerald recruit
→ owner-gated equipment
→ owner-gated command/follow
```

Final rule:

```text
ownership persists safely across multiplayer and reloads
```

belongs to later custom-entity/ownership phases.

Wolf ownership may use vanilla taming ownership in Phase 01, but its tame item should be Emerald rather than Bone.

Iron Golem ownership may be less native than Wolf ownership. If native `minecraft:tameable` does not produce the needed owner relationship for Iron Golem, document the blocker and use a minimal Script API owner marker for this prototype.

---

# 6. Recommended Implementation Order

Implement in this order:

1. Snapshot vanilla Wolf and Iron Golem definitions from current official template.
2. Build Resource Pack visual override.
3. Verify movement/animations do not catastrophically break.
4. Add Emerald recruitment/taming for Wolf and Iron Golem.
5. Preserve or emulate owner follow/command gating after Emerald recruitment.
6. Normalize prototype health/damage.
7. Add owner-gated direct sword interaction.
8. Add sword tier state.
9. Try actual main-hand item rendering.
10. Add owner-gated Banner-follow to Iron Golem.
11. Run test matrix.
12. Document what needs migration to custom entities in Phase 02.

Do not start with Script API if data-driven components solve the requirement cleanly.

---

# 7. Visual Override Strategy

Both prototypes should look like humanoid soldiers rather than a Wolf and a large Iron Golem.

For Phase 01:

- Reuse or derive Pillager/Illager-compatible geometry.
- Use temporary textures.
- Prefer existing vanilla-compatible animations where possible.
- Do not spend excessive time obtaining final-quality animation compatibility.

---

# 8. Resource Pack Structure for Phase 01

Possible working files:

```text
resource_pack/
├── entity/
│   ├── wolf.entity.json
│   └── iron_golem.entity.json
├── models/
│   └── entity/
│       └── warchief_prototype_humanoid.geo.json
├── textures/
│   └── entity/
│       ├── warchief_mercenary_prototype.png
│       └── warchief_villager_soldier_prototype.png
├── animations/
│   └── warchief_prototype.animation.json
├── animation_controllers/
│   └── warchief_prototype.animation_controllers.json
└── render_controllers/
    └── warchief_prototype.render_controllers.json
```

Do not assume the vanilla Pillager client entity can be copied blindly.

Bone names and animation assumptions must be checked.

---

# 9. Visual Fallback Rule

Try:

```text
vanilla Pillager/Illager geometry
+ compatible vanilla animations
```

first.

If that causes major problems because of bone names or controllers:

```text
create a small local humanoid geometry
+ only required Phase 01 animations
```

Do not let perfect visual compatibility block the gameplay test.

Phase 01 visual success means:

- recognizably humanoid;
- texture works;
- walking is usable;
- attack does not catastrophically deform model;
- held-sword experiment can be attempted.

---

# 10. Wolf Prototype Behavior

The Wolf is the temporary shell for Mercenary behavior because vanilla Wolf already provides:

- taming;
- owner;
- owner follow;
- stay/sit state;
- owner combat support.

Preserve these as much as possible.

For Phase 01, replace Bone as the prototype tame/recruit item with Emerald if the vanilla Wolf definition supports it cleanly.

Expected prototype flow:

```text
spawn Wolf prototype
      ↓
tame/recruit with 1 Emerald
      ↓
Wolf owner = Player A
      ↓
Wolf follows Player A
      ↓
Player A equips sword via right-click
      ↓
Wolf retains owner-follow
```

Do not make sword interaction perform taming in Phase 01.

Emerald recruitment is the only intended Phase 01 recruitment method.

---

# 11. Wolf Sit / Stay

The visible Pillager-like humanoid may not have a correct sitting animation.

That is acceptable.

However, preserve the **behavior state** if possible:

```text
follow
↔
stay
```

The test is whether the prototype stops following when vanilla Wolf is placed into its stay/sit state.

If the model looks visually awkward while "sitting":

- record the issue;
- do not remove the behavioral state just because the temporary animation is ugly.

---

# 12. Iron Golem Prototype Role

The Iron Golem is only a temporary behavior shell.

Do not treat its original strength as desirable.

Phase 01 intentionally changes its combat feel to approximate an ordinary humanoid military unit.

Preserve:
- navigation;
- target acquisition where useful;
- basic hostile-mob combat.

Reduce:
- extreme health if necessary;
- extreme attack damage;
- excessive knockback behavior if it prevents normal soldier feel.

The final custom Soldier will not be an Iron Golem.

---

# 13. Provisional Combat Stats

These values are **prototype values**, not final balancing.

Suggested starting point:

| Prototype | Health |
|---|---:|
| Wolf/Mercenary shell | 24 |
| Iron-Golem/Soldier shell | 28 |

Suggested melee damage by sword tier:

| Weapon state | Damage |
|---|---:|
| no recognized sword | 2 |
| Wooden Sword | 4 |
| Stone Sword | 5 |
| Iron Sword | 6 |
| Diamond Sword | 8 |
| Netherite Sword | 9 |

Purpose:

- Wolf should no longer feel useless.
- Iron Golem should no longer delete enemies with vanilla Golem-level damage.
- Both units should feel like soldier-scale combatants.
- Sword tier should be visibly meaningful.

These numbers must be easy to change.

---

# 14. Damage Implementation Strategy

Use `minecraft:attack` to define melee damage.

Microsoft documents `minecraft:attack` as the component that defines entity melee damage.

Use component groups for weapon tiers.

Conceptual example:

```json
"component_groups": {
  "warchief:weapon_none": {
    "minecraft:attack": { "damage": 2 }
  },
  "warchief:weapon_wood": {
    "minecraft:attack": { "damage": 4 }
  },
  "warchief:weapon_stone": {
    "minecraft:attack": { "damage": 5 }
  },
  "warchief:weapon_iron": {
    "minecraft:attack": { "damage": 6 }
  },
  "warchief:weapon_diamond": {
    "minecraft:attack": { "damage": 8 }
  },
  "warchief:weapon_netherite": {
    "minecraft:attack": { "damage": 9 }
  }
}
```

Use events to remove the previous weapon component group before applying the new one.

Conceptual event:

```json
"warchief:equip_iron_sword": {
  "remove": {
    "component_groups": [
      "warchief:weapon_none",
      "warchief:weapon_wood",
      "warchief:weapon_stone",
      "warchief:weapon_iron",
      "warchief:weapon_diamond",
      "warchief:weapon_netherite"
    ]
  },
  "add": {
    "component_groups": [
      "warchief:weapon_iron"
    ]
  }
}
```

Exact JSON must be validated against the current 1.26.40 entity schema.

---

# 15. Entity Property for Weapon State

If visual rendering needs to know weapon tier, prefer a persisted entity property where practical.

Microsoft documents entity properties as per-entity values that persist across save/load and can be synchronized to Resource Packs when client sync is enabled.

Conceptual property:

```json
"properties": {
  "warchief:weapon_tier": {
    "type": "enum",
    "values": [
      "none",
      "wood",
      "stone",
      "iron",
      "diamond",
      "netherite"
    ],
    "default": "none",
    "client_sync": true
  }
}
```

If modifying a vanilla entity definition makes a synced property difficult or risky, document it and use a minimal prototype alternative.

---

# 16. Emerald Recruitment — Preferred Data-Driven Path

Primary candidates:

```text
minecraft:tameable
minecraft:interact
```

For Wolf:

- Prefer `minecraft:tameable` with `tame_items` set to `minecraft:emerald`.
- Use `probability: 1` so 1 Emerald always recruits/tames the prototype.
- Preserve owner-follow and stay/sit behavior.

Conceptual Wolf pattern:

```json
"minecraft:tameable": {
  "probability": 1.0,
  "tame_items": [
    "minecraft:emerald"
  ],
  "tame_event": {
    "event": "minecraft:on_tame",
    "target": "self"
  }
}
```

For Iron Golem:

- First test whether `minecraft:tameable` can be added cleanly and produce useful ownership.
- If native ownership does not work, use `minecraft:interact` to consume Emerald and trigger a recruited component group/property.
- If data-driven ownership cannot identify the interacting player reliably enough, use stable Script API as fallback.

Conceptual interact fallback:

```json
"minecraft:interact": {
  "interactions": [
    {
      "interact_text": "action.interact.tame",
      "use_item": true,
      "on_interact": {
        "filters": {
          "all_of": [
            {
              "test": "has_equipment",
              "subject": "other",
              "domain": "hand",
              "value": "minecraft:emerald"
            }
          ]
        },
        "event": "warchief:prototype_recruit",
        "target": "self"
      }
    }
  ]
}
```

The exact item consumption behavior must be verified. If `use_item` does not consume exactly one Emerald for the chosen implementation, Script API must handle inventory safely and prevent duplication.

Recommended prototype owner state:

- Native tame owner for Wolf if possible.
- Native tame owner for Iron Golem if possible.
- Script-owned dynamic property or tag only if native ownership cannot support the prototype.

---

# 17. Direct Sword Interaction — Preferred Data-Driven Path

Primary candidate:

```text
minecraft:interact
```

The documentation supports:

- player/entity interaction;
- filters;
- item use;
- event trigger;
- `equip_item_slot`;
- main-hand equipment slot naming.

Sword interaction must be gated behind Emerald recruitment. If the owner/recruited player cannot be checked cleanly in data-driven JSON, use Script API fallback for the owner check.

Conceptual pattern:

```json
"minecraft:interact": {
  "interactions": [
    {
      "interact_text": "action.interact.equip",
      "use_item": true,
      "equip_item_slot": "slot.weapon.mainhand",
      "on_interact": {
        "filters": {
          "all_of": [
            {
              "test": "has_equipment",
              "subject": "other",
              "domain": "hand",
              "value": "minecraft:iron_sword"
            }
          ]
        },
        "event": "warchief:equip_iron_sword",
        "target": "self"
      }
    }
  ]
}
```

This is a **design template**. Codex must validate exact field compatibility with Bedrock 1.26.40 before copying it verbatim.

Repeat or generalize for:

```text
minecraft:wooden_sword
minecraft:stone_sword
minecraft:iron_sword
minecraft:diamond_sword
minecraft:netherite_sword
```

---

# 18. `minecraft:equippable` Test

Also test whether `minecraft:equippable` can provide a cleaner native equipment path for these overridden entities.

Conceptual example:

```json
"minecraft:equippable": {
  "slots": [
    {
      "slot": 0,
      "accepted_items": [
        "minecraft:wooden_sword",
        "minecraft:stone_sword",
        "minecraft:iron_sword",
        "minecraft:diamond_sword",
        "minecraft:netherite_sword"
      ],
      "on_equip": {
        "event": "warchief:on_weapon_equipped",
        "target": "self"
      }
    }
  ]
}
```

Important:

The current docs note that from 1.26.0, `on_equip` / `on_unequip` no longer fire simply because the world loads; they fire from in-game equipment interaction.

If this works reliably with vanilla Wolf/Iron Golem overrides, prefer it.

If not, use `minecraft:interact` or Script API.

---

# 19. Script API Fallback for Sword Interaction

If native `minecraft:interact` / `minecraft:equippable` cannot reliably distinguish or equip the sword on the overridden vanilla entity, use stable Script API.

Use this fallback also when data-driven JSON cannot enforce:

```text
only the player who recruited with Emerald
→ can equip/change sword
```

The stable API exposes `PlayerInteractWithEntityBeforeEvent`, which provides:

```text
player
target
itemStack
cancel
```

Conceptual TypeScript:

```ts
import {
  system,
  world,
  EntityComponentTypes,
  EquipmentSlot,
} from "@minecraft/server";

const VALID_SWORDS = new Set([
  "minecraft:wooden_sword",
  "minecraft:stone_sword",
  "minecraft:iron_sword",
  "minecraft:diamond_sword",
  "minecraft:netherite_sword",
]);

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
  const item = event.itemStack;
  if (!item || !VALID_SWORDS.has(item.typeId)) return;

  const target = event.target;
  if (
    target.typeId !== "minecraft:wolf" &&
    target.typeId !== "minecraft:iron_golem"
  ) return;

  // Prototype owner check belongs here if data-driven ownership is not enough.

  system.run(() => {
    const equippable = target.getComponent(EntityComponentTypes.Equippable);
    if (!equippable) {
      console.warn(`[Warchief:P01] ${target.typeId} has no equippable component`);
      return;
    }

    // Prototype only. Exact item transfer/consumption must prevent duplication.
    const ok = equippable.setEquipment(EquipmentSlot.Mainhand, item.clone());
    console.warn(`[Warchief:P01] equip ${item.typeId} -> ${target.typeId}: ${ok}`);
  });
});
```

Important:

- Do not copy inventory items without handling consumption, or duplication will occur.
- Do not mutate equipment directly from restricted-execution callbacks if the API disallows it.
- Use `system.run` or another documented non-restricted execution path.
- Verify exact stable API names against installed `@minecraft/server` 2.9.0 typings.
- This code is a technical pattern, not guaranteed copy-paste final code.

Phase 01 may use this only as fallback.

---

# 20. Item Consumption Rules

Recommended:

```text
right-click with sword
→ sword becomes unit equipment
→ one sword leaves player inventory
```

When replacing a weapon during Phase 01:

Preferred if reliable:

```text
old sword drops from unit
new sword equips
```

Acceptable prototype fallback:

```text
old state is replaced
new sword consumed
old sword is not returned
```

If fallback is used, document it clearly.

Avoid silent duplication.

---

# 21. Visible Sword Goal

Phase 01 should attempt to make the sword visibly appear in the humanoid unit's hand.

This is technically separate from damage state.

Success hierarchy:

### Level A — Best

The entity actually equips the vanilla item into its main-hand slot and the humanoid rendering pipeline displays the correct item.

### Level B — Acceptable prototype

Weapon property controls a render-controller/attachable state that renders the correct sword model visually.

### Level C — Still acceptable Phase 01 result

Interaction and stat change work, but held-item rendering does not work reliably on overridden Wolf/Iron Golem. Document it and move final visual equipment to Phase 02 custom entities.

Do **not** fail the entire phase solely because vanilla shell entities do not render held items cleanly.

---

# 22. Humanoid Held Item Considerations

A Wolf or Iron Golem was not authored as a player-like held-item entity.

Potential problems:

- no compatible item/hand bone;
- vanilla client entity does not expose held-item rendering as expected;
- Pillager animation controller assumes different bones;
- attack animation may not align with hand position.

If necessary, local prototype geometry should include a hand/item attachment bone compatible with the chosen rendering method.

Do not fake a permanent sword texture directly into the skin, because Phase 01 must demonstrate multiple weapon tiers.

---

# 23. Banner Follow — Preferred Phase 01 Method

For Phase 01, the cleanest first experiment is **data-driven `minecraft:behavior.tempt`**, but only if it can be combined with the Emerald recruitment requirement without creating misleading behavior.

Microsoft documents `minecraft:behavior.tempt` as a behavior that makes a mob follow a player holding specified items using pathfinding.

That maps almost exactly to the Phase 01 requirement:

```text
recruited owner holds Banner
→ prototype Iron Golem follows recruited owner

recruited owner no longer holds Banner
→ tempt condition ends
→ prototype stops following
```

If pure `minecraft:behavior.tempt` follows any player with a Banner, that is no longer a complete success after the Emerald recruitment update. It may still be useful as a movement experiment, but the result must be documented as not owner-gated and either fixed with Script API fallback or deferred to Phase 02.

---

# 24. Banner IDs

Phase 01 requirement:

> **Any normal vanilla Banner color should work.**

Do not hard-code only a white banner.

The implementation must support the current vanilla banner item IDs.

At minimum verify:

```text
minecraft:white_banner
minecraft:orange_banner
minecraft:magenta_banner
minecraft:light_blue_banner
minecraft:yellow_banner
minecraft:lime_banner
minecraft:pink_banner
minecraft:gray_banner
minecraft:light_gray_banner
minecraft:cyan_banner
minecraft:purple_banner
minecraft:blue_banner
minecraft:brown_banner
minecraft:green_banner
minecraft:red_banner
minecraft:black_banner
```

Codex should verify IDs against the target Bedrock version rather than assuming this list is permanently exhaustive.

---

# 25. Banner `minecraft:behavior.tempt` Prototype

Conceptual Iron Golem override component:

```json
"minecraft:behavior.tempt": {
  "priority": 3,
  "speed_multiplier": 1.05,
  "within_radius": 32,
  "can_get_scared": false,
  "items": [
    "minecraft:white_banner",
    "minecraft:orange_banner",
    "minecraft:magenta_banner",
    "minecraft:light_blue_banner",
    "minecraft:yellow_banner",
    "minecraft:lime_banner",
    "minecraft:pink_banner",
    "minecraft:gray_banner",
    "minecraft:light_gray_banner",
    "minecraft:cyan_banner",
    "minecraft:purple_banner",
    "minecraft:blue_banner",
    "minecraft:brown_banner",
    "minecraft:green_banner",
    "minecraft:red_banner",
    "minecraft:black_banner"
  ]
}
```

This should be the **first implementation attempt** for Phase 01.

Why it is attractive:

- no Script API polling;
- native pathfinding;
- naturally reacts to held item;
- naturally stops when item is no longer held;
- does not require fake ownership.

---

# 26. Banner Follow Priority

AI goal priority matters.

Lower numeric `priority` means higher AI priority.

Banner follow should be important but should not necessarily suppress survival/combat behavior at all times.

Prototype policy:

- combat/self-defense may outrank Banner follow;
- Banner follow should outrank random stroll;
- once combat ends, entity should resume temptation/follow if Banner remains held.

Codex must inspect vanilla Iron Golem AI priorities before assigning the final number.

Do not blindly use priority `3` if it conflicts with critical combat goals.

---

# 27. Banner Main Hand vs Off-Hand

`minecraft:behavior.tempt` should first be tested using normal held-item behavior.

Phase 01 required:

- main-hand Banner follow.

Phase 01 research-only:

- off-hand Banner follow.

Do not make off-hand a blocker.

If `minecraft:behavior.tempt` only reacts to the main hand in practical testing, document it.

Later Script API command logic can explicitly inspect equipment slots if final design requires off-hand command banners.

---

# 28. Banner Script API Fallback

Only if `minecraft:behavior.tempt` cannot reliably satisfy the Phase 01 command test:

Use stable Script API to inspect player equipment and toggle a documented entity event/component-group/AI state.

Important:

- Do not invent a non-existent Script API `moveTo()` call.
- Do not run a whole-world per-tick scan.
- Throttle any required proximity checks.
- Prefer toggling data-driven AI behavior over manually simulating pathfinding.

The preferred Phase 01 design is still data-driven temptation.

---

# 29. Iron Golem Health / Damage Override

Prototype health example:

```json
"minecraft:health": {
  "value": 28,
  "max": 28
}
```

Prototype baseline attack example:

```json
"minecraft:attack": {
  "damage": 2
}
```

Then weapon component groups replace `minecraft:attack`.

Be careful:

- vanilla Golem may have other special attack behaviors;
- knockback/launch behavior may still make it feel overpowered;
- inspect current vanilla definition before deciding what to remove.

The goal is not to reproduce Golem power.

The goal is:

> preserve useful pathfinding/combat behavior while normalizing it into a soldier-scale prototype.

---

# 30. Wolf Health / Damage Override

Prototype health example:

```json
"minecraft:health": {
  "value": 24,
  "max": 24
}
```

Weapon state supplies attack damage.

Do not remove:

- tameable behavior;
- owner follow;
- owner defense;
- sit/stay state,

unless a specific conflict is documented.

---

# 31. Sounds

Phase 01 may test Villager-like sound identity.

However sound replacement is secondary to:

1. visual shell;
2. sword interaction;
3. combat stats;
4. Banner follow.

If sound override becomes complicated, document and defer.

Do not block Phase 01 on audio polish.

---

# 32. Suggested Phase 01 File Layout

```text
behavior_pack/
├── entities/
│   ├── wolf.json
│   └── iron_golem.json
├── scripts/
│   └── main.js
└── ...

resource_pack/
├── entity/
│   ├── wolf.entity.json
│   └── iron_golem.entity.json
├── models/
│   └── entity/
│       └── warchief_prototype_humanoid.geo.json
├── textures/
│   └── entity/
│       ├── mercenary_prototype.png
│       └── villager_soldier_prototype.png
├── animations/
├── animation_controllers/
└── render_controllers/

src/
├── main.ts
└── phase01/
    ├── equipment.ts
    └── debug.ts
```

If Phase 01 remains fully data-driven, `phase01/equipment.ts` is unnecessary.

Do not add script code merely because the folder exists.

---

# 33. Debug Logging

Use consistent prefix:

```text
[Warchief:P01]
```

Examples:

```text
[Warchief:P01] Wolf prototype loaded
[Warchief:P01] equip minecraft:iron_sword -> minecraft:wolf
[Warchief:P01] iron golem banner-follow test active
```

Avoid per-tick spam.

---

# 34. Phase 01 Test Matrix

## Test 1 — Wolf visual

```mcfunction
/summon wolf ~ ~ ~
```

Expected:
- humanoid prototype visible;
- texture not purple/black;
- movement usable.

## Test 2 — Wolf Emerald recruitment

1. Hold exactly 1 Emerald.
2. Right-click/use on Wolf prototype.
3. Verify Emerald is consumed.
4. Walk away.
5. Verify follow.
6. Trigger stay/sit.
7. Walk away again.
8. Resume follow.

Expected:
- Emerald recruitment succeeds;
- owner behavior survives visual override.

## Test 3 — Wolf sword interaction

First recruit the Wolf with 1 Emerald.

Test:
- Wooden Sword
- Stone Sword
- Iron Sword
- Diamond Sword
- Netherite Sword

For each:
1. hold sword;
2. right-click prototype;
3. verify interaction recognized;
4. verify item consumption behavior;
5. verify weapon state;
6. verify visible held item if supported;
7. verify damage changes.

Also test sword interaction before Emerald recruitment.

Expected:
- unrecruited Wolf does not accept equipment, or the limitation is documented;
- recruited Wolf accepts owner equipment.

## Test 4 — Wolf damage

Use the same target type and controlled difficulty.

Record approximate hits-to-kill for each sword tier.

Expected ordering:

```text
no sword < wood < stone < iron < diamond < netherite
```

## Test 5 — Iron Golem visual

```mcfunction
/summon iron_golem ~ ~ ~
```

Expected:
- humanoid prototype;
- correct temporary texture;
- basic movement.

## Test 6 — Iron Golem combat normalization

Spawn a controlled hostile mob.

Expected:
- prototype can fight;
- no obvious vanilla-Golem one-shot style at basic weapon tier;
- health is soldier-like rather than boss-like.

## Test 7 — Iron Golem sword interaction

First recruit the Iron Golem with 1 Emerald.

Repeat all sword tiers.

Expected:
- same state/damage progression concept as Wolf;
- held-item rendering attempted;
- unrecruited Iron Golem does not accept equipment, or the limitation is documented.

## Test 8 — Iron Golem Emerald recruitment

1. Spawn Iron Golem prototype.
2. Hold exactly 1 Emerald.
3. Right-click/use on Iron Golem prototype.
4. Verify Emerald is consumed.
5. Record whether native tame ownership or Script API owner marker is used.

Expected:
- Iron Golem can enter recruited state;
- the recruiting player is recorded well enough to gate Phase 01 equipment and command tests.

## Test 9 — Banner follow

1. Spawn Iron Golem prototype.
2. Recruit with 1 Emerald.
3. Stand within command radius.
4. Hold one vanilla Banner.
5. Walk 10-20 blocks.
6. Verify prototype follows.
7. Remove Banner from hand.
8. Walk farther.

Expected:
- follows recruited owner while Banner is held;
- stops being tempted/commanded when Banner is removed.

## Test 10 — Banner color coverage

Test at least:
- white;
- red;
- blue;
- black.

Then verify implementation includes all standard banner color IDs.

## Test 11 — Combat vs Banner priority

1. Recruit Iron Golem with 1 Emerald.
2. Hold Banner.
3. Cause valid hostile target to appear.
4. Observe prototype.

Desired behavior:
- entity may engage nearby hostile based on combat priority;
- after combat, it resumes following Banner holder if still valid.

Document actual behavior.

## Test 12 — Save/reload

Recruit with 1 Emerald.
Equip sword.

Save world.

Reload.

Expected:
- entity remains valid;
- recruited/owner state persists if implementation supports persistence;
- weapon state persists if implementation uses persistent entity property/equipment;
- no load-time event incorrectly duplicates equipment.

---

# 35. Phase 01 Performance Rules

Do not:

- scan every entity every tick;
- scan every player every tick for Banner if data-driven `tempt` works;
- implement global world polling;
- add heavy script ownership logic.

Prefer:

```text
native AI goal
event-driven interaction
persisted entity state
```

---

# 36. Known Risks

## Risk A — overriding vanilla entities globally

Phase 01 override affects all Wolves/Iron Golems in worlds using the pack.

Accepted temporarily.

Must be removed/reverted in Phase 02 when custom entities are introduced.

## Risk B — client animation incompatibility

Pillager geometry and Wolf/Golem animation assumptions may conflict.

Mitigation:
- local prototype humanoid geometry;
- simple animations;
- do not over-polish.

## Risk C — held-item rendering

The entity may successfully store/equip a sword without visually rendering it.

Mitigation:
- verify hand/item bones;
- test attachable/render-controller route;
- defer final held-item visuals to custom entities if needed.

## Risk D — Golem special combat behavior

Damage may be reduced but Golem-specific movement/knockback can still feel too powerful.

Mitigation:
- inspect vanilla behavior JSON;
- remove only the specific components responsible;
- do not rewrite full combat AI in Phase 01.

## Risk E — Banner tempt follows any player

No longer desired after the Emerald recruitment update.

Mitigation:
- gate Banner command behind Emerald recruitment;
- if pure `minecraft:behavior.tempt` cannot know the recruiting player, document the limitation and use a minimal Script API fallback or defer final owner-aware command to Phase 02.

## Risk F — Iron Golem native ownership may not work

Iron Golem is not normally authored as a tameable owner-follow mob.

Mitigation:
- test `minecraft:tameable` first;
- if it fails, use `minecraft:interact` plus Script API owner marker for the prototype;
- document exactly what must become custom entity logic in Phase 02.

---

# 37. Phase 01 Acceptance Criteria

## Visual

- [ ] Wolf prototype is humanoid/Pillager-like.
- [ ] Iron Golem prototype is humanoid/Pillager-like.
- [ ] No missing-texture purple/black output.
- [ ] Basic animations are usable.

## Wolf

- [ ] Can be recruited/tamed with exactly 1 Emerald.
- [ ] Follows vanilla owner.
- [ ] Stay/sit behavior state still functions or limitation is documented.
- [ ] Sword interaction works by right-click/use after Emerald recruitment.
- [ ] Unrecruited sword interaction is denied or documented.

## Iron Golem

- [ ] Can be recruited with exactly 1 Emerald.
- [ ] Can still move.
- [ ] Can fight hostile mobs.
- [ ] Vanilla excessive combat strength has been reduced.
- [ ] Sword interaction works by right-click/use after Emerald recruitment.
- [ ] Unrecruited sword interaction is denied or documented.
- [ ] Follows recruiting player holding Banner, or fallback/limitation is documented.

## Equipment

- [ ] Equipment is gated behind Emerald recruitment.
- [ ] All five sword tiers are recognized.
- [ ] Sword tier changes attack damage.
- [ ] Item consumption does not duplicate swords.
- [ ] Visible held-sword rendering is attempted.
- [ ] If visual held item fails, exact limitation is documented.

## Banner

- [ ] Main-hand vanilla Banner triggers follow behavior after Emerald recruitment.
- [ ] Removing Banner stops follow behavior.
- [ ] More than one Banner color works.
- [ ] All standard banner variants are represented in the implementation.
- [ ] Off-hand result is documented but is not a Phase 01 blocker.

## Stability

- [ ] Save/reload does not break prototypes.
- [ ] No repeated severe content-log error.
- [ ] No repeated script exception.
- [ ] No per-tick debug spam.

---

# 38. Phase 01 Deliverables

Codex must provide:

1. All modified BP files.
2. All modified RP files.
3. Any TypeScript source added.
4. Compiled JavaScript if repository policy includes generated output.
5. `docs/PHASE_01_RESULT.md`.

`PHASE_01_RESULT.md` must contain:

```markdown
# Phase 01 Result

## Environment
- Bedrock version:
- @minecraft/server version:

## Wolf Prototype
- Visual:
- Emerald recruitment:
- Follow:
- Stay:
- Sword interaction:
- Visible sword:
- Damage tiering:

## Iron Golem Prototype
- Visual:
- Emerald recruitment:
- Owner/marker method:
- Combat:
- Rebalanced stats:
- Sword interaction:
- Visible sword:
- Banner follow:

## Banner Method
- minecraft:behavior.tempt result:
- Owner-gated command result:
- Main-hand:
- Off-hand:
- Banner variants:

## Equipment Method
- minecraft:interact result:
- minecraft:equippable result:
- Script fallback used?:

## Known Limitations

## Content Log Errors

## Recommendation for Phase 02
```

---

# 39. Codex Execution Instructions

Codex must:

1. Read Phase 00 and all project design documents first.
2. Obtain the current vanilla Wolf/Iron Golem definitions from an appropriate current reference/template.
3. Do not rewrite vanilla behavior from memory.
4. Implement the Resource Pack visual prototype first.
5. Implement Emerald recruitment for Wolf and Iron Golem.
6. Preserve Wolf owner follow/stay behavior after Emerald recruitment.
7. Gate equipment and command behavior behind Emerald recruitment.
8. Normalize Wolf/Iron Golem combat stats.
9. Use right-click/use for sword equipment.
10. Try native `minecraft:interact` / `minecraft:equippable` before adding Script API.
11. Implement sword-tier damage.
12. Attempt actual held-sword visualization.
13. Implement Iron Golem Banner-follow using `minecraft:behavior.tempt` as the first choice if it can be owner-gated; otherwise document and use fallback.
14. Use all vanilla Banner color IDs, not only white Banner.
15. Use Script API only if the data-driven approach cannot satisfy the prototype.
16. Run the test matrix.
17. Produce `PHASE_01_RESULT.md`.
18. Stop after Phase 01.

Do not proceed into custom `warchief:villager_soldier` or `warchief:mercenary` implementation unless Phase 02 is explicitly requested.

---

# 40. Phase 01 Success Definition

Phase 01 is successful if it proves this loop:

```text
WOLF PROTOTYPE
right-click/use with 1 Emerald
→ humanoid mercenary visual
→ follows owner
→ player right-clicks with sword
→ sword tier recognized
→ damage changes
→ sword appears visually if vanilla shell permits

IRON GOLEM PROTOTYPE
humanoid villager-soldier visual
→ player right-clicks with 1 Emerald
→ prototype records/recruits owner
→ player right-clicks with sword
→ sword tier recognized
→ soldier-scale damage
→ owner holds any Banner
→ entity follows
→ Banner removed
→ entity stops command-follow
```

The purpose is **proof of mechanics**, not final architecture.

Phase 02 can then migrate successful ideas into clean custom entities without guessing.
