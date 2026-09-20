# Phase 01 Phone Install and Test Guide

## Build the Add-On File

Run from the repository root:

```bash
npm run build
npm run validate
python3 tools/package_mcaddon.py
```

The generated file is:

```text
dist/Warchief_Village_Phase_01.mcaddon
```

The `.mcaddon` file is a ZIP archive containing:

```text
Warchief_Village_BP/
Warchief_Village_RP/
```

## Install on Minecraft Bedrock Mobile

1. Send `dist/Warchief_Village_Phase_01.mcaddon` to the phone.
2. Tap/open the `.mcaddon` file.
3. Choose Minecraft if Android/iOS asks which app should open it.
4. Wait until Minecraft says the import completed.
5. Create a clean test world.
6. Enable both packs:
   - Behavior Pack: `Warchief Village BP`
   - Resource Pack: `Warchief Village RP`
7. Enable cheats if you want to use spawn eggs/commands for faster testing.

## Phase 01 Checkpoints

### Pack Import

- [ ] Minecraft imports the `.mcaddon` without errors.
- [ ] Behavior Pack appears in world settings.
- [ ] Resource Pack appears in world settings.
- [ ] World loads without content-log errors that stop the pack.

### Wolf / Mercenary Prototype

- [ ] Spawn a Wolf.
- [ ] Wolf appears with the temporary Pillager-style humanoid visual.
- [ ] Hold Emerald in the selected hotbar slot.
- [ ] Right-click/use the Wolf.
- [ ] One Emerald is consumed.
- [ ] Chat confirms recruitment.
- [ ] Wolf follows the recruiting player.
- [ ] Wolf ambient/hurt/death sounds are Villager-style.
- [ ] Right-click/use the recruited Wolf with a sword.
- [ ] One sword is consumed.
- [ ] Chat confirms sword tier.
- [ ] Wolf melee damage matches the prototype tier instead of stacking uncontrolled bonus damage.

### Iron Golem / Villager Soldier Prototype

- [ ] Spawn an Iron Golem.
- [ ] Iron Golem appears with the temporary Pillager-style humanoid visual.
- [ ] Hold Emerald in the selected hotbar slot.
- [ ] Right-click/use the Iron Golem.
- [ ] One Emerald is consumed.
- [ ] Chat confirms recruitment.
- [ ] Right-click/use the recruited Iron Golem with a sword.
- [ ] One sword is consumed.
- [ ] Chat confirms sword tier.
- [ ] Iron Golem base combat feels Pillager-scale, not vanilla Golem-scale.
- [ ] Iron Golem walks faster than vanilla Golem and closer to Wolf/Pillager pace.
- [ ] Hold any vanilla Banner, including White Banner.
- [ ] Move more than roughly 6 blocks away.
- [ ] Recruited Iron Golem moves near the recruiting player.
- [ ] Stop holding Banner.
- [ ] Command-follow stops updating.

## Expected Prototype Limitations

- Iron Golem follow is a Phase 01 teleport-follow prototype, not final pathfinding.
- Held sword visual depends on whether the vanilla entity exposes a mainhand equipment slot at runtime.
- Wolf sitting behavior may still exist, but the temporary humanoid model does not have a polished sit animation.
