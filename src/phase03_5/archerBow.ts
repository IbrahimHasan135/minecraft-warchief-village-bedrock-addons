import { Entity } from "@minecraft/server";

export const BOW_WEAPON = "minecraft:bow";

export function isBowWeapon(itemTypeId: string): boolean {
  return itemTypeId === BOW_WEAPON;
}

export function syncUnitCombatRole(entity: Entity, itemTypeId: string): void {
  if (!entity.isValid || !["minecraft:iron_golem", "minecraft:wolf"].includes(entity.typeId)) {
    return;
  }

  const eventName = isBowWeapon(itemTypeId)
    ? "warchief:set_combat_ranged"
    : "warchief:set_combat_melee";

  try {
    entity.triggerEvent(eventName);
  } catch (error) {
    console.warn(
      `[Warchief Village] Phase 03.5 combat role sync failed: entity=${entity.typeId} weapon=${itemTypeId} event=${eventName} error=${String(error)}`
    );
  }
}
