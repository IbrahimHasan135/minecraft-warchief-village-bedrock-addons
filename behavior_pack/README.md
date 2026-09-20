# Behavior Pack

This folder will contain the gameplay side of the Warchief Village Add-On.

Planned content:

- `manifest.json` after the target Bedrock version is selected.
- `entities/` for vanilla replacement behavior such as `minecraft:iron_golem` as Villager Soldier and `minecraft:wolf` as Mercenary.
- `items/` for custom items such as `warchief:military_token` and `warchief:command_banner`.
- `trading/` for villager trade table expansion.
- `loot_tables/` for custom rewards if needed.
- `functions/` for command/function utilities if needed.
- `scripts/` for Script API systems.

Keep behavior files data-driven where possible. Use scripts only for dynamic systems such as ownership, conversion, command banner checks, anchors, and random attacks.
