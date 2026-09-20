import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, ItemStack, system, world } from "@minecraft/server";
const OWNER_PROPERTY = "warchief:p01_owner_id";
const OWNER_NAME_PROPERTY = "warchief:p01_owner_name";
const WEAPON_PROPERTY = "warchief:p01_weapon";
const EQUIPPED_VISUAL_PROPERTY = "warchief:p01_equipped_visual";
const PROTOTYPE_TYPES = new Set(["minecraft:wolf", "minecraft:iron_golem"]);
const FOLLOW_DISTANCE = 6;
const FOLLOW_TELEPORT_DISTANCE = 18;
const FOLLOW_TICK_INTERVAL = 20;
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
    world.afterEvents.entityHitEntity.subscribe((event) => {
        const attacker = event.damagingEntity;
        if (!PROTOTYPE_TYPES.has(attacker.typeId) || !isRecruited(attacker)) {
            return;
        }
        const weaponType = attacker.getDynamicProperty(WEAPON_PROPERTY);
        const bonusDamage = typeof weaponType === "string" ? SWORD_DAMAGE[weaponType] : undefined;
        if (!bonusDamage || bonusDamage <= 0) {
            return;
        }
        try {
            event.hitEntity.applyDamage(bonusDamage, {
                cause: EntityDamageCause.entityAttack,
                damagingEntity: attacker
            });
        }
        catch (error) {
            console.warn(`[Warchief Village] Phase 01 damage apply failed: ${String(error)}`);
        }
    });
    system.runInterval(updatePrototypeFollowers, FOLLOW_TICK_INTERVAL);
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
    normalizeCurrentHealth(target);
    if (target.typeId === "minecraft:wolf") {
        const tameable = target.getComponent(EntityComponentTypes.Tameable);
        try {
            tameable?.tame(player);
        }
        catch (error) {
            console.warn(`[Warchief Village] Phase 01 wolf tame failed: ${String(error)}`);
        }
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
function updatePrototypeFollowers() {
    for (const player of world.getAllPlayers()) {
        if (!player.isValid || !isHoldingBanner(player)) {
            continue;
        }
        const soldiers = player.dimension.getEntities({
            type: "minecraft:iron_golem",
            location: player.location,
            maxDistance: FOLLOW_TELEPORT_DISTANCE
        });
        for (const soldier of soldiers) {
            if (!isOwnedBy(soldier, player)) {
                continue;
            }
            const distance = distanceBetween(player, soldier);
            if (distance <= FOLLOW_DISTANCE) {
                continue;
            }
            const destination = {
                x: player.location.x - 1.5,
                y: player.location.y,
                z: player.location.z - 1.5
            };
            try {
                soldier.tryTeleport(destination, {
                    checkForBlocks: true,
                    facingLocation: player.location
                });
            }
            catch (error) {
                console.warn(`[Warchief Village] Phase 01 banner follow failed: ${String(error)}`);
            }
        }
    }
}
function normalizeCurrentHealth(entity) {
    const health = entity.getComponent(EntityComponentTypes.Health);
    if (!health) {
        return;
    }
    try {
        const targetHealth = entity.typeId === "minecraft:wolf" ? 20 : 40;
        health.setCurrentValue(Math.min(health.effectiveMax, targetHealth));
    }
    catch (error) {
        console.warn(`[Warchief Village] Phase 01 health normalize failed: ${String(error)}`);
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
function isHoldingBanner(player) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    const item = inventory?.container?.getItem(player.selectedSlotIndex);
    return item?.typeId.endsWith("_banner") ?? false;
}
function distanceBetween(player, entity) {
    const dx = player.location.x - entity.location.x;
    const dy = player.location.y - entity.location.y;
    const dz = player.location.z - entity.location.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
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