import {
  Entity,
  EntityComponentTypes,
  EntityDamageCause,
  EntityEquippableComponent,
  EntityHealthComponent,
  EntityInventoryComponent,
  EntityMovementComponent,
  EntityTameableComponent,
  EquipmentSlot,
  ItemStack,
  Player,
  system,
  world
} from "@minecraft/server";

const OWNER_PROPERTY = "warchief:p01_owner_id";
const OWNER_NAME_PROPERTY = "warchief:p01_owner_name";
const WEAPON_PROPERTY = "warchief:p01_weapon";
const EQUIPPED_VISUAL_PROPERTY = "warchief:p01_equipped_visual";

const PROTOTYPE_TYPES = new Set(["minecraft:wolf", "minecraft:iron_golem"]);
const FOLLOW_DISTANCE = 5;
const FOLLOW_TELEPORT_DISTANCE = 64;
const FOLLOW_TICK_INTERVAL = 5;
const PROTOTYPE_BASE_DAMAGE = 3;
const PROTOTYPE_MOVE_SPEED = 0.35;
const PROTOTYPE_HEALTH = 24;

const damageNormalizationBypass = new Set<string>();

const SWORD_DAMAGE: Record<string, number> = {
  "minecraft:wooden_sword": 4,
  "minecraft:golden_sword": 4,
  "minecraft:stone_sword": 5,
  "minecraft:iron_sword": 6,
  "minecraft:diamond_sword": 7,
  "minecraft:netherite_sword": 8
};

const SWORD_LABEL: Record<string, string> = {
  "minecraft:wooden_sword": "Wooden Sword",
  "minecraft:golden_sword": "Golden Sword",
  "minecraft:stone_sword": "Stone Sword",
  "minecraft:iron_sword": "Iron Sword",
  "minecraft:diamond_sword": "Diamond Sword",
  "minecraft:netherite_sword": "Netherite Sword"
};

export function registerPhase01PrototypeUnits(): void {
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
    const desiredDamage =
      typeof weaponType === "string" ? SWORD_DAMAGE[weaponType] ?? PROTOTYPE_BASE_DAMAGE : PROTOTYPE_BASE_DAMAGE;

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
    } catch (error) {
      console.warn(`[Warchief Village] Phase 01 damage apply failed: ${String(error)}`);
      damageNormalizationBypass.delete(attacker.id);
    }
  });

  system.runInterval(updatePrototypeFollowers, FOLLOW_TICK_INTERVAL);

  system.run(() => {
    console.warn("[Warchief Village] Phase 01 prototype unit systems loaded.");
  });
}

function recruitPrototypeUnit(player: Player, target: Entity): void {
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

  if (target.typeId === "minecraft:wolf") {
    const tameable = target.getComponent(EntityComponentTypes.Tameable) as EntityTameableComponent | undefined;

    try {
      tameable?.tame(player);
    } catch (error) {
      console.warn(`[Warchief Village] Phase 01 wolf tame failed: ${String(error)}`);
    }
  }

  notify(player, `${target.nameTag} direkrut dengan 1 Emerald.`);
}

function equipPrototypeUnit(player: Player, target: Entity, swordTypeId: string): void {
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
  const equippable = target.getComponent(EntityComponentTypes.Equippable) as
    | EntityEquippableComponent
    | undefined;

  if (equippable) {
    try {
      visualEquipped = equippable.setEquipment(EquipmentSlot.Mainhand, new ItemStack(swordTypeId, 1));
    } catch (error) {
      console.warn(`[Warchief Village] Phase 01 visual equip failed: ${String(error)}`);
    }
  }

  target.setDynamicProperty(EQUIPPED_VISUAL_PROPERTY, visualEquipped);
  notify(
    player,
    `${target.nameTag || "Prototype unit"} menerima ${SWORD_LABEL[swordTypeId]}${
      visualEquipped ? "." : " (damage aktif, visual slot belum tersedia di entity vanilla ini)."
    }`
  );
}

function updatePrototypeFollowers(): void {
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

      normalizePrototypeAttributes(soldier);
      applyPrototypeFollowSpeed(soldier);

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
        soldier.teleport(destination, {
          checkForBlocks: false,
          facingLocation: player.location
        });
      } catch (error) {
        console.warn(`[Warchief Village] Phase 01 banner follow failed: ${String(error)}`);
      }
    }
  }
}

function normalizePrototypeAttributes(entity: Entity): void {
  normalizeCurrentHealth(entity);
  normalizeMovementSpeed(entity);
}

function normalizeCurrentHealth(entity: Entity): void {
  const health = entity.getComponent(EntityComponentTypes.Health) as EntityHealthComponent | undefined;

  if (!health) {
    return;
  }

  try {
    health.setCurrentValue(Math.min(health.effectiveMax, PROTOTYPE_HEALTH));
  } catch (error) {
    console.warn(`[Warchief Village] Phase 01 health normalize failed: ${String(error)}`);
  }
}

function normalizeMovementSpeed(entity: Entity): void {
  const movement = entity.getComponent(EntityComponentTypes.Movement) as EntityMovementComponent | undefined;

  if (!movement) {
    return;
  }

  try {
    movement.setCurrentValue(Math.min(movement.effectiveMax, PROTOTYPE_MOVE_SPEED));
  } catch (error) {
    console.warn(`[Warchief Village] Phase 01 movement normalize failed: ${String(error)}`);
  }
}

function applyPrototypeFollowSpeed(entity: Entity): void {
  try {
    entity.addEffect("speed", 30, {
      amplifier: 1,
      showParticles: false
    });
  } catch (error) {
    console.warn(`[Warchief Village] Phase 01 speed effect failed: ${String(error)}`);
  }
}

function refundExcessDamage(entity: Entity, amount: number): void {
  if (amount <= 0 || !entity.isValid) {
    return;
  }

  const health = entity.getComponent(EntityComponentTypes.Health) as EntityHealthComponent | undefined;

  if (!health) {
    return;
  }

  try {
    health.setCurrentValue(Math.min(health.effectiveMax, health.currentValue + amount));
  } catch (error) {
    console.warn(`[Warchief Village] Phase 01 damage refund failed: ${String(error)}`);
  }
}

function consumeSelectedItem(player: Player, expectedTypeId: string): boolean {
  const inventory = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent | undefined;
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

function isRecruited(entity: Entity): boolean {
  return typeof entity.getDynamicProperty(OWNER_PROPERTY) === "string";
}

function isOwnedBy(entity: Entity, player: Player): boolean {
  return entity.getDynamicProperty(OWNER_PROPERTY) === player.id;
}

function isHoldingBanner(player: Player): boolean {
  const inventory = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent | undefined;
  const item = inventory?.container?.getItem(player.selectedSlotIndex);
  return Boolean(
    item?.typeId === "minecraft:banner" || item?.typeId.endsWith("_banner") || item?.typeId.includes("banner")
  );
}

function distanceBetween(player: Player, entity: Entity): number {
  const dx = player.location.x - entity.location.x;
  const dy = player.location.y - entity.location.y;
  const dz = player.location.z - entity.location.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function notify(player: Player, message: string): void {
  try {
    player.sendMessage(`[Warchief] ${message}`);
  } catch {
    console.warn(`[Warchief Village] ${message}`);
  }
}
