import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const jsonRoots = ["behavior_pack", "resource_pack"];

function collectJsonFiles(root) {
  const files = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectJsonFiles(path));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(path);
    }
  }

  return files;
}

const jsonFiles = jsonRoots.flatMap(collectJsonFiles).sort();

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const parsed = Object.fromEntries(jsonFiles.map((path) => [path, readJson(path)]));
const bp = parsed["behavior_pack/manifest.json"];
const rp = parsed["resource_pack/manifest.json"];

const uuids = [
  bp.header.uuid,
  ...bp.modules.map((module) => module.uuid),
  rp.header.uuid,
  ...rp.modules.map((module) => module.uuid)
];

if (new Set(uuids).size !== uuids.length) {
  throw new Error("Manifest UUIDs must be unique across BP/RP headers and modules.");
}

const rpDependency = bp.dependencies.find((dependency) => dependency.uuid === rp.header.uuid);

if (!rpDependency) {
  throw new Error("Behavior Pack must depend on the Resource Pack header UUID.");
}

const serverDependency = bp.dependencies.find(
  (dependency) => dependency.module_name === "@minecraft/server"
);

if (serverDependency?.version !== "2.9.0") {
  throw new Error("Behavior Pack must use stable @minecraft/server version 2.9.0.");
}

const phase04ATradeFiles = jsonFiles.filter((path) =>
  path.startsWith("behavior_pack/trading/economy_trades/")
);

if (phase04ATradeFiles.length !== 28) {
  throw new Error(`Phase 04A trade tables: expected 28 variant files, found ${phase04ATradeFiles.length}.`);
}

for (const path of phase04ATradeFiles) {
  const table = parsed[path];

  if (!Array.isArray(table.tiers) || table.tiers.length !== 5) {
    throw new Error(`Phase 04A trade table must contain 5 tiers: ${path}`);
  }

  const expectedExp = [0, 10, 70, 150, 250];

  for (let index = 0; index < 3; index += 1) {
    if (table.tiers[index]?.total_exp_required !== expectedExp[index]) {
      throw new Error(
        `Phase 04A tier ${index + 1} has invalid total_exp_required in ${path}.`
      );
    }

    const trades = table.tiers[index]?.groups?.flatMap((group) => group.trades ?? []) ?? [];

    if (trades.length === 0) {
      throw new Error(`Phase 04A tier ${index + 1} has no trades in ${path}.`);
    }

    for (const trade of trades) {
      if (!Array.isArray(trade.wants) || trade.wants.length === 0) {
        throw new Error(`Phase 04A trade has no wants array in ${path}.`);
      }

      if (!Array.isArray(trade.gives) || trade.gives.length === 0) {
        throw new Error(`Phase 04A trade has no gives array in ${path}.`);
      }
    }
  }
}

const villagerV2 = parsed["behavior_pack/entities/villager_v2.json"];
const phase04ACatalogGroups = Object.keys(villagerV2?.["minecraft:entity"]?.component_groups ?? {})
  .filter((name) => name.startsWith("warchief:") && name.endsWith("_catalog"));

if (phase04ACatalogGroups.length !== 28) {
  throw new Error(
    `Phase 04A villager_v2 override: expected 28 catalog component groups, found ${phase04ACatalogGroups.length}.`
  );
}

for (const professionGroup of [
  "farmer",
  "fletcher",
  "mason",
  "toolsmith",
  "weaponsmith",
  "armorer",
  "librarian"
]) {
  const group = villagerV2?.["minecraft:entity"]?.component_groups?.[professionGroup];

  if (group?.["minecraft:economy_trade_table"]) {
    throw new Error(
      `Phase 04A base profession must not own economy trade table: ${professionGroup}.`
    );
  }
}

console.log(
  `Validation passed for ${jsonFiles.length} JSON files, including 28 Phase 04A trade variants.`
);
