import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, ItemComponentTypes, ItemStack, system, world } from "@minecraft/server";
import { BOW_WEAPON, isBowWeapon, syncSoldierCombatRole } from "../phase03_5/archerBow";
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
const EQUIPMENT_DEBUG_LOGGED_PROPERTY = "warchief:p02_equipment_debug_logged";
const damageNormalizationBypass = new Set();
const SWORD_DAMAGE = {
    "minecraft:wooden_sword": 4,
    "minecraft:golden_sword": 4,
    "minecraft:stone_sword": 5,
    "minecraft:iron_sword": 6,
    "minecraft:diamond_sword": 7,
    "minecraft:netherite_sword": 8
};
const ARMOR_POINTS = {
    "minecraft:leather_helmet": 1,
    "minecraft:leather_chestplate": 3,
    "minecraft:leather_leggings": 2,
    "minecraft:leather_boots": 1,
    "minecraft:chainmail_helmet": 2,
    "minecraft:chainmail_chestplate": 5,
    "minecraft:chainmail_leggings": 4,
    "minecraft:chainmail_boots": 1,
    "minecraft:iron_helmet": 2,
    "minecraft:iron_chestplate": 6,
    "minecraft:iron_leggings": 5,
    "minecraft:iron_boots": 2,
    "minecraft:golden_helmet": 2,
    "minecraft:golden_chestplate": 5,
    "minecraft:golden_leggings": 3,
    "minecraft:golden_boots": 1,
    "minecraft:diamond_helmet": 3,
    "minecraft:diamond_chestplate": 8,
    "minecraft:diamond_leggings": 6,
    "minecraft:diamond_boots": 3,
    "minecraft:netherite_helmet": 3,
    "minecraft:netherite_chestplate": 8,
    "minecraft:netherite_leggings": 6,
    "minecraft:netherite_boots": 3,
    "minecraft:turtle_helmet": 2
};
const ARMOR_SLOTS = [
    {
        equipmentSlot: EquipmentSlot.Chest,
        key: "chest",
        propertyItem: "warchief:p02_armor_chest_item",
        propertySource: "warchief:p02_armor_chest_source",
        suffixes: ["_chestplate"]
    }
];
const DEFAULT_ARMOR = {
    chest: "minecraft:leather_chestplate"
};
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
        if (item && isValidWeaponForUnit(target, item.typeId)) {
            event.cancel = true;
            const sourceSlotIndex = event.player.selectedSlotIndex;
            system.run(() => equipWeapon(event.player, target, item.typeId, sourceSlotIndex));
            return;
        }
        const armorSlot = item ? getArmorSlot(item.typeId) : undefined;
        if (item && armorSlot) {
            event.cancel = true;
            if (target.typeId === VILLAGER_SOLDIER) {
                system.run(() => notify(event.player, "Villager Soldier memakai Iron Chestplate permanen; armor tidak dapat diganti."));
                return;
            }
            const sourceSlotIndex = event.player.selectedSlotIndex;
            system.run(() => equipArmor(event.player, target, item.typeId, armorSlot, sourceSlotIndex));
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
        const hurtEntity = event.hurtEntity;
        if (REPLACED_TYPES.has(hurtEntity.typeId)) {
            applyArmorProtection(hurtEntity, event.damage);
        }
        if (!attacker || !REPLACED_TYPES.has(attacker.typeId) || !isRecruited(attacker)) {
            return;
        }
        const weaponType = getStringProperty(attacker, WEAPON_ITEM_PROPERTY) ?? DEFAULT_WEAPON;
        if (attacker.typeId === VILLAGER_SOLDIER && isBowWeapon(weaponType)) {
            return;
        }
        if (attacker.typeId === VILLAGER_SOLDIER) {
            suppressSoldierLaunch(hurtEntity);
        }
        if (damageNormalizationBypass.has(attacker.id)) {
            return;
        }
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
function applyArmorProtection(entity, damage) {
    if (damage <= 0) {
        return;
    }
    const armorPoints = getEquippedArmorPoints(entity);
    if (armorPoints <= 0) {
        return;
    }
    const reduction = Math.min(0.8, armorPoints * 0.04);
    refundExcessDamage(entity, damage * reduction);
}
function getEquippedArmorPoints(entity) {
    return ARMOR_SLOTS.reduce((total, armorSlot) => {
        const armorItem = getStringProperty(entity, armorSlot.propertyItem);
        return total + (armorItem ? ARMOR_POINTS[armorItem] ?? 0 : 0);
    }, 0);
}
function suppressSoldierLaunch(entity) {
    system.runTimeout(() => {
        if (!entity.isValid) {
            return;
        }
        try {
            entity.clearVelocity();
        }
        catch (error) {
            console.warn(`[Warchief Village] Phase 02 knockback suppress failed: ${String(error)}`);
        }
    }, 1);
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
    ensureEquipment(entity, EquipmentSlot.Mainhand, weapon, weaponSource);
    syncSoldierWeaponVisual(entity, weapon);
    if (entity.typeId === VILLAGER_SOLDIER) {
        syncSoldierCombatRole(entity, weapon);
    }
    for (const armorSlot of ARMOR_SLOTS) {
        if (entity.typeId === VILLAGER_SOLDIER) {
            const soldierArmor = "minecraft:iron_chestplate";
            entity.setDynamicProperty(armorSlot.propertyItem, soldierArmor);
            entity.setDynamicProperty(armorSlot.propertySource, DEFAULT_WEAPON_SOURCE);
            ensureEquipment(entity, armorSlot.equipmentSlot, soldierArmor, DEFAULT_WEAPON_SOURCE);
            continue;
        }
        const armorSource = getEquipmentSource(entity, armorSlot.propertySource, DEFAULT_WEAPON_SOURCE);
        const armorItem = getStringProperty(entity, armorSlot.propertyItem) ?? DEFAULT_ARMOR[armorSlot.key];
        entity.setDynamicProperty(armorSlot.propertyItem, armorItem);
        entity.setDynamicProperty(armorSlot.propertySource, armorSource);
        ensureEquipment(entity, armorSlot.equipmentSlot, armorItem, armorSource);
    }
    logEquipmentSlotsOnce(entity);
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
function equipWeapon(player, target, itemTypeId, sourceSlotIndex) {
    replaceUnitEquipment(player, target, itemTypeId, {
        slot: EquipmentSlot.Mainhand,
        savedItemProperty: WEAPON_ITEM_PROPERTY,
        sourceProperty: WEAPON_SOURCE_PROPERTY,
        label: "Mainhand"
    }, sourceSlotIndex);
}
function equipArmor(player, target, itemTypeId, armorSlot, sourceSlotIndex) {
    replaceUnitEquipment(player, target, itemTypeId, {
        slot: armorSlot.equipmentSlot,
        savedItemProperty: armorSlot.propertyItem,
        sourceProperty: armorSlot.propertySource,
        label: "Chest"
    }, sourceSlotIndex);
}
function replaceUnitEquipment(player, target, itemTypeId, config, sourceSlotIndex) {
    if (!isOwnedBy(target, player)) {
        const itemKind = config.label === "Mainhand" ? "equipment" : "armor";
        notify(player, `Rekrut ${getUnitLabel(target)} dengan 1 Emerald dulu sebelum memberi ${itemKind}.`);
        return;
    }
    const previousSaved = getStringProperty(target, config.savedItemProperty);
    const previousSource = getEquipmentSource(target, config.sourceProperty, DEFAULT_WEAPON_SOURCE);
    const previousActual = getActualEquipmentItem(target, config.slot);
    const rollbackItem = previousActual ?? previousSaved;
    const applied = applyActualEquipment(target, config.slot, itemTypeId);
    if (!applied.success) {
        notify(player, `Gagal memasang ${toReadableItemName(itemTypeId)} ke ${config.label}.`);
        return;
    }
    if (!consumeSelectedItem(player, itemTypeId, sourceSlotIndex)) {
        if (rollbackItem) {
            applyActualEquipment(target, config.slot, rollbackItem);
        }
        notify(player, `${toReadableItemName(itemTypeId)} tidak dikonsumsi; equipment dikembalikan.`);
        return;
    }
    if (previousSource === PLAYER_EQUIPMENT_SOURCE &&
        previousSaved &&
        previousSaved !== itemTypeId) {
        spawnSingleItem(target, previousSaved);
    }
    target.setDynamicProperty(config.savedItemProperty, itemTypeId);
    target.setDynamicProperty(config.sourceProperty, PLAYER_EQUIPMENT_SOURCE);
    if (target.typeId === VILLAGER_SOLDIER && config.slot === EquipmentSlot.Mainhand) {
        syncSoldierWeaponVisual(target, itemTypeId);
        syncSoldierCombatRole(target, itemTypeId);
    }
    const stateText = applied.verified
        ? `${config.label}: ${applied.actual ?? itemTypeId}`
        : `${config.label}: ${itemTypeId} via command fallback (readback unavailable)`;
    notify(player, `${getUnitLabel(target)} menerima ${toReadableItemName(itemTypeId)}. ${stateText}.`);
}
function getActualEquipmentItem(entity, slot) {
    const equippable = entity.getComponent(EntityComponentTypes.Equippable);
    try {
        return equippable?.getEquipment(slot)?.typeId;
    }
    catch {
        return undefined;
    }
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
    if (entity.typeId === VILLAGER_SOLDIER) {
        return;
    }
    for (const armorSlot of ARMOR_SLOTS) {
        const armor = getStringProperty(entity, armorSlot.propertyItem);
        const source = getEquipmentSource(entity, armorSlot.propertySource, "none");
        if (armor && source === PLAYER_EQUIPMENT_SOURCE) {
            spawnSingleItem(entity, armor);
        }
    }
}
function syncSoldierWeaponVisual(entity, itemTypeId) {
    if (entity.typeId !== VILLAGER_SOLDIER) {
        return;
    }
    const eventByWeapon = {
        "minecraft:wooden_sword": "warchief:set_weapon_visual_wood",
        "minecraft:stone_sword": "warchief:set_weapon_visual_stone",
        "minecraft:iron_sword": "warchief:set_weapon_visual_iron",
        "minecraft:golden_sword": "warchief:set_weapon_visual_gold",
        "minecraft:diamond_sword": "warchief:set_weapon_visual_diamond",
        "minecraft:netherite_sword": "warchief:set_weapon_visual_netherite",
        [BOW_WEAPON]: "warchief:set_weapon_visual_bow"
    };
    triggerEntityEvent(entity, eventByWeapon[itemTypeId] ?? "warchief:set_weapon_visual_stone");
}
function equipVisual(entity, slot, itemTypeId) {
    return applyActualEquipment(entity, slot, itemTypeId).success;
}
function ensureEquipment(entity, slot, itemTypeId, source) {
    const current = getActualEquipmentItem(entity, slot);
    if (current === itemTypeId) {
        return;
    }
    const result = applyActualEquipment(entity, slot, itemTypeId);
    console.warn(`[Warchief Equipment Debug] ensure: entity=${entity.typeId} source=${source} slot=${String(slot)} previous=${current ?? "unknown"} requested=${itemTypeId} success=${String(result.success)} verified=${String(result.verified)} method=${result.method} actual=${result.actual ?? "unknown"}`);
}
function applyActualEquipment(entity, slot, itemTypeId) {
    const equippable = entity.getComponent(EntityComponentTypes.Equippable);
    if (equippable) {
        try {
            const accepted = equippable.setEquipment(slot, new ItemStack(itemTypeId, 1));
            const after = equippable.getEquipment(slot)?.typeId;
            if (accepted && after === itemTypeId) {
                return {
                    success: true,
                    verified: true,
                    method: "script",
                    actual: after
                };
            }
            console.warn(`[Warchief Equipment Debug] Script equip mismatch: entity=${entity.typeId} slot=${String(slot)} requested=${itemTypeId} accepted=${String(accepted)} after=${after ?? "empty"}`);
        }
        catch (error) {
            console.warn(`[Warchief Equipment Debug] Script equip exception: entity=${entity.typeId} slot=${String(slot)} requested=${itemTypeId} error=${String(error)}`);
        }
    }
    const commandSlot = getCommandSlotName(slot);
    if (!commandSlot) {
        return {
            success: false,
            verified: false,
            method: "none"
        };
    }
    try {
        entity.runCommand(`replaceitem entity @s ${commandSlot} 0 ${itemTypeId} 1`);
        const afterCommand = getActualEquipmentItem(entity, slot);
        if (afterCommand === itemTypeId) {
            return {
                success: true,
                verified: true,
                method: "command",
                actual: afterCommand
            };
        }
        console.warn(`[Warchief Equipment Debug] command fallback applied without readable verification: entity=${entity.typeId} slot=${commandSlot} requested=${itemTypeId} readback=${afterCommand ?? "unavailable"}`);
        return {
            success: true,
            verified: false,
            method: "command",
            actual: afterCommand
        };
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 02 command equip failed for ${entity.typeId} slot=${commandSlot} item=${itemTypeId}: ${String(error)}`);
        return {
            success: false,
            verified: false,
            method: "command"
        };
    }
}
function getCommandSlotName(slot) {
    switch (slot) {
        case EquipmentSlot.Mainhand:
            return "slot.weapon.mainhand";
        case EquipmentSlot.Chest:
            return "slot.armor.chest";
        default:
            return undefined;
    }
}
function logEquipmentSlotsOnce(entity) {
    if (entity.getDynamicProperty(EQUIPMENT_DEBUG_LOGGED_PROPERTY) === true) {
        return;
    }
    const equippable = entity.getComponent(EntityComponentTypes.Equippable);
    if (!equippable) {
        console.warn(`[Warchief Equipment Debug] Entity=${getUnitLabel(entity)} EquippableComponent=missing. Check behavior entity JSON load errors.`);
        entity.setDynamicProperty(EQUIPMENT_DEBUG_LOGGED_PROPERTY, true);
        return;
    }
    try {
        console.warn(`[Warchief Equipment Debug] Entity=${getUnitLabel(entity)} Mainhand=${equippable.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? "empty"} Chest=${equippable.getEquipment(EquipmentSlot.Chest)?.typeId ?? "empty"} Attachables=enabled ArmorHidden=false`);
        entity.setDynamicProperty(EQUIPMENT_DEBUG_LOGGED_PROPERTY, true);
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 02 equipment debug failed for ${entity.typeId}: ${String(error)}`);
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
function isValidWeaponForUnit(target, itemTypeId) {
    if (itemTypeId in SWORD_DAMAGE) {
        return true;
    }
    return target.typeId === VILLAGER_SOLDIER && isBowWeapon(itemTypeId);
}
function getArmorSlot(itemTypeId) {
    return ARMOR_SLOTS.find((slot) => slot.suffixes.some((suffix) => itemTypeId.endsWith(suffix)));
}
function consumeSelectedItem(player, expectedTypeId, sourceSlotIndex) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    const container = inventory?.container;
    if (!container) {
        return false;
    }
    const selectedSlot = sourceSlotIndex ?? player.selectedSlotIndex;
    const item = container.getItem(selectedSlot);
    if (!item || item.typeId !== expectedTypeId) {
        console.warn(`[Warchief Equipment Debug] consume mismatch: player=${player.name} expected=${expectedTypeId} sourceSlot=${selectedSlot} actual=${item?.typeId ?? "empty"} currentSelected=${player.selectedSlotIndex}`);
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