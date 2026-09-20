# Phase 01 Improvement — Villager Soldier Follow / Patrol Command System

> Project: **Minecraft Warchief Village Bedrock Add-On**  
> Purpose: Improve the Phase 01 Iron Golem / Villager Soldier prototype command behavior so it feels natural, controllable, and closer to a real military unit.  
> Scope: This document is an improvement patch for the existing Phase 01 implementation. It does not replace the full Phase 01 document.

---

# 1. Problem Summary

The current recruited Iron Golem prototype has already proven several useful mechanics:

- It can be recruited and assigned to a player.
- It can use native owner logic.
- It can use `minecraft:behavior.follow_owner`.
- Its health and damage can be reduced to soldier-scale values.
- It can use the humanoid/Pillager-style visual prototype.

However, the current follow behavior needs improvement.

## A. Script-driven movement felt artificial

The earlier movement approach made the unit appear as if it were being pulled or dragged toward the player.

This is not acceptable for final gameplay.

The unit must move using Minecraft's own pathfinding and navigation whenever the player is within a reasonable distance.

## B. Banner-gated follow is unnecessarily restrictive

The original concept required the player to hold a Banner in order to command the Soldier to follow.

This creates several issues:

- It occupies a player's hand.
- `minecraft:behavior.follow_owner` does not naturally depend on held Banner state.
- A pure `minecraft:behavior.tempt` solution does not naturally enforce owner-only behavior.
- Combining Banner detection, ownership, and follow state adds complexity without improving the core gameplay.

For Phase 01 Improvement, **Banner is removed from the basic individual Soldier command loop**.

A Banner may later return as a **mass-army command item**, but it is no longer required for an individual Villager Soldier to follow its owner.

---

# 2. New Command Design

The Villager Soldier has exactly two command states:

```text
PATROL
FOLLOW
```

Do not use the vanilla Wolf `sit` state as the Soldier command state.

The Soldier must use a custom command property/state.

---

# 3. High-Level Gameplay Flow

The intended behavior is:

```text
Villager Soldier recruited by Player A
        ↓
Default state = PATROL
        ↓
Soldier remains around its current area
        ↓
Player A right-clicks Soldier
        ↓
State changes to FOLLOW
        ↓
Soldier naturally follows Player A
        ↓
Player A right-clicks Soldier again
        ↓
State changes to PATROL
        ↓
Soldier stops following
        ↓
Current position becomes patrol area
```

This must feel like an RTS unit command, not like a sitting pet.

---

# 4. Unit Identity

The two prototype unit types now intentionally behave differently.

## Mercenary / Wolf Prototype

The Mercenary remains the personal bodyguard-style unit.

After recruitment:

```text
Recruit
→ follow owner automatically
```

It may continue to use Wolf-like personal follow behavior.

## Villager Soldier / Iron Golem Prototype

The Villager Soldier is a village military unit.

After recruitment:

```text
Recruit
→ PATROL by default
```

The player explicitly toggles:

```text
PATROL ↔ FOLLOW
```

This difference is intentional and should be preserved.

---

# 5. Official Documentation References

Codex should use these official Microsoft Creator references when implementing this improvement.

## Follow owner

**minecraft:behavior.follow_owner**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitygoals/minecraftbehavior_follow_owner?view=minecraft-bedrock-stable

## Random patrol movement

**minecraft:behavior.random_stroll**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitygoals/minecraftbehavior_random_stroll?view=minecraft-bedrock-stable

## Move toward movement restriction

**minecraft:behavior.move_towards_restriction**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitygoals/minecraftbehavior_move_towards_restriction?view=minecraft-bedrock-stable

## Home / movement restriction

**minecraft:home**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_home?view=minecraft-bedrock-stable

## Entity interaction

**minecraft:interact**  
https://learn.microsoft.com/en-us/minecraft/creator/reference/content/entityreference/examples/entitycomponents/minecraftcomponent_interact?view=minecraft-bedrock-stable

