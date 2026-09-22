import { EntityComponentTypes, ItemStack, system, world } from "@minecraft/server";
const VILLAGER_TYPES = new Set(["minecraft:villager", "minecraft:villager_v2"]);
const VILLAGER_SOLDIER = "minecraft:iron_golem";
const CONSCRIPTION_WRIT = "warchief:military_token";
const OWNER_PROPERTY = "warchief:p02_owner_id";
const COMMAND_MODE_PROPERTY = "warchief:p02_command_mode";
const PATROL_ANCHOR_PROPERTY = "warchief:p02_patrol_anchor";
const BANNER_COMMAND_PROPERTY = "warchief:p03_banner_commanded";
const BANNER_COMMAND_RADIUS = 48;
const BANNER_COMMAND_INTERVAL_TICKS = 10;
const bannerActivePlayers = new Set();
const bannerStateInitializedPlayers = new Set();
export function registerPhase03ConscriptionCommandLoop() {
    world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
        const item = event.itemStack;
        if (item?.typeId !== CONSCRIPTION_WRIT || !isVillagerType(event.target.typeId)) {
            return;
        }
        event.cancel = true;
        const sourceSlotIndex = event.player.selectedSlotIndex;
        system.run(() => conscriptVillager(event.player, event.target, sourceSlotIndex));
    });
    system.runInterval(updateBannerCommands, BANNER_COMMAND_INTERVAL_TICKS);
    world.afterEvents.playerLeave.subscribe((event) => {
        bannerActivePlayers.delete(event.playerId);
        bannerStateInitializedPlayers.delete(event.playerId);
    });
    system.run(() => {
        console.warn("[Warchief Village] Phase 03 conscription and banner command loop loaded.");
    });
}
function conscriptVillager(player, villager, sourceSlotIndex) {
    if (!player.isValid || !villager.isValid) {
        return;
    }
    if (!isVillagerType(villager.typeId)) {
        notify(player, "Conscription Writ hanya bisa dipakai ke adult Villager.");
        return;
    }
    if (isBaby(villager)) {
        notify(player, "Villager bayi belum bisa dijadikan Villager Soldier.");
        return;
    }
    if (!slotHasItem(player, CONSCRIPTION_WRIT, sourceSlotIndex)) {
        notify(player, "Pegang Conscription Writ untuk conscript Villager.");
        return;
    }
    let soldier;
    try {
        soldier = villager.dimension.spawnEntity(VILLAGER_SOLDIER, villager.location);
        soldier.setRotation(villager.getRotation());
        if (villager.nameTag) {
            soldier.nameTag = villager.nameTag;
        }
    }
    catch (error) {
        notify(player, "Gagal spawn Villager Soldier dari Conscription Writ.");
        console.warn(`[Warchief Village] Phase 03 conscription spawn failed: ${String(error)}`);
        return;
    }
    if (!consumeItemFromSlot(player, CONSCRIPTION_WRIT, sourceSlotIndex)) {
        safeRemove(soldier);
        notify(player, "Conscription Writ tidak dikonsumsi; conversion dibatalkan.");
        return;
    }
    try {
        villager.remove();
    }
    catch (error) {
        safeRemove(soldier);
        restoreItemToSlot(player, CONSCRIPTION_WRIT, sourceSlotIndex);
        notify(player, "Conversion dibatalkan karena Villager gagal dihapus; Conscription Writ dikembalikan.");
        console.warn(`[Warchief Village] Phase 03 villager remove failed: ${String(error)}`);
        return;
    }
    notify(player, "Villager menjadi Villager Soldier. Beri 1 Emerald untuk merekrut.");
}
function updateBannerCommands() {
    for (const player of world.getAllPlayers()) {
        if (!player.isValid) {
            continue;
        }
        const isHoldingBanner = isHoldingVanillaBanner(player);
        if (isHoldingBanner) {
            bannerStateInitializedPlayers.add(player.id);
            bannerActivePlayers.add(player.id);
            commandOwnedSoldiersToFollow(player);
            continue;
        }
        const needsInitialCleanup = !bannerStateInitializedPlayers.has(player.id);
        const wasBannerActive = bannerActivePlayers.delete(player.id);
        bannerStateInitializedPlayers.add(player.id);
        if (needsInitialCleanup || wasBannerActive) {
            releaseBannerCommandedSoldiers(player);
        }
    }
}
function commandOwnedSoldiersToFollow(player) {
    for (const soldier of getNearbyOwnedSoldiers(player)) {
        if (!isValidOwnedSoldier(soldier, player)) {
            continue;
        }
        const currentMode = getSoldierCommandMode(soldier);
        if (currentMode !== "follow") {
            setSoldierCommandMode(soldier, "follow");
            triggerEntityEvent(soldier, "warchief:set_follow");
        }
        soldier.setDynamicProperty(BANNER_COMMAND_PROPERTY, true);
    }
}
function releaseBannerCommandedSoldiers(player) {
    for (const soldier of getOwnedSoldiersInCurrentDimension(player)) {
        if (!isValidOwnedSoldier(soldier, player)) {
            continue;
        }
        if (soldier.getDynamicProperty(BANNER_COMMAND_PROPERTY) !== true) {
            continue;
        }
        setSoldierCommandMode(soldier, "patrol");
        savePatrolAnchor(soldier);
        soldier.setDynamicProperty(BANNER_COMMAND_PROPERTY, undefined);
        triggerEntityEvent(soldier, "warchief:set_patrol");
    }
}
function getNearbyOwnedSoldiers(player) {
    try {
        return player.dimension.getEntities({
            location: player.location,
            maxDistance: BANNER_COMMAND_RADIUS,
            type: VILLAGER_SOLDIER
        });
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 03 soldier query failed: ${String(error)}`);
        return [];
    }
}
function getOwnedSoldiersInCurrentDimension(player) {
    try {
        return player.dimension.getEntities({
            type: VILLAGER_SOLDIER
        });
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 03 release query failed: ${String(error)}`);
        return [];
    }
}
function isValidOwnedSoldier(soldier, player) {
    return soldier.isValid && soldier.typeId === VILLAGER_SOLDIER && isOwnedBy(soldier, player);
}
function isHoldingVanillaBanner(player) {
    const selected = getSelectedItem(player);
    if (!selected) {
        return false;
    }
    return selected.typeId === "minecraft:banner" || selected.typeId.endsWith("_banner");
}
function getSelectedItem(player) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    return inventory?.container?.getItem(player.selectedSlotIndex);
}
function isVillagerType(typeId) {
    return VILLAGER_TYPES.has(typeId);
}
function isBaby(entity) {
    try {
        return Boolean(entity.getComponent(EntityComponentTypes.IsBaby));
    }
    catch {
        return false;
    }
}
function slotHasItem(player, expectedTypeId, slotIndex) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    const item = inventory?.container?.getItem(slotIndex);
    return item?.typeId === expectedTypeId;
}
function consumeItemFromSlot(player, expectedTypeId, slotIndex) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    const container = inventory?.container;
    if (!container) {
        return false;
    }
    const item = container.getItem(slotIndex);
    if (!item || item.typeId !== expectedTypeId) {
        return false;
    }
    if (item.amount <= 1) {
        container.setItem(slotIndex, undefined);
        return true;
    }
    const updated = item.clone();
    updated.amount = item.amount - 1;
    container.setItem(slotIndex, updated);
    return true;
}
function restoreItemToSlot(player, itemTypeId, slotIndex) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    const container = inventory?.container;
    if (!container) {
        return;
    }
    const current = container.getItem(slotIndex);
    if (!current) {
        container.setItem(slotIndex, new ItemStack(itemTypeId, 1));
        return;
    }
    if (current.typeId === itemTypeId && current.amount < current.maxAmount) {
        const updated = current.clone();
        updated.amount += 1;
        container.setItem(slotIndex, updated);
        return;
    }
    try {
        player.dimension.spawnItem(new ItemStack(itemTypeId, 1), player.location);
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 03 Conscription Writ refund failed: ${String(error)}`);
    }
}
function isOwnedBy(entity, player) {
    return entity.getDynamicProperty(OWNER_PROPERTY) === player.id;
}
function getSoldierCommandMode(entity) {
    return entity.getDynamicProperty(COMMAND_MODE_PROPERTY) === "follow" ? "follow" : "patrol";
}
function setSoldierCommandMode(entity, mode) {
    entity.setDynamicProperty(COMMAND_MODE_PROPERTY, mode);
}
function savePatrolAnchor(entity) {
    entity.setDynamicProperty(PATROL_ANCHOR_PROPERTY, entity.location);
}
function triggerEntityEvent(entity, eventName) {
    try {
        entity.triggerEvent(eventName);
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 03 event ${eventName} failed: ${String(error)}`);
    }
}
function safeRemove(entity) {
    try {
        entity.remove();
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 03 cleanup remove failed: ${String(error)}`);
    }
}
function notify(player, message) {
    try {
        player.sendMessage(`[Warchief] ${message}`);
    }
    catch {
        console.warn(`[Warchief Village] ${message}`);
    }
}
//# sourceMappingURL=conscriptionCommandLoop.js.map