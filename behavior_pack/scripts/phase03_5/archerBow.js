export const BOW_WEAPON = "minecraft:bow";
export function isBowWeapon(itemTypeId) {
    return itemTypeId === BOW_WEAPON;
}
export function syncSoldierCombatRole(entity, itemTypeId) {
    if (!entity.isValid || entity.typeId !== "minecraft:iron_golem") {
        return;
    }
    const eventName = isBowWeapon(itemTypeId)
        ? "warchief:set_combat_ranged"
        : "warchief:set_combat_melee";
    try {
        entity.triggerEvent(eventName);
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 03.5 combat role sync failed: entity=${entity.typeId} weapon=${itemTypeId} event=${eventName} error=${String(error)}`);
    }
}
//# sourceMappingURL=archerBow.js.map