## Script interaction event

**PlayerInteractWithEntityBeforeEvent**  
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playerinteractwithentitybeforeevent?view=minecraft-bedrock-stable

## Tame / ownership information

**EntityTameableComponent**  
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entitytameablecomponent?view=minecraft-bedrock-stable

## Entity properties

**Introduction to Entity Properties**  
https://learn.microsoft.com/en-us/minecraft/creator/documents/introductiontoentityproperties?view=minecraft-bedrock-stable

---

# 6. Core Technical Decision

Use a persistent entity property for command mode.

Recommended property:

```json
"properties": {
  "warchief:command_mode": {
    "type": "enum",
    "values": [
      "patrol",
      "follow"
    ],
    "default": "patrol",
    "client_sync": false
  }
}
```

This is conceptually preferred over reusing:

```text
minecraft:is_sitting
```

or a vanilla Wolf sitting state.

Reason:

- `sit` semantically means stop.
- Villager Soldier PATROL must still move.
- Command state should be independent from pet behavior.
- Future states can be added later if needed.

Potential future expansion:

```text
patrol
follow
guard
hold
```

But Phase 01 Improvement must implement only:

```text
patrol
follow
```

---

# 7. Component Group Design

Recommended component groups:

```text
warchief:mode_patrol
warchief:mode_follow
```

Only one should be active at a time.

---

# 8. FOLLOW State

## Objective

The Soldier should follow its owner naturally using Minecraft pathfinding.

Do not manually move or teleport the unit continuously.

Use:

```text
minecraft:behavior.follow_owner
```

---

# 9. FOLLOW Behavior Configuration

Recommended starting configuration:

```json
"warchief:mode_follow": {
  "minecraft:behavior.follow_owner": {
    "priority": 5,
    "speed_multiplier": 1.1,
    "start_distance": 5,
    "stop_distance": 2,
    "can_teleport": true,
    "max_distance": 40
  }
}
```

These values are prototype values and may be tuned after in-game testing.

---

# 10. Follow Distance Behavior

The movement should behave like this:

```text
0–2 blocks from owner
→ stop / stay near owner

2–5 blocks
→ no aggressive correction required

5+ blocks
→ normal pathfinding follow begins

very far / pathfinding failure
→ teleport recovery allowed
```

The purpose is to prevent the Soldier from constantly pressing against the player.

The Soldier should not appear magnetically attached to the player's body.

---

# 11. Teleport Is Allowed, But Only as Recovery

Unlike the previous recommendation that disabled teleport entirely, this improvement allows:

```json
"can_teleport": true
```

This is intentional.

Teleport is useful when:

- the player crosses difficult terrain;
- navigation gets stuck;
- the player moves too far away;
- the Soldier becomes trapped behind terrain;
- chunks/pathfinding create a large separation.

The desired experience is:

```text
NEAR OWNER
→ pathfind naturally

FAR AWAY
→ continue pathfinding if possible

VERY FAR / LOST
→ teleport recovery
```

Codex must not implement repeated script teleporting.

The teleport behavior should come from the native `follow_owner` behavior if supported by the current entity implementation.

---

# 12. Natural Follow Requirements

The Soldier should:

- face the direction it is moving;
- walk/run using normal pathfinding;
- go around simple obstacles;
- use normal navigation;
- not slide sideways toward the owner;
- not be repositioned every tick by script;
- not jitter around the player's hitbox.

The Soldier may teleport only when normal following is no longer practical.

---

# 13. PATROL State

## Objective

PATROL replaces the previous concept of `sit`.

PATROL does **not** mean:

```text
stop completely
```

It means:

```text
remain assigned to this area
+
move locally
+
fight nearby enemies
+
do not follow the owner
```

---

# 14. PATROL Behavior

Recommended first implementation:

```json
"warchief:mode_patrol": {
  "minecraft:behavior.random_stroll": {
    "priority": 6,
    "speed_multiplier": 0.8,
    "interval": 40,
    "xz_dist": 8,
    "y_dist": 3
  }
}
```

The actual JSON must be validated against the target Bedrock schema.

---

# 15. Patrol Radius

Target feel:

```text
Soldier assigned here
        ↓
wanders locally
        ↓
approximately 6–10 blocks
        ↓
remains useful as local guard
```

Recommended prototype radius:

```text
8 blocks
```

Test range:

```text
6
8
10
```

Do not use large random movement ranges.

The unit must not wander out of the player's intended defensive position.

---

# 16. Better PATROL: Anchor / Home System

If stable and compatible, improve PATROL using:

```text
minecraft:home
```

plus:

```text
minecraft:behavior.move_towards_restriction
```

The intended concept:

```text
PATROL enabled
        ↓
current location becomes patrol anchor
        ↓
Soldier may wander within patrol radius
        ↓
if too far away
        ↓
return toward anchor
```

Conceptual components:

```json
"minecraft:home": {
  "restriction_radius": 10,
  "restriction_type": "random_movement"
}
```

and:

```json
"minecraft:behavior.move_towards_restriction": {
  "priority": 5,
  "speed_multiplier": 1.0
}
```

plus local stroll:

```json
"minecraft:behavior.random_stroll": {
  "priority": 6,
  "speed_multiplier": 0.8,
  "xz_dist": 8,
  "y_dist": 3
}
```

---

# 17. Important Home-System Prototype Requirement

Do not assume that adding `minecraft:home` automatically records the current position every time PATROL is enabled.

Codex must verify actual Bedrock behavior.

Required test:

```text
1. Recruit Soldier.
2. Move Soldier to Location A.
3. Enable PATROL.
4. Observe patrol center.
5. Switch FOLLOW.
6. Walk to Location B.
7. Enable PATROL.
8. Observe whether patrol center becomes Location B.
```

If the home position correctly updates:

```text
use native home/restriction behavior
```

If it does not:

```text
store patrol anchor via Script API
```

Do not fake the result.

---

# 18. Scripted Patrol Anchor Fallback

If native `minecraft:home` cannot dynamically reset to the Soldier's current position, Script API may store:

```text
warchief:patrol_anchor_x
warchief:patrol_anchor_y
warchief:patrol_anchor_z
```

or equivalent persistent dynamic properties.

Important:

Script must manage **state/anchor**, not perform continuous movement.

Preferred architecture:

```text
Script:
- stores patrol anchor
- toggles mode
- validates owner

Behavior JSON:
- performs movement/pathfinding
```

Avoid:

```text
Script:
- calculates movement every tick
- teleports entity step-by-step
```

---

# 19. Command Interaction

Use owner right-click to toggle command mode.

Desired user experience:

```text
Owner right-clicks Soldier with empty hand
→ PATROL → FOLLOW

Owner right-clicks again
→ FOLLOW → PATROL
```

A command item is not required.

---

# 20. Ownership Validation

Only the recruited owner can change Soldier command mode.

The current Phase 01 implementation already uses tame ownership for the Iron Golem prototype.

Use:

```text
EntityTameableComponent
```

to compare:

```text
tamedToPlayerId
```

with the interacting player's identity.

Conceptual logic:

```ts
if (target is recruited soldier) {
    const tameable = target.getComponent(...);

    if (tameable.tamedToPlayerId !== player.id) {
        deny command;
        return;
    }

    toggleCommandMode(target);
}
```

Exact API field names must be verified against installed `@minecraft/server` typings.

---

# 21. Interaction Priority Problem

The Soldier already supports interactions for:

- Emerald recruitment.
- Sword equipment.

Now right-click is also needed for:

- command toggle.

These interactions must not conflict.

Recommended decision tree:

```text
Player right-clicks Soldier
        ↓

Is Soldier unrecruited?
        ↓ yes
Is player holding Emerald?
        ↓ yes
Recruit
        ↓ END

Otherwise:
Is player owner?
        ↓ no
Ignore / deny
        ↓ END

Is player holding valid Sword?
        ↓ yes
Equip Sword
        ↓ END

Otherwise:
Empty hand / non-equipment hand?
        ↓
Toggle PATROL ↔ FOLLOW
```

This priority must be explicit in code.

---

# 22. Recommended Command Toggle Input

For Phase 01 Improvement:

```text
owner + empty-hand right-click
```

is preferred.

Reason:

- avoids conflict with sword equipment;
- does not consume an item;
- feels similar to interacting with a pet;
- no Banner requirement;
- easy to test.

If Bedrock mobile makes empty-hand interaction unreliable, allow:

```text
owner + sneak + right-click
```

as fallback.

But first test simple owner right-click.

---

# 23. Command Feedback

Give the player clear feedback.

Example messages:

```text
Villager Soldier: FOLLOW
Villager Soldier: PATROL
```

Prefer Action Bar if convenient.

Chat is acceptable for Phase 01.

Do not spam continuously.

Only display when mode changes.

---

# 24. Default State After Recruitment

After Emerald recruitment:

```text
command_mode = patrol
```

not FOLLOW.

Reason:

- Villager Soldier represents a village military unit.
- It should remain in the village unless explicitly commanded.
- It avoids every recruited Soldier immediately chasing the player.
- It gives a clear identity difference from Mercenary/Wolf units.

Flow:

```text
Emerald recruit
→ ownership established
→ PATROL at current location
```

---

# 25. Transition: PATROL → FOLLOW

When owner commands FOLLOW:

1. verify owner;
2. remove patrol component group;
3. add follow component group;
4. update `warchief:command_mode`;
5. preserve combat capability;
6. do not teleport immediately;
7. allow pathfinding to begin naturally.

Teleport should happen only if native `follow_owner` eventually decides it is necessary.

---

# 26. Transition: FOLLOW → PATROL

When owner commands PATROL:

1. verify owner;
2. remove follow component group;
3. save current Soldier location as patrol anchor if required;
4. add patrol component group;
5. update `warchief:command_mode`;
6. Soldier begins local patrol.

The Soldier should stop trying to return to the player.

---

# 27. Component-Group Events

Conceptual events:

```json
"warchief:set_follow": {
  "remove": {
    "component_groups": [
      "warchief:mode_patrol"
    ]
  },
  "add": {
    "component_groups": [
      "warchief:mode_follow"
    ]
  }
},
"warchief:set_patrol": {
  "remove": {
    "component_groups": [
      "warchief:mode_follow"
    ]
  },
  "add": {
    "component_groups": [
      "warchief:mode_patrol"
    ]
  }
}
```

If needed, Script API may call:

```text
triggerEvent("warchief:set_follow")
triggerEvent("warchief:set_patrol")
```

or the current stable equivalent.

Exact API usage must be verified.

---

# 28. Interaction Implementation Strategy

Because command toggle requires ownership checks, Script API is acceptable and recommended here.

Use Script only for:

```text
interaction
owner validation
state toggle
patrol-anchor save
```

Do not use Script API to implement the actual follow movement.

---

# 29. Suggested TypeScript Structure

Recommended file:

```text
src/phase01/soldierCommand.ts
```

Responsibilities:

```text
- detect player interaction with Iron Golem prototype
- ignore recruitment/equipment interactions handled elsewhere
- verify owner
- read command state
- toggle command state
- trigger entity event
- store anchor if switching to patrol
- send feedback
```

Keep movement logic in entity JSON.

---

# 30. Conceptual TypeScript Pattern

This is pseudocode/architecture guidance, not guaranteed copy-paste code.

```ts
function toggleSoldierMode(player, soldier) {
  if (!isOwner(player, soldier)) {
    return;
  }

  const mode = getCommandMode(soldier);

  if (mode === "patrol") {
    setCommandMode(soldier, "follow");
    soldier.triggerEvent("warchief:set_follow");

    player.sendMessage("Villager Soldier: FOLLOW");
    return;
  }

  const pos = soldier.location;

  savePatrolAnchor(soldier, pos);

  setCommandMode(soldier, "patrol");
  soldier.triggerEvent("warchief:set_patrol");

  player.sendMessage("Villager Soldier: PATROL");
}
```

---

# 31. Follow AI Priority

The final priority must be chosen after inspecting the current Iron Golem override.

General intent:

```text
highest:
critical survival/combat reactions

middle:
follow owner

lower:
random patrol movement
```

Example:

```text
combat: priority 2–4
follow_owner: priority 5
move_towards_restriction: priority 5
random_stroll: priority 6+
```

Do not blindly use these values without checking conflicting current goals.

---

# 32. Combat While FOLLOW

When FOLLOW is active:

```text
Soldier follows owner
        ↓
hostile target detected
        ↓
Soldier may temporarily engage
        ↓
combat ends
        ↓
return to owner-follow
```

The Soldier should not permanently forget the owner after combat.

---

# 33. Combat While PATROL

When PATROL is active:

```text
Soldier patrols local area
        ↓
hostile target detected
        ↓
engage nearby target
        ↓
combat ends
        ↓
return to patrol area
```

This is especially important for village defense.

---

# 34. Combat Leash

If possible, patrol-mode combat should not allow the Soldier to chase enemies indefinitely.

Target:

```text
patrol radius ≈ 8–10 blocks
combat leash ≈ 16–24 blocks
```

If vanilla Iron Golem target behavior does not provide a clean leash, document it.

Do not build complicated custom combat pursuit code during this improvement unless necessary.

---

# 35. Follow Teleport Testing

Because `can_teleport` is enabled, explicitly test three ranges.

## Near test

```text
5–15 blocks
```

Expected:

- normal walking/pathfinding;
- no teleport.

## Medium test

```text
20–40 blocks
```

Expected:

- tries natural pathfinding;
- teleport only if necessary based on native behavior.

## Lost / far test

```text
very large distance or difficult obstacle
```

Expected:

- native follow recovery may teleport Soldier near owner.

The exact teleport threshold may be governed internally by Bedrock and current `follow_owner` parameters.

Record actual behavior.

---

# 36. Teleport Visual Quality

A rare teleport is acceptable.

Repeated teleporting is not.

Bad:

```text
player runs
→ unit teleports repeatedly every few seconds
```

Good:

```text
player runs
→ unit follows normally
→ unit becomes badly stuck/far away
→ one recovery teleport
→ normal follow resumes
```

---

# 37. PATROL Testing

Required test:

```text
1. Recruit Soldier.
2. Confirm default PATROL.
3. Walk away.
4. Confirm Soldier does not follow.
5. Observe for 1–2 minutes.
6. Confirm Soldier moves around locally.
7. Confirm Soldier does not wander too far.
8. Spawn hostile mob nearby.
9. Confirm Soldier engages.
10. Confirm Soldier returns to local patrol behavior afterward.
```

---

# 38. FOLLOW Testing

Required test:

```text
1. Recruit Soldier.
2. Right-click with empty hand.
3. Confirm FOLLOW feedback.
4. Walk 10 blocks.
5. Confirm natural pathfinding.
6. Walk around obstacles.
7. Confirm natural navigation.
8. Increase distance.
9. Confirm recovery behavior if Soldier becomes far/stuck.
```

---

# 39. Toggle Testing

Required:

```text
PATROL
→ click
→ FOLLOW
→ click
→ PATROL
→ click
→ FOLLOW
```

Repeat at least 10 times.

Expected:

- no duplicated component groups;
- no broken AI;
- no stuck state;
- no interaction spam;
- no ownership loss.

---

# 40. Equipment Interaction Regression Test

The new empty-hand command interaction must not break weapon equipment.

Test:

```text
Owner holds Iron Sword
→ right-click Soldier
→ weapon updates
→ command mode does NOT toggle
```

Then:

```text
Owner empty hand
→ right-click Soldier
→ command mode toggles
```

---

# 41. Recruitment Regression Test

Test:

```text
Unrecruited Iron Golem
+ Emerald
→ recruits
→ default PATROL
```

Then:

```text
Unrecruited Iron Golem
+ empty hand
→ does not toggle command
```

---

# 42. Multiplayer Ownership Test

Player A recruits Soldier.

Expected:

```text
Player A empty-hand right-click
→ command toggles
```

Player B tries the same.

Expected:

```text
Player B
→ command does not change
```

Optional feedback:

```text
This Soldier belongs to another player.
```

Do not expose internal player IDs in chat.

---

# 43. Save / Reload Test

Set Soldier to:

```text
PATROL
```

save/reload.

Expected:

```text
still PATROL
```

Then:

```text
FOLLOW
```

save/reload.

Expected:

```text
still FOLLOW
```

If the command property itself is persistent but active component groups do not restore correctly, add a spawn/load synchronization strategy.

Document it.

---

# 44. Existing World Safety

This remains a Phase 01 vanilla Iron Golem override.

Therefore:

- all Iron Golems may be affected while Phase 01 prototype is installed;
- this is accepted temporarily;
- Phase 02 should migrate the feature into `warchief:villager_soldier`.

Do not attempt to make this production-safe by overcomplicating Phase 01.

---

# 45. Banner Decision

For this improvement:

```text
Banner is NOT used for individual Soldier FOLLOW/PATROL.
```

Do not delete Banner concepts from broader project design.

Future possible use:

```text
Command Banner
→ mass command all owned Soldiers within radius
```

Example future feature:

```text
Banner + command
→ all nearby PATROL units → FOLLOW
```

That is out of scope for this improvement.

---

# 46. Wolf / Mercenary Changes

Do not redesign Wolf behavior in this improvement unless a regression is caused by shared code.

Wolf/Mercenary remains:

```text
Emerald recruit
→ owner
→ automatically follows owner
→ existing Wolf stay behavior remains available
```

The PATROL/FOLLOW state system in this file is specifically for the Villager Soldier / Iron Golem prototype.

---

# 47. Recommended Phase 01 Improvement File Changes

Likely files:

```text
behavior_pack/entities/iron_golem.json
src/phase01/soldierCommand.ts
src/main.ts
behavior_pack/scripts/main.js
docs/PHASE_01_COMPLETION_REPORT.md
```

Potentially:

```text
docs/PHASE_01_PHONE_INSTALL_AND_TEST.md
```

Update the test guide so it no longer expects Iron Golem to immediately follow after recruitment.

---

# 48. Required Documentation Update

The current test flow that says:

```text
Recruit Iron Golem
→ walk away
→ it should automatically follow
```

must be replaced.

New test flow:

```text
Recruit Iron Golem
→ default PATROL
→ walk away
→ it stays in local patrol area

Owner right-clicks empty hand
→ FOLLOW
→ walk away
→ it follows naturally

Owner right-clicks again
→ PATROL
→ it stops following
→ current area becomes patrol location
```

---

# 49. Acceptance Criteria

Phase 01 Improvement is complete when all of the following are true.

## Recruitment

- [ ] Emerald recruitment still works.
- [ ] Recruiter remains the owner.
- [ ] Newly recruited Villager Soldier starts in PATROL.

## PATROL

- [ ] PATROL is a custom state, not vanilla sitting.
- [ ] Soldier does not follow owner in PATROL.
- [ ] Soldier moves locally instead of freezing.
- [ ] Patrol movement stays within a reasonable local area.
- [ ] Soldier can fight nearby hostiles while patrolling.
- [ ] Soldier returns to local patrol behavior after combat where feasible.

## FOLLOW

- [ ] Owner can toggle PATROL → FOLLOW with right-click.
- [ ] Follow uses native `minecraft:behavior.follow_owner`.
- [ ] Nearby movement looks like normal pathfinding.
- [ ] Soldier does not appear pulled by script.
- [ ] Soldier stops close to owner instead of colliding constantly.
- [ ] Teleport recovery is allowed when Soldier becomes far/stuck.
- [ ] Teleport does not happen repeatedly at normal follow distances.

## Toggle

- [ ] Owner can toggle FOLLOW → PATROL.
- [ ] Current location becomes the new patrol area or closest technically equivalent behavior.
- [ ] Repeated toggles do not break AI state.
- [ ] Non-owner cannot toggle state.

## Interaction

- [ ] Empty-hand owner click toggles command.
- [ ] Sword interaction still equips/changes weapon.
- [ ] Emerald interaction still recruits.
- [ ] Command toggle does not accidentally consume items.
- [ ] Existing weapon state is not lost when toggling.

## Persistence

- [ ] Command mode survives save/reload if technically supported.
- [ ] Owner survives save/reload.
- [ ] Soldier does not revert unpredictably after reload.

## Stability

- [ ] No repeated severe content errors.
- [ ] No per-tick script teleport loop.
- [ ] No per-tick full-world scanning.
- [ ] No repeated debug spam.

---

# 50. Result Report

After implementation, Codex must update or create:

```text
docs/PHASE_01_IMPROVEMENT_RESULT.md
```

Required format:

```markdown
# Phase 01 Improvement Result

## Environment
- Bedrock version:
- @minecraft/server:

## Command State
- Property/state implementation:
- Default state:
- Persistence:

## PATROL
- random_stroll:
- home/restriction:
- patrol radius:
- patrol anchor behavior:
- combat return behavior:

## FOLLOW
- follow_owner configuration:
- start_distance:
- stop_distance:
- speed_multiplier:
- can_teleport:
- max_distance:
- observed teleport behavior:

## Interaction
- toggle input:
- owner validation:
- recruitment conflict:
- sword interaction conflict:

## Multiplayer
- owner-only toggle result:

## Known Limitations

## Content Log Errors

## Recommendation for Phase 02
```

---

# 51. Codex Execution Instructions

Codex must:

1. Read the existing Phase 01 implementation and completion report first.
2. Do not rebuild Phase 01 from scratch.
3. Preserve working Emerald recruitment.
4. Preserve working sword equipment/damage logic.
5. Preserve current humanoid visuals.
6. Remove Banner dependency from individual Iron Golem command behavior.
7. Introduce custom `PATROL` and `FOLLOW` state.
8. Make PATROL the default after recruitment.
9. Use owner right-click with empty hand to toggle state.
10. Verify owner before toggling.
11. Implement FOLLOW using native `minecraft:behavior.follow_owner`.
12. Keep `can_teleport: true`.
13. Tune `start_distance` and `stop_distance` so nearby follow looks natural.
14. Do not use script-driven continuous movement.
15. Implement PATROL using native pathfinding behaviors.
16. Test `minecraft:home` / movement restriction for bounded patrol.
17. If dynamic patrol anchor cannot be handled natively, use Script API only to store the anchor/state.
18. Do not use Script API to manually move the Soldier every tick.
19. Preserve combat in both modes.
20. Test regression for recruitment and sword interaction.
21. Update the phone/manual test guide.
22. Produce `PHASE_01_IMPROVEMENT_RESULT.md`.
23. Stop after this improvement.

---

# 52. Final Target Experience

## Villager Soldier

```text
Emerald recruitment
        ↓
PATROL
        ↓
moves naturally around village/assigned area
        ↓
owner right-click
        ↓
FOLLOW
        ↓
walks naturally behind owner
        ↓
gets very far/stuck
        ↓
native recovery teleport allowed
        ↓
owner right-click
        ↓
PATROL
        ↓
new current area becomes duty area
```

This is the required Phase 01 Improvement behavior.

The goal is not to imitate a sitting Wolf.

The goal is to create a simple, natural military command system with two meaningful states:

```text
PATROL
FOLLOW
```
