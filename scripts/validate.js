import { readFileSync } from "node:fs";

const jsonFiles = [
  "behavior_pack/manifest.json",
  "resource_pack/manifest.json",
  "behavior_pack/texts/languages.json",
  "resource_pack/texts/languages.json"
];

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

console.log("Phase 00 validation passed.");
