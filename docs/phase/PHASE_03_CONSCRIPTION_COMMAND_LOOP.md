# Phase 03 — Conscription Writ and Soldier Command Loop

## Goal

Phase 03 builds the first complete Warchief recruitment loop while preserving the Phase 02 Soldier ownership model.

Expected flow:

    Adult Villager
        + Conscription Writ
        -> Villager Soldier (minecraft:iron_golem replacement)
        -> still unrecruited / unowned
        + 1 Emerald
        -> recruited Soldier with owner

The Conscription Writ only converts a Villager into the existing Villager Soldier actor. It does not assign ownership.

## 1. Conscription Writ

Recommended internal identifier:

    warchief:military_token

Recommended display name:

    Conscription Writ

Alternative names can be considered later, such as Draft Order or Conscription Order, without requiring the internal identifier to change.

Phase 03 should initially expose the item through Creative inventory or /give. Librarian trade integration belongs to a later economy phase.

## 2. Villager Conversion

Interaction:

    Player holds Conscription Writ
    -> right-click/use eligible adult Villager
    -> validate target
    -> spawn minecraft:iron_golem at Villager location
    -> initialize it as Villager Soldier
    -> consume exactly 1 Writ
    -> remove original Villager

The Soldier remains the current Phase 02 minecraft:iron_golem replacement. Do not introduce a separate custom Soldier entity in this phase.

Validation should include:

- target is the correct normal Villager actor;
- target is adult;
- target has not already been converted;
- player actually holds the Conscription Writ;
- replacement Soldier spawn succeeds before the original Villager is permanently removed;
- Writ is consumed only after successful conversion.

Preserve position, dimension, and facing direction when practical. Custom name preservation is optional.

## 3. Soldier State After Conscription

A newly converted Soldier is intentionally unrecruited.

The Conscription Writ must not set owner ID, owner name, tame owner, or player-specific FOLLOW state.

Recruitment remains exactly as in Phase 02:

    unrecruited Soldier + 1 Emerald
    -> recruit
    -> owner assigned
    -> commandable Soldier

Already recruited Soldiers cannot be recruited again, and a non-owner cannot overwrite ownership.

## 4. Equipment Policy

Keep the Phase 02 distinction:

Villager Soldier:
- fixed Iron Chestplate;
- armor cannot be replaced by the player;
- sword can be replaced after recruitment;
- previous player-provided sword returns exactly once;
- default weapon is never refunded as player property.

Mercenary:
- remains the flexible special/personal unit;
- retains its current weapon and armor customization rules.

## 5. Command System

Preferred Phase 03 command UX is a Banner-based group command, but it must not become a blocker.

Primary goal:

    owner holds Command Banner
    -> nearby owned Soldiers enter FOLLOW

When the Banner command is released:

    Soldiers stop following
    -> save current/release position as anchor
    -> return to PATROL around that anchor

Only Soldiers owned by that player should respond. A starting command radius around 48 blocks is reasonable and should remain configurable.

## 6. Command Banner Investigation

The preferred design is a Banner-like command item that still looks and behaves as much like a normal Minecraft Banner as possible.

Two implementation paths should be investigated:

### Option A — Use a Vanilla Banner

Recognize a specific normal Banner as the command item.

Advantages:
- normal Banner visuals remain intact;
- native Banner pattern customization remains available;
- no need to fake Banner pattern rendering.

Risks:
- distinguishing command Banner from ordinary decorative Banners;
- reliable item identification;
- main-hand/off-hand detection;
- multiplayer owner filtering.

### Option B — Custom Command Banner Item

Suggested identifier:

    warchief:command_banner

The custom item should visually copy or resemble a Banner as closely as practical.

Important investigation requirement: determine whether a true custom item can preserve or inherit the normal user-customized Banner pattern system.

This is not assumed to be possible. Custom items and native Banner pattern/block-entity behavior may not expose the same data path.

If native pattern customization cannot be preserved reliably, prefer either:

1. a normal vanilla Banner used as the command item; or
2. a fixed custom Command Banner texture.

Do not build a fragile fake Banner-pattern system just to satisfy the visual idea.

## 7. Required Fallback

If Banner commands are difficult or unreliable, retain the current direct command interaction:

    right-click owned Soldier
    -> PATROL <-> FOLLOW

This fallback is acceptable for completing Phase 03.

Banner support should be treated as preferred group-command UX, not a hard blocker.

## 8. Multiplayer and Persistence

Required:

- Player A commands only Soldier A;
- Player B commands only Soldier B;
- non-owner cannot replace another player's Soldier weapon;
- ownership survives save/reload;
- weapon state survives reload;
- PATROL/FOLLOW state survives reload;
- patrol anchor survives reload;
- a conscripted but unrecruited Soldier remains unrecruited after reload.

Conscription itself grants no ownership, so an unowned conscripted Soldier can still be recruited by a player using 1 Emerald.

## 9. Suggested Implementation Order

### Phase 03A — Item
- create warchief:military_token;
- add temporary icon;
- expose in Creative or /give.

### Phase 03B — Conversion
- validate adult Villager;
- spawn Soldier at Villager location;
- initialize Soldier;
- consume Writ exactly once;
- remove original Villager.

### Phase 03C — Recruitment Verification
- ensure converted Soldier still requires 1 Emerald;
- verify owner persistence;
- verify non-owner rejection.

### Phase 03D — Banner Prototype
- test normal Banner detection first;
- test owner-filtered group FOLLOW;
- test Banner release -> anchor -> PATROL;
- investigate main-hand/off-hand behavior.

### Phase 03E — Fallback Hardening
- retain direct right-click PATROL/FOLLOW;
- use it as supported fallback if Banner flow is unreliable.

## 10. Acceptance Criteria

- [ ] Conscription Writ custom item exists.
- [ ] Eligible adult Villager can be converted.
- [ ] Converted entity is the existing Villager Soldier / minecraft:iron_golem replacement.
- [ ] Writ is consumed exactly once only on successful conversion.
- [ ] Converted Soldier starts unrecruited.
- [ ] Converted Soldier still requires exactly 1 Emerald for recruitment.
- [ ] Owner identity persists.
- [ ] Non-owner cannot modify Soldier weapon.
- [ ] Fixed Iron Chestplate policy remains intact.
- [ ] Existing sword replacement/refund behavior remains intact.
- [ ] Direct PATROL/FOLLOW remains functional.
- [ ] Banner group FOLLOW is prototyped.
- [ ] If Banner is unreliable, direct PATROL/FOLLOW is documented as the supported fallback.
- [ ] Multiplayer ownership isolation is verified.

## 11. Out of Scope

- Bow / Archer class;
- ranged AI;
- Librarian trade integration;
- economy balancing;
- random raids/military pressure;
- additional troop classes;
- formations or squad UI.

Bow/Archer is specified separately in Phase 03.5.