# Phase 03.5 — Archer and Bow Soldier Prototype

## Goal

Phase 03.5 adds the first ranged Villager Soldier role after the Phase 03 conscription, Emerald recruitment, ownership, and command loop is stable.

Preferred progression:

    Villager
      + Conscription Writ
      -> unrecruited Soldier
      + 1 Emerald
      -> owned Soldier
      + Bow
      -> Archer role

Ownership is not changed by Archer conversion.

## 1. Weapon-Driven Role

Preferred design:

    Sword equipped -> Infantry / melee Soldier
    Bow equipped   -> Archer / ranged Soldier

The same owned Soldier can switch role when the owner changes its weapon.

Do not create a separate recruitment path for Archer.

## 2. Supported Weapons

Initial ranged weapon:

    minecraft:bow

Existing sword tiers remain valid melee weapons.

Crossbow is deferred.

## 3. Bow Interaction

Only the owner may change the Soldier weapon/class.

Expected flow:

    owner gives Bow
    -> consume Bow once
    -> return previous player-provided weapon exactly once
    -> weapon state = Bow
    -> role = Archer

When changing back to a Sword:

    owner gives Sword
    -> return player-provided Bow exactly once
    -> role = Infantry

Default equipment must never be refunded as player-owned gear.

## 4. Combat Architecture

Use separate component groups conceptually:

    warchief:combat_melee
    warchief:combat_ranged

Sword selects melee behavior. Bow selects ranged behavior.

Ranged prototype should:

- attack with arrows;
- maintain a useful distance when practical;
- face its target while firing;
- avoid constantly rushing into melee;
- continue using the same owner, PATROL, FOLLOW, and anchor systems from Phase 03.

If live component-group switching proves unstable, a one-time class transition may be evaluated, but weapon-driven switching is preferred.

## 5. Projectile Strategy

First prototype should use native Arrow projectiles.

Questions to verify during implementation:

- can the current minecraft:iron_golem replacement run standard ranged attack behavior reliably?
- does ranged behavior require a real Bow in an actual equipment slot?
- does it automatically produce Arrow projectiles or require explicit projectile configuration?
- does damage attribution behave correctly?

Do not create custom arrows until native Arrow behavior has been tested.

## 6. Ammunition

Recommended MVP:

    infinite NPC ammunition

Do not require Arrow stacks in a Soldier inventory for the first Archer implementation.

This keeps the phase focused on combat role switching, ranged AI, and visuals.

## 7. Bow Visual

Required:

- Bow visible in hand;
- Bow follows Soldier hand/arm animation;
- draw/attack animation if reliable;
- projectile firing visually matches the attack.

Test native Bedrock Bow attachable/texture-mesh rendering first.

Because the Iron Golem replacement has already shown held-item rendering limitations, a client-synced visual fallback may be used if native Bow rendering is unreliable.

Do not blindly copy the current Sword visual implementation; first inspect the vanilla Bow attachable pipeline because Bow already has native draw-state geometry/animation support.

## 8. Armor and Survivability

Archer remains a Villager Soldier and therefore keeps:

- fixed Iron Chestplate;
- current Soldier ownership model;
- current Soldier HP/defensive policy unless balancing later requires adjustment.

The Archer should not become a separate elite unit. Mercenary remains the special/personal unit.

## 9. Command Integration

Archer must use the same command system as Infantry.

FOLLOW:
- follows owner under the same Phase 03 command rules;
- may engage valid enemies.

PATROL:
- remains near anchor;
- engages enemies within useful range;
- returns toward anchor after combat.

No separate Archer command system should be created.

## 10. Persistence and Multiplayer

Persist at minimum:

- owner;
- current weapon;
- weapon source/provenance;
- current combat role;
- command mode;
- patrol anchor.

On load:

    Bow -> restore Archer/ranged state
    Sword -> restore Infantry/melee state

Only the owner may change Bow/Sword role state.

## 11. Death and Refund Policy

Permanent Iron Chestplate is default/fixed and is not manually refunded.

A player-provided Bow follows the same provenance rules as player-provided swords:

- returned exactly once when replaced;
- dropped exactly once on Soldier death;
- never duplicated through native + Script drops.

## 12. Suggested Implementation Order

### Phase 03.5A — Bow Recognition
- add minecraft:bow to valid Soldier weapon handling;
- generalize code toward weapon classification rather than sword-only naming.

### Phase 03.5B — Role State
- add melee/ranged state;
- switch component groups based on current weapon.

### Phase 03.5C — Ranged Combat
- prototype native ranged attack;
- use native Arrow projectile;
- tune distance behavior.

### Phase 03.5D — Bow Visual
- test vanilla Bow attachable and animation;
- add synced fallback only if necessary.

### Phase 03.5E — Command Integration
- test PATROL;
- test FOLLOW;
- test return-to-anchor after ranged combat.

### Phase 03.5F — Persistence / Multiplayer
- reload as Archer;
- Bow <-> Sword replacement;
- death drop;
- non-owner modification attempts.

## 13. Acceptance Criteria

- [ ] Recruited Soldier owner can give it a Bow.
- [ ] Bow is consumed exactly once.
- [ ] Previous player-provided weapon returns exactly once.
- [ ] Soldier changes to ranged/Archer behavior.
- [ ] Archer fires Arrow projectiles.
- [ ] Archer does not continuously rush into melee during normal ranged combat.
- [ ] Owner can replace Bow with Sword.
- [ ] Soldier returns to melee behavior after Sword replacement.
- [ ] Bow visual is visible and follows Soldier animation.
- [ ] PATROL and FOLLOW work for Archer.
- [ ] Archer state survives save/reload.
- [ ] Player-provided Bow refunds/drops exactly once.
- [ ] Non-owner cannot change Archer weapon/class.

## 14. Out of Scope

- Crossbow class;
- custom arrows;
- elemental arrows;
- ammunition logistics;
- multiple Archer subclasses;
- formations;
- squad UI;
- siege weapons;
- cavalry;
- Librarian economy integration.