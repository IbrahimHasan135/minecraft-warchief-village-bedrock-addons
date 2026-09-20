import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, ItemComponentTypes, ItemStack, system, world } from "@minecraft/server";
const VILLAGER_SOLDIER = "minecraft:iron_golem";
const MERCENARY = "minecraft:wolf";
const REPLACED_TYPES = new Set([VILLAGER_SOLDIER, MERCENARY]);
const OWNER_PROPERTY = "warchief:p02_owner_id";
const OWNER_NAME_PROPERTY = "warchief:p02_owner_name";
const WEAPON_ITEM_PROPERTY = "warchief:p02_weapon_item";
const WEAPON_SOURCE_PROPERTY = "warchief:p02_weapon_source";
const COMMAND_MODE_PROPERTY = "warchief:p02_command_mode";
const PATROL_ANCHOR_PROPERTY = "warchief:p02_patrol_anchor";
const DEFAULT_WEAPON = "minecraft:stone_sword";
const DEFAULT_WEAPON_SOURCE = "default";
const PLAYER_EQUIPMENT_SOURCE = "player";
const FOOD_HEAL_AMOUNT = 4;
const damageNormalizationBypass = new Set();
const SWORD_DAMAGE = {
    "minecraft:wooden_sword": 4,
    "minecraft:golden_sword": 4,
    "minecraft:stone_sword": 5,
    "minecraft:iron_sword": 6,
    "minecraft:diamond_sword": 7,
    "minecraft:netherite_sword": 8
};
const ARMOR_SLOTS = [
    {
        equipmentSlot: EquipmentSlot.Head,
        key: "head",
        propertyItem: "warchief:p02_armor_head_item",
        propertySource: "warchief:p02_armor_head_source",
        suffixes: ["_helmet", ":turtle_helmet"]
    },
    {
        equipmentSlot: EquipmentSlot.Chest,
        key: "chest",
        propertyItem: "warchief:p02_armor_chest_item",
        propertySource: "warchief:p02_armor_chest_source",
        suffixes: ["_chestplate"]
    },
    {
        equipmentSlot: EquipmentSlot.Legs,
        key: "legs",
        propertyItem: "warchief:p02_armor_legs_item",
        propertySource: "warchief:p02_armor_legs_source",
        suffixes: ["_leggings"]
    },
    {
        equipmentSlot: EquipmentSlot.Feet,
        key: "feet",
        propertyItem: "warchief:p02_armor_feet_item",
        propertySource: "warchief:p02_armor_feet_source",
        suffixes: ["_boots"]
    }
];
export function registerPhase02ReplacementUnits() {
    world.afterEvents.entitySpawn.subscribe((event) => {
        system.run(() => initializeCustomUnit(event.entity));
    });
    world.afterEvents.entityLoad.subscribe((event) => {
        system.run(() => initializeCustomUnit(event.entity));
    });
    world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
        const target = event.target;
        if (!REPLACED_TYPES.has(target.typeId)) {
            return;
        }
        const item = event.itemStack;
        if (item?.typeId === "minecraft:emerald") {
            event.cancel = true;
            system.run(() => recruitCustomUnit(event.player, target));
            return;
        }
        if (item && item.typeId in SWORD_DAMAGE) {
            event.cancel = true;
            system.run(() => equipWeapon(event.player, target, item.typeId));
            return;
        }
        const armorSlot = item ? getArmorSlot(item.typeId) : undefined;
        if (item && armorSlot) {
            event.cancel = true;
            system.run(() => equipArmor(event.player, target, item.typeId, armorSlot));
            return;
        }
        if (item && isFood(item)) {
            event.cancel = true;
            system.run(() => feedCustomUnit(event.player, target, item.typeId));
            return;
        }
        if (!item && target.typeId === VILLAGER_SOLDIER) {
            event.cancel = true;
            system.run(() => toggleSoldierCommandMode(event.player, target));
            return;
        }
    });
    world.afterEvents.entityHurt.subscribe((event) => {
        const attacker = event.damageSource.damagingEntity;
        if (!attacker || !REPLACED_TYPES.has(attacker.typeId) || !isRecruited(attacker)) {
            return;
        }
        if (damageNormalizationBypass.has(attacker.id)) {
            return;
        }
        const weaponType = getStringProperty(attacker, WEAPON_ITEM_PROPERTY) ?? DEFAULT_WEAPON;
        const desiredDamage = SWORD_DAMAGE[weaponType] ?? SWORD_DAMAGE[DEFAULT_WEAPON];
        if (event.damage === desiredDamage) {
            return;
        }
        if (event.damage > desiredDamage) {
            refundExcessDamage(event.hurtEntity, event.damage - desiredDamage);
            return;
        }
        try {
            damageNormalizationBypass.add(attacker.id);
            event.hurtEntity.applyDamage(desiredDamage - event.damage, {
                cause: EntityDamageCause.entityAttack,
                damagingEntity: attacker
            });
            system.runTimeout(() => damageNormalizationBypass.delete(attacker.id), 1);
        }
        catch (error) {
            console.warn(`[Warchief Village] Phase 02 damage apply failed: ${String(error)}`);
            damageNormalizationBypass.delete(attacker.id);
        }
    });
    world.afterEvents.entityDie.subscribe((event) => {
        const deadEntity = event.deadEntity;
        if (!REPLACED_TYPES.has(deadEntity.typeId)) {
            return;
        }
        dropPlayerProvidedEquipment(deadEntity);
    });
    system.run(() => {
        console.warn("[Warchief Village] Phase 02 replacement unit systems loaded.");
    });
}
function initializeCustomUnit(entity) {
    if (!entity.isValid || !REPLACED_TYPES.has(entity.typeId)) {
        return;
    }
    const weapon = getStringProperty(entity, WEAPON_ITEM_PROPERTY) ?? DEFAULT_WEAPON;
    const weaponSource = getEquipmentSource(entity, WEAPON_SOURCE_PROPERTY, DEFAULT_WEAPON_SOURCE);
    entity.setDynamicProperty(WEAPON_ITEM_PROPERTY, weapon);
    entity.setDynamicProperty(WEAPON_SOURCE_PROPERTY, weaponSource);
    if (entity.typeId === VILLAGER_SOLDIER && !getStringProperty(entity, COMMAND_MODE_PROPERTY)) {
        setSoldierCommandMode(entity, "patrol");
        savePatrolAnchor(entity);
    }
    equipVisual(entity, EquipmentSlot.Mainhand, weapon);
    for (const armorSlot of ARMOR_SLOTS) {
        const armorItem = getStringProperty(entity, armorSlot.propertyItem);
        if (armorItem) {
            equipVisual(entity, armorSlot.equipmentSlot, armorItem);
        }
    }
}
function recruitCustomUnit(player, target) {
    if (!target.isValid || !player.isValid) {
        return;
    }
    if (isRecruited(target)) {
        notify(player, `${getUnitLabel(target)} ini sudah direkrut.`);
        return;
    }
    if (!consumeSelectedItem(player, "minecraft:emerald")) {
        notify(player, "Pegang 1 Emerald untuk merekrut unit.");
        return;
    }
    target.setDynamicProperty(OWNER_PROPERTY, player.id);
    target.setDynamicProperty(OWNER_NAME_PROPERTY, player.name);
    target.nameTag = getUnitLabel(target);
    const tameable = target.getComponent(EntityComponentTypes.Tameable);
    try {
        tameable?.tame(player);
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 02 tame failed for ${target.typeId}: ${String(error)}`);
    }
    initializeCustomUnit(target);
    if (target.typeId === VILLAGER_SOLDIER) {
        setSoldierCommandMode(target, "patrol");
        savePatrolAnchor(target);
        triggerEntityEvent(target, "warchief:set_patrol");
        notify(player, "Villager Soldier direkrut. Mode: PATROL.");
        return;
    }
    notify(player, "Mercenary direkrut. Mode: FOLLOW.");
}
function equipWeapon(player, target, itemTypeId) {
    if (!isOwnedBy(target, player)) {
        notify(player, `Rekrut ${getUnitLabel(target)} dengan 1 Emerald dulu sebelum memberi equipment.`);
        return;
    }
    if (!consumeSelectedItem(player, itemTypeId)) {
        notify(player, "Pegang sword yang ingin diberikan.");
        return;
    }
    const previousWeapon = getStringProperty(target, WEAPON_ITEM_PROPERTY);
    const previousSource = getEquipmentSource(target, WEAPON_SOURCE_PROPERTY, DEFAULT_WEAPON_SOURCE);
    if (previousWeapon && previousSource === PLAYER_EQUIPMENT_SOURCE) {
        spawnSingleItem(target, previousWeapon);
    }
    target.setDynamicProperty(WEAPON_ITEM_PROPERTY, itemTypeId);
    target.setDynamicProperty(WEAPON_SOURCE_PROPERTY, PLAYER_EQUIPMENT_SOURCE);
    equipVisual(target, EquipmentSlot.Mainhand, itemTypeId);
    notify(player, `${getUnitLabel(target)} menerima ${toReadableItemName(itemTypeId)}.`);
}
function equipArmor(player, target, itemTypeId, armorSlot) {
    if (!isOwnedBy(target, player)) {
        notify(player, `Rekrut ${getUnitLabel(target)} dengan 1 Emerald dulu sebelum memberi armor.`);
        return;
    }
    if (!consumeSelectedItem(player, itemTypeId)) {
        notify(player, "Pegang armor yang ingin diberikan.");
        return;
    }
    const previousArmor = getStringProperty(target, armorSlot.propertyItem);
    const previousSource = getEquipmentSource(target, armorSlot.propertySource, "none");
    if (previousArmor && previousSource === PLAYER_EQUIPMENT_SOURCE) {
        spawnSingleItem(target, previousArmor);
    }
    target.setDynamicProperty(armorSlot.propertyItem, itemTypeId);
    target.setDynamicProperty(armorSlot.propertySource, PLAYER_EQUIPMENT_SOURCE);
    equipVisual(target, armorSlot.equipmentSlot, itemTypeId);
    notify(player, `${getUnitLabel(target)} menerima ${toReadableItemName(itemTypeId)}.`);
}
function feedCustomUnit(player, target, itemTypeId) {
    const health = target.getComponent(EntityComponentTypes.Health);
    if (!health) {
        return;
    }
    if (health.currentValue >= health.effectiveMax) {
        notify(player, `${getUnitLabel(target)} sudah full health.`);
        return;
    }
    if (!consumeSelectedItem(player, itemTypeId)) {
        return;
    }
    try {
        health.setCurrentValue(Math.min(health.effectiveMax, health.currentValue + FOOD_HEAL_AMOUNT));
        notify(player, `${getUnitLabel(target)} heal +${FOOD_HEAL_AMOUNT} HP.`);
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 02 food healing failed: ${String(error)}`);
    }
}
function toggleSoldierCommandMode(player, target) {
    if (!target.isValid || !player.isValid || target.typeId !== VILLAGER_SOLDIER) {
        return;
    }
    if (!isRecruited(target)) {
        notify(player, "Rekrut Villager Soldier dengan 1 Emerald dulu.");
        return;
    }
    if (!isOwnedBy(target, player)) {
        notify(player, "Villager Soldier ini milik player lain.");
        return;
    }
    const nextMode = getSoldierCommandMode(target) === "follow" ? "patrol" : "follow";
    setSoldierCommandMode(target, nextMode);
    if (nextMode === "follow") {
        triggerEntityEvent(target, "warchief:set_follow");
        notify(player, "Villager Soldier: FOLLOW.");
        return;
    }
    savePatrolAnchor(target);
    triggerEntityEvent(target, "warchief:set_patrol");
    notify(player, "Villager Soldier: PATROL.");
}
function dropPlayerProvidedEquipment(entity) {
    const weapon = getStringProperty(entity, WEAPON_ITEM_PROPERTY);
    const weaponSource = getEquipmentSource(entity, WEAPON_SOURCE_PROPERTY, DEFAULT_WEAPON_SOURCE);
    if (weapon && weaponSource === PLAYER_EQUIPMENT_SOURCE) {
        spawnSingleItem(entity, weapon);
    }
    for (const armorSlot of ARMOR_SLOTS) {
        const armor = getStringProperty(entity, armorSlot.propertyItem);
        const source = getEquipmentSource(entity, armorSlot.propertySource, "none");
        if (armor && source === PLAYER_EQUIPMENT_SOURCE) {
            spawnSingleItem(entity, armor);
        }
    }
}
function equipVisual(entity, slot, itemTypeId) {
    const equippable = entity.getComponent(EntityComponentTypes.Equippable);
    if (!equippable) {
        return false;
    }
    try {
        return equippable.setEquipment(slot, new ItemStack(itemTypeId, 1));
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 02 visual equip failed for ${entity.typeId}: ${String(error)}`);
        return false;
    }
}
function spawnSingleItem(entity, itemTypeId) {
    try {
        entity.dimension.spawnItem(new ItemStack(itemTypeId, 1), entity.location);
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 02 drop failed for ${itemTypeId}: ${String(error)}`);
    }
}
function isFood(item) {
    try {
        return Boolean(item.getComponent(ItemComponentTypes.Food));
    }
    catch {
        return false;
    }
}
function getArmorSlot(itemTypeId) {
    return ARMOR_SLOTS.find((slot) => slot.suffixes.some((suffix) => itemTypeId.endsWith(suffix)));
}
function consumeSelectedItem(player, expectedTypeId) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    const container = inventory?.container;
    if (!container) {
        return false;
    }
    const selectedSlot = player.selectedSlotIndex;
    const item = container.getItem(selectedSlot);
    if (!item || item.typeId !== expectedTypeId) {
        return false;
    }
    if (item.amount <= 1) {
        container.setItem(selectedSlot, undefined);
        return true;
    }
    const updated = item.clone();
    updated.amount = item.amount - 1;
    container.setItem(selectedSlot, updated);
    return true;
}
function refundExcessDamage(entity, amount) {
    if (amount <= 0 || !entity.isValid) {
        return;
    }
    const health = entity.getComponent(EntityComponentTypes.Health);
    if (!health) {
        return;
    }
    try {
        health.setCurrentValue(Math.min(health.effectiveMax, health.currentValue + amount));
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 02 damage refund failed: ${String(error)}`);
    }
}
function isRecruited(entity) {
    return typeof entity.getDynamicProperty(OWNER_PROPERTY) === "string";
}
function isOwnedBy(entity, player) {
    const tameable = entity.getComponent(EntityComponentTypes.Tameable);
    if (tameable?.tamedToPlayerId) {
        return tameable.tamedToPlayerId === player.id;
    }
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
        console.warn(`[Warchief Village] Phase 02 event ${eventName} failed: ${String(error)}`);
    }
}
function getStringProperty(entity, propertyName) {
    const value = entity.getDynamicProperty(propertyName);
    return typeof value === "string" ? value : undefined;
}
function getEquipmentSource(entity, propertyName, fallback) {
    const value = getStringProperty(entity, propertyName);
    if (value === "none" || value === DEFAULT_WEAPON_SOURCE || value === PLAYER_EQUIPMENT_SOURCE) {
        return value;
    }
    return fallback;
}
function getUnitLabel(entity) {
    return entity.typeId === MERCENARY ? "Mercenary" : "Villager Soldier";
}
function toReadableItemName(itemTypeId) {
    return itemTypeId
        .replace("minecraft:", "")
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
function notify(player, message) {
    try {
        player.sendMessage(`[Warchief] ${message}`);
    }
    catch {
        console.warn(`[Warchief Village] ${message}`);
    }
}
//# sourceMappingURL=replacementUnits.js.map