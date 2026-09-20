import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, ItemStack, system, world } from "@minecraft/server";
const OWNER_PROPERTY = "warchief:p01_owner_id";
const OWNER_NAME_PROPERTY = "warchief:p01_owner_name";
const WEAPON_PROPERTY = "warchief:p01_weapon";
const EQUIPPED_VISUAL_PROPERTY = "warchief:p01_equipped_visual";
const PROTOTYPE_TYPES = new Set(["minecraft:wolf", "minecraft:iron_golem"]);
const PROTOTYPE_BASE_DAMAGE = 3;
const PROTOTYPE_MOVE_SPEED = 0.35;
const PROTOTYPE_HEALTH = 24;
const damageNormalizationBypass = new Set();
const SWORD_DAMAGE = {
    "minecraft:wooden_sword": 4,
    "minecraft:golden_sword": 4,
    "minecraft:stone_sword": 5,
    "minecraft:iron_sword": 6,
    "minecraft:diamond_sword": 7,
    "minecraft:netherite_sword": 8
};
const SWORD_LABEL = {
    "minecraft:wooden_sword": "Wooden Sword",
    "minecraft:golden_sword": "Golden Sword",
    "minecraft:stone_sword": "Stone Sword",
    "minecraft:iron_sword": "Iron Sword",
    "minecraft:diamond_sword": "Diamond Sword",
    "minecraft:netherite_sword": "Netherite Sword"
};
export function registerPhase01PrototypeUnits() {
    world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
        const item = event.itemStack;
        const target = event.target;
        if (!item || !PROTOTYPE_TYPES.has(target.typeId)) {
            return;
        }
        if (item.typeId === "minecraft:emerald") {
            event.cancel = true;
            system.run(() => recruitPrototypeUnit(event.player, target));
            return;
        }
        if (item.typeId in SWORD_DAMAGE) {
            event.cancel = true;
            system.run(() => equipPrototypeUnit(event.player, target, item.typeId));
        }
    });
    world.afterEvents.entityHurt.subscribe((event) => {
        const attacker = event.damageSource.damagingEntity;
        if (!attacker || !PROTOTYPE_TYPES.has(attacker.typeId) || !isRecruited(attacker)) {
            return;
        }
        if (damageNormalizationBypass.has(attacker.id)) {
            return;
        }
        const weaponType = attacker.getDynamicProperty(WEAPON_PROPERTY);
        const desiredDamage = typeof weaponType === "string" ? SWORD_DAMAGE[weaponType] ?? PROTOTYPE_BASE_DAMAGE : PROTOTYPE_BASE_DAMAGE;
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
            console.warn(`[Warchief Village] Phase 01 damage apply failed: ${String(error)}`);
            damageNormalizationBypass.delete(attacker.id);
        }
    });
    system.run(() => {
        console.warn("[Warchief Village] Phase 01 prototype unit systems loaded.");
    });
}
function recruitPrototypeUnit(player, target) {
    if (!target.isValid || !player.isValid) {
        return;
    }
    if (isRecruited(target)) {
        notify(player, "Unit ini sudah direkrut.");
        return;
    }
    if (!consumeSelectedItem(player, "minecraft:emerald")) {
        notify(player, "Pegang 1 Emerald untuk merekrut unit.");
        return;
    }
    target.setDynamicProperty(OWNER_PROPERTY, player.id);
    target.setDynamicProperty(OWNER_NAME_PROPERTY, player.name);
    target.nameTag = target.typeId === "minecraft:wolf" ? "Mercenary Prototype" : "Villager Soldier Prototype";
    normalizePrototypeAttributes(target);
    const tameable = target.getComponent(EntityComponentTypes.Tameable);
    try {
        tameable?.tame(player);
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 01 tame failed for ${target.typeId}: ${String(error)}`);
    }
    notify(player, `${target.nameTag} direkrut dengan 1 Emerald.`);
}
function equipPrototypeUnit(player, target, swordTypeId) {
    if (!target.isValid || !player.isValid) {
        return;
    }
    if (!isOwnedBy(target, player)) {
        notify(player, "Rekrut unit ini dengan 1 Emerald dulu sebelum memberi sword.");
        return;
    }
    if (!consumeSelectedItem(player, swordTypeId)) {
        notify(player, `Pegang ${SWORD_LABEL[swordTypeId]} untuk memberi equipment.`);
        return;
    }
    target.setDynamicProperty(WEAPON_PROPERTY, swordTypeId);
    let visualEquipped = false;
    const equippable = target.getComponent(EntityComponentTypes.Equippable);
    if (equippable) {
        try {
            visualEquipped = equippable.setEquipment(EquipmentSlot.Mainhand, new ItemStack(swordTypeId, 1));
        }
        catch (error) {
            console.warn(`[Warchief Village] Phase 01 visual equip failed: ${String(error)}`);
        }
    }
    target.setDynamicProperty(EQUIPPED_VISUAL_PROPERTY, visualEquipped);
    notify(player, `${target.nameTag || "Prototype unit"} menerima ${SWORD_LABEL[swordTypeId]}${visualEquipped ? "." : " (damage aktif, visual slot belum tersedia di entity vanilla ini)."}`);
}
function normalizePrototypeAttributes(entity) {
    normalizeCurrentHealth(entity);
    normalizeMovementSpeed(entity);
}
function normalizeCurrentHealth(entity) {
    const health = entity.getComponent(EntityComponentTypes.Health);
    if (!health) {
        return;
    }
    try {
        health.setCurrentValue(Math.min(health.effectiveMax, PROTOTYPE_HEALTH));
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 01 health normalize failed: ${String(error)}`);
    }
}
function normalizeMovementSpeed(entity) {
    const movement = entity.getComponent(EntityComponentTypes.Movement);
    if (!movement) {
        return;
    }
    try {
        movement.setCurrentValue(Math.min(movement.effectiveMax, PROTOTYPE_MOVE_SPEED));
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 01 movement normalize failed: ${String(error)}`);
    }
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
        console.warn(`[Warchief Village] Phase 01 damage refund failed: ${String(error)}`);
    }
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
function isRecruited(entity) {
    return typeof entity.getDynamicProperty(OWNER_PROPERTY) === "string";
}
function isOwnedBy(entity, player) {
    return entity.getDynamicProperty(OWNER_PROPERTY) === player.id;
}
function notify(player, message) {
    try {
        player.sendMessage(`[Warchief] ${message}`);
    }
    catch {
        console.warn(`[Warchief Village] ${message}`);
    }
}
//# sourceMappingURL=prototypeUnits.js.map