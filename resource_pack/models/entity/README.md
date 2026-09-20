# Entity Models

Put Blockbench Bedrock entity geometry here.

Prototype direction:

- Try using vanilla Pillager/Illager-compatible geometry first.
- If direct vanilla geometry references fail in Bedrock `1.26.40`, add a local fallback geometry here.

Possible local fallback assets:

- `villager_soldier.geo.json`
- `mercenary.geo.json`
- `illager_base.geo.json`

Use one shared Illager/Pillager-compatible skeleton if possible, then differentiate units through textures and later overlays.
