# Phase 02 Equipment Architecture Recovery Plan

**Project:** Warchief Village Bedrock Add-On  
**Scope:** Villager Soldier (`minecraft:iron_golem`) and Mercenary (`minecraft:wolf`)  
**Target Runtime:** Minecraft Bedrock 1.26.40  
**Script API:** `@minecraft/server` 2.9.0

---

## 1. Purpose

Dokumen ini menjelaskan regresi sistem equipment Phase 02, akar masalahnya, contoh kegagalannya, dan urutan perubahan yang harus dilakukan tanpa merombak kembali custom geometry.

Target Phase 02 tetap hanya:

```text
Default weapon:
minecraft:stone_sword

Default armor:
minecraft:leather_chestplate
```

Upgrade yang harus didukung:

```text
Sword:
Stone -> Iron -> Diamond -> tier lain yang didukung

Chestplate:
Leather -> Iron -> Diamond -> tier lain yang didukung
```

Helmet, leggings, dan boots **bukan target Phase 02 saat ini**.

Prinsip utama:

> Pisahkan **equipment state** dari **equipment rendering**.

Jangan mengubah gameplay-equipment hanya karena visual belum benar.

---

# 2. Gejala Masalah Saat Ini

## 2.1 Muncul pesan entity tidak punya equipment component

Regresi terbaru dapat menghasilkan pesan:

```text
Villager Soldier tidak memiliki equipment component.
```

Pesan ini muncul karena `equipWeapon()` / `equipArmor()` sekarang menjadikan:

```ts
target.getComponent(EntityComponentTypes.Equippable)
```

sebagai hard precondition.

Contoh pola sekarang:

```ts
const equippable = target.getComponent(
  EntityComponentTypes.Equippable
);

if (!equippable) {
  notify(
    player,
    `${getUnitLabel(target)} tidak memiliki equipment component.`
  );
  return;
}
```

Masalahnya: ini membuat seluruh interaksi berhenti sebelum flow equipment lama sempat berjalan.

Sebelum perubahan ini, pengecekan `Equippable` dilakukan di jalur assignment (`equipVisual`) dan kegagalan tidak otomatis membatalkan seluruh sistem interaction.

**Kesimpulan:** hard blocker ini adalah regression baru dan harus diperlakukan sebagai diagnostic evidence, bukan desain final.

---

## 2.2 Leather Chestplate pernah muncul di bawah kaki

Sebelumnya Leather Chestplate sempat terlihat, tetapi posisinya salah dan muncul di sekitar bawah kaki.

Ini penting karena membuktikan:

```text
attachable pernah berhasil dirender
```

Jadi masalahnya bukan sekadar `enable_attachables=false`.

Yang lebih mungkin salah adalah:

```text
slot semantics
+
bone/geometry binding
```

Pada saat itu chestplate dipasang menggunakan:

```ts
EquipmentSlot.Body
```

padahal itemnya adalah humanoid chestplate.

---

## 2.3 Iron Chestplate tidak mengganti Leather secara visual

State bisa mengatakan:

```text
Iron Chestplate
```

tetapi visual tetap:

```text
Leather Chestplate
```

Ini terjadi karena ada kemungkinan mismatch antara:

```text
dynamic property
actual equipment slot
native default equipment
visual attachable
```

Artinya satu pesan `"menerima Iron Chestplate"` belum membuktikan bahwa actual slot benar-benar berubah.

---

## 2.4 Sword interaction berhasil tetapi visual tidak muncul

Pesan seperti:

```text
Villager Soldier menerima Iron Sword
```

hanya membuktikan bahwa interaction handler berjalan.

Itu **tidak membuktikan**:

```text
actual Mainhand = Iron Sword
```

dan juga tidak membuktikan:

```text
Sword attachable terlihat
```

Kita harus memisahkan tiga state:

```text
1. Persistent/dynamic property state
2. Actual equipment slot state
3. Visual rendering state
```

---

# 3. Root Cause Utama

Ada beberapa masalah yang saling tumpang tindih.

---

## 3.1 Humanoid Chestplate dipasang ke `EquipmentSlot.Body`

Saat ini chestplate diperlakukan sebagai:

```ts
EquipmentSlot.Body
```

Padahal Script API membedakan:

```text
EquipmentSlot.Body
EquipmentSlot.Chest
```

Secara semantik:

```text
Body
-> body armor untuk non-humanoid mob

Chest
-> humanoid chestplate / elytra slot
```

Karena Soldier/Mercenary sekarang memakai custom humanoid visual:

```text
geometry.warchief.humanoid
```

maka chestplate seharusnya menggunakan:

```ts
EquipmentSlot.Chest
```

bukan:

```ts
EquipmentSlot.Body
```

### Contoh salah

```ts
equippable.setEquipment(
  EquipmentSlot.Body,
  new ItemStack("minecraft:iron_chestplate")
);
```

### Target

```ts
equippable.setEquipment(
  EquipmentSlot.Chest,
  new ItemStack("minecraft:iron_chestplate")
);
```

Ini adalah perubahan paling penting pada arsitektur armor.

---

# 4. `minecraft:equippable` Slot 1 Bukan Humanoid Chest Slot

Behavior Pack sekarang memiliki pola:

```json
"minecraft:equippable": {
  "slots": [
    {
      "slot": 0,
      "item": "stone_sword"
    },
    {
      "slot": 1,
      "item": "leather_chestplate"
    }
  ]
}
```

Asumsi sebelumnya:

```text
slot 0 = weapon
slot 1 = chest armor
```

tidak aman.

Untuk mapping modern Bedrock, slot kedua `minecraft:equippable` dipetakan ke:

```text
slot.armor.body
```

bukan otomatis ke humanoid `Chest`.

Akibatnya arsitektur sekarang secara konsep menjadi:

```text
minecraft:equippable slot 1
        ↓
slot.armor.body
        ↓
Leather Chestplate
        ↓
humanoid armor attachable
```

Ini mismatch semantics.

### Tindakan

Chestplate harus dikeluarkan dari jalur:

```text
minecraft:equippable slot 1
```

dan dipindahkan ke:

```ts
EquipmentSlot.Chest
```

melalui Script API.

---

# 5. Saat Ini Ada Tiga Authority Equipment

Project saat ini menggunakan:

```text
minecraft:equipment
+
minecraft:equippable
+
Script API setEquipment()
```

Ketiganya punya fungsi berbeda.

## `minecraft:equipment`

Digunakan untuk initial/native equipment.

Contoh:

```json
"minecraft:equipment": {
  "table": "loot_tables/entities/warchief_default_loadout.json"
}
```

## `minecraft:equippable`

Mendefinisikan data-driven equippable slots.

## Script API

Digunakan untuk runtime mutation:

```ts
equippable.setEquipment(...)
```

Masalahnya bukan karena ketiganya selalu salah.

Masalahnya adalah **tidak ada ownership yang jelas**.

Ketika Leather tetap tampil setelah Iron diberikan, kita tidak tahu apakah penyebabnya:

```text
native equipment
equippable body slot
Script state
attachable visual
```

---

# 6. Vanilla Reference untuk Default Sword

Vanilla Skeleton / Wither Skeleton memakai:

```json
"minecraft:equipment": {
  "table": "loot_tables/entities/wither_skeleton_gear.json"
}
```

dan table tersebut bisa memberi:

```json
{
  "type": "item",
  "name": "minecraft:stone_sword"
}
```

Artinya:

```text
minecraft:equipment
-> default Stone Sword
```

adalah pola yang valid untuk mob.

Karena itu, dalam recovery pass **jangan sekaligus menghapus baseline native Stone Sword**.

Pertahankan dulu:

```text
minecraft:equipment
-> Stone Sword
-> Mainhand
```

sambil kita memperbaiki armor.

---

# 7. Arsitektur Equipment yang Direkomendasikan

## 7.1 Default Weapon

```text
minecraft:equipment
        ↓
Stone Sword
        ↓
Mainhand
```

Tujuan:

- mengikuti pola vanilla mob;
- memberi baseline weapon deterministic;
- tidak merombak terlalu banyak hal sekaligus.

---

## 7.2 Player Weapon Upgrade

Upgrade sword menggunakan:

```ts
EquipmentSlot.Mainhand
```

Flow:

```text
Stone Sword default
        ↓
player gives Iron Sword
        ↓
set Mainhand = Iron Sword
        ↓
verify actual Mainhand
        ↓
consume item
        ↓
persist source = player
```

---

## 7.3 Default Humanoid Chestplate

Gunakan:

```ts
EquipmentSlot.Chest
```

Target:

```text
Leather Chestplate
-> Chest
```

Bukan:

```text
Leather Chestplate
-> Body
```

---

## 7.4 Player Chestplate Upgrade

Gunakan slot yang sama:

```ts
EquipmentSlot.Chest
```

Flow:

```text
Leather Chestplate
        ↓
Iron Chestplate
        ↓
verify actual Chest
        ↓
persist player state
```

---

# 8. Perubahan `ARMOR_SLOTS`

## Sebelum

```ts
const ARMOR_SLOTS = [
  {
    equipmentSlot: EquipmentSlot.Body,
    key: "chest",
    propertyItem: "warchief:p02_armor_chest_item",
    propertySource: "warchief:p02_armor_chest_source",
    suffixes: ["_chestplate"]
  }
];
```

## Sesudah

```ts
const ARMOR_SLOTS = [
  {
    equipmentSlot: EquipmentSlot.Chest,
    key: "chest",
    propertyItem: "warchief:p02_armor_chest_item",
    propertySource: "warchief:p02_armor_chest_source",
    suffixes: ["_chestplate"]
  }
];
```

---

# 9. Perubahan Behavior Pack

Chestplate tidak boleh lagi menjadi authority melalui slot kedua `minecraft:equippable`.

## Sebelum

```json
"minecraft:equippable": {
  "slots": [
    {
      "slot": 0,
      "item": "stone_sword",
      "accepted_items": [
        "wooden_sword",
        "stone_sword",
        "iron_sword",
        "golden_sword",
        "diamond_sword",
        "netherite_sword"
      ]
    },
    {
      "slot": 1,
      "item": "leather_chestplate",
      "accepted_items": [
        "leather_chestplate",
        "iron_chestplate",
        "diamond_chestplate"
      ]
    }
  ]
}
```

## Recovery Direction

```json
"minecraft:equippable": {
  "slots": [
    {
      "slot": 0,
      "item": "stone_sword",
      "accepted_items": [
        "wooden_sword",
        "stone_sword",
        "iron_sword",
        "golden_sword",
        "diamond_sword",
        "netherite_sword"
      ]
    }
  ]
}
```

Chestplate tidak lagi menggunakan:

```text
slot 1 -> slot.armor.body
```

Chestplate akan dikelola Script melalui:

```ts
EquipmentSlot.Chest
```

---

# 10. Recovery untuk `equipWeapon()`

Perubahan terakhir membuat `Equippable` menjadi hard blocker.

Jangan melakukan broad rewrite lagi.

Target flow:

```text
validate ownership
        ↓
read previous saved weapon/source
        ↓
attempt Mainhand assignment
        ↓
verify actual Mainhand
        ↓
consume new item
        ↓
refund old player gear
        ↓
persist
```

Contoh bentuk:

```ts
const previousWeapon =
  getStringProperty(target, WEAPON_ITEM_PROPERTY);

const previousSource =
  getEquipmentSource(
    target,
    WEAPON_SOURCE_PROPERTY,
    DEFAULT_WEAPON_SOURCE
  );

const success = equipVisual(
  target,
  EquipmentSlot.Mainhand,
  itemTypeId
);

if (!success) {
  console.warn(
    `[Warchief Equipment] Mainhand assignment failed: ${itemTypeId}`
  );
  return;
}

if (!consumeSelectedItem(player, itemTypeId)) {
  return;
}

if (
  previousWeapon &&
  previousWeapon !== itemTypeId &&
  previousSource === PLAYER_EQUIPMENT_SOURCE
) {
  spawnSingleItem(target, previousWeapon);
}

target.setDynamicProperty(
  WEAPON_ITEM_PROPERTY,
  itemTypeId
);

target.setDynamicProperty(
  WEAPON_SOURCE_PROPERTY,
  PLAYER_EQUIPMENT_SOURCE
);
```

Catatan:

> Jangan menganggap pesan interaction sebagai success sebelum actual slot diverifikasi.

---

# 11. Recovery untuk `equipArmor()`

Target slot:

```ts
EquipmentSlot.Chest
```

Contoh:

```ts
const success = equipVisual(
  target,
  EquipmentSlot.Chest,
  itemTypeId
);
```

Bukan:

```ts
EquipmentSlot.Body
```

Expected upgrade:

```text
Leather Chestplate
        ↓
Iron Chestplate
        ↓
actual Chest = minecraft:iron_chestplate
```

---

# 12. Bug pada `ensureEquipment()`

Versi sebelumnya memiliki guard:

```ts
if (
  source === PLAYER_EQUIPMENT_SOURCE &&
  current
) {
  return;
}
```

Ini salah untuk recovery.

Contoh:

```text
saved state:
minecraft:iron_chestplate

actual slot:
minecraft:leather_chestplate

source:
player
```

Function melihat:

```text
source == player
current exists
```

lalu return.

Akibatnya:

```text
saved = Iron
actual = Leather
```

tidak pernah disinkronkan.

## Target logic

```ts
const current =
  equippable.getEquipment(slot);

if (current?.typeId === itemTypeId) {
  return;
}

equippable.setEquipment(
  slot,
  new ItemStack(itemTypeId, 1)
);
```

Source property tidak boleh mencegah koreksi actual slot.

---

# 13. Debug Output Harus Menggunakan `Chest`

Debug lama:

```text
Mainhand=...
Body=...
```

Target:

```text
Mainhand=minecraft:stone_sword
Chest=minecraft:leather_chestplate
```

Contoh:

```ts
const mainhand =
  equippable.getEquipment(
    EquipmentSlot.Mainhand
  )?.typeId ?? "empty";

const chest =
  equippable.getEquipment(
    EquipmentSlot.Chest
  )?.typeId ?? "empty";

console.warn(
  `[Warchief Equipment Debug] ` +
  `Mainhand=${mainhand} ` +
  `Chest=${chest}`
);
```

Actual slot adalah bukti equipment state.

---

# 14. Refund Policy

## Default Gear

```text
Stone default -> Iron player
```

Stone tidak direfund.

```text
Leather default -> Iron Chestplate player
```

Leather tidak direfund.

## Player Gear

```text
Iron Sword(player)
-> Diamond Sword(player)
```

Expected:

```text
1x Iron Sword returned
```

```text
Iron Chestplate(player)
-> Diamond Chestplate(player)
```

Expected:

```text
1x Iron Chestplate returned
```

Tidak boleh zero, tidak boleh duplicate.

---

# 15. Custom Geometry Jangan Diubah Lagi Saat Recovery Equipment

Current visual base:

```text
resource_pack/models/entity/warchief_humanoid.geo.json
geometry.warchief.humanoid
```

Client entity harus tetap:

```json
"geometry": {
  "default": "geometry.warchief.humanoid"
},
"enable_attachables": true,
"hide_armor": false
```

Jangan:

- kembali ke Vindicator geometry;
- kembali ke raw Pillager geometry;
- redesign bone hierarchy;
- membuat attack animation baru.

Selesaikan equipment state dulu.

---

# 16. Weapon Visual Debugging Dilakukan Setelah Mainhand Terbukti

Test:

```text
Mainhand = minecraft:stone_sword
```

lalu:

```text
Mainhand = minecraft:iron_sword
```

Jika actual slot benar tetapi sword invisible:

```text
EQUIPMENT = PASS
VISUAL = FAIL
```

Baru inspect:

```text
rightItem
held-item attachable
animation.humanoid.holding
render controller
```

Jangan mengubah equipment architecture lagi.

---

# 17. Armor Visual Debugging Dilakukan Setelah Chest Terbukti

Test:

```text
Chest = minecraft:leather_chestplate
```

kemudian:

```text
Chest = minecraft:iron_chestplate
```

Jika actual Chest benar tetapi visual masih Leather:

```text
SERVER EQUIPMENT = PASS
RESOURCE PACK = FAIL
```

Baru inspect:

```text
armor attachable geometry
body/rightArm/leftArm matching
material
texture
render controller
```

Jangan pindahkan kembali item ke `Body`.

---

# 18. Wolf Version Risk

Saat audit, file:

```text
behavior_pack/entities/wolf.json
```

menggunakan:

```json
"format_version": "1.26.50"
```

sementara pack target:

```json
"min_engine_version": [
  1,
  26,
  40
]
```

Project juga menggunakan:

```text
@minecraft/server 2.9.0
```

untuk target 1.26.40.

Ini adalah compatibility risk.

Jangan langsung downgrade tanpa memeriksa field Wolf yang membutuhkan schema lebih baru.

Tetapi sebelum release, versi entity harus konsisten dan terbukti compatible dengan runtime target.

---

# 19. File yang Boleh Diubah pada Recovery Pass

Utama:

```text
src/phase02/replacementUnits.ts
behavior_pack/scripts/phase02/replacementUnits.js
behavior_pack/entities/iron_golem.json
behavior_pack/entities/wolf.json
docs/phase/PHASE_02_COMPLETION_REPORT.md
docs/phase/PHASE_02_IMPROVEMENT_EQUIPMENT_VISUAL_RENDERING.md
```

Jangan ubah:

```text
resource_pack/models/entity/warchief_humanoid.geo.json
```

selama recovery equipment.

---

# 20. Urutan Implementasi Wajib

## Step 1

Freeze:

```text
geometry.warchief.humanoid
```

---

## Step 2

Hilangkan regression hard blocker:

```text
missing Equippable
-> immediate user-facing rejection
```

Kembalikan ke diagnostic-first behavior.

---

## Step 3

Ubah:

```ts
EquipmentSlot.Body
```

menjadi:

```ts
EquipmentSlot.Chest
```

untuk semua humanoid chestplate logic.

---

## Step 4

Hapus chestplate dari:

```text
minecraft:equippable slot 1
```

---

## Step 5

Pertahankan sementara:

```text
minecraft:equipment
-> default Stone Sword
```

Jangan menghapus baseline weapon dalam patch yang sama.

---

## Step 6

Initialize:

```text
Leather Chestplate
-> EquipmentSlot.Chest
```

---

## Step 7

Fix `ensureEquipment()` supaya semua mismatch disinkronkan.

---

## Step 8

Test fresh Soldier:

```text
Mainhand = minecraft:stone_sword
Chest = minecraft:leather_chestplate
```

Jangan lanjut sebelum ini benar.

---

## Step 9

Test fresh Mercenary dengan expected state yang sama.

---

## Step 10

Give Iron Sword.

Expected:

```text
Mainhand = minecraft:iron_sword
```

---

## Step 11

Give Iron Chestplate.

Expected:

```text
Chest = minecraft:iron_chestplate
```

---

## Step 12

Test replacement:

```text
Iron Sword -> Diamond Sword
```

Expected:

```text
Iron Sword returned exactly once
```

```text
Iron Chestplate -> Diamond Chestplate
```

Expected:

```text
Iron Chestplate returned exactly once
```

---

## Step 13

Save/reload.

Expected actual slot tetap sama dengan persisted player gear.

---

## Step 14

Freeze equipment architecture.

Setelah Mainhand + Chest benar:

```text
DO NOT CHANGE EQUIPMENT AGAIN
```

Jika visual masih rusak, pindah ke Resource Pack debugging.

---

# 21. Acceptance Test Matrix

## Fresh Soldier

```text
Mainhand = Stone Sword
Chest = Leather Chestplate
```

## Fresh Mercenary

```text
Mainhand = Stone Sword
Chest = Leather Chestplate
```

## Iron Sword Upgrade

```text
Mainhand = Iron Sword
source = player
default Stone not refunded
```

## Diamond Sword Upgrade

```text
Iron Sword refunded exactly once
Mainhand = Diamond Sword
```

## Iron Chestplate Upgrade

```text
Chest = Iron Chestplate
source = player
default Leather not refunded
```

## Diamond Chestplate Upgrade

```text
Iron Chestplate refunded exactly once
Chest = Diamond Chestplate
```

## Save / Reload

```text
actual slots restored from persisted state
```

## Death

Default gear:

```text
no required manual default gear refund
```

Player gear:

```text
weapon drops once
chestplate drops once
```

---

# 22. Hal yang Jangan Dilakukan

Jangan:

- redesign custom geometry;
- ganti ke Vindicator model;
- kembali ke raw Pillager model;
- tambah helmet/leggings/boots;
- buat custom attack animation sebelum equipment stabil;
- rewrite follow/patrol;
- rewrite recruitment;
- menggunakan `EquipmentSlot.Body` lagi untuk humanoid chestplate;
- menganggap dynamic property sebagai bukti actual equipment;
- menganggap chat `"menerima Iron Sword"` sebagai bukti Mainhand benar;
- mengubah server equipment hanya karena visual belum muncul.

---

# 23. Definition of Done

Recovery equipment selesai jika terbukti:

```text
Fresh:
Mainhand = minecraft:stone_sword
Chest = minecraft:leather_chestplate
```

Upgrade pertama:

```text
Mainhand = minecraft:iron_sword
Chest = minecraft:iron_chestplate
```

Upgrade kedua:

```text
old player sword refunded once
old player chestplate refunded once
new gear remains in actual slot
```

Save/reload:

```text
actual slots == persisted equipment
```

Setelah itu, equipment architecture dibekukan.

> Jika visual masih salah ketika actual Mainhand dan Chest sudah benar, masalah berikutnya adalah Resource Pack / attachable rendering, bukan equipment state.

---

# 24. Final Architecture

```text
DEFAULT WEAPON
minecraft:equipment
        ↓
Stone Sword
        ↓
Mainhand

PLAYER WEAPON
Script API
        ↓
EquipmentSlot.Mainhand

DEFAULT HUMANOID ARMOR
Script API
        ↓
Leather Chestplate
        ↓
EquipmentSlot.Chest

PLAYER ARMOR
Script API
        ↓
EquipmentSlot.Chest

CUSTOM MODEL
geometry.warchief.humanoid
        ↓
rightItem
body
rightArm
leftArm

VISUAL DEBUGGING
ONLY AFTER
Mainhand + Chest actual state is proven correct
```

---

## References Reviewed During Audit

Official Microsoft Bedrock documentation:

- `minecraft:equippable`
- `minecraft:equipment`
- Script API `EquipmentSlot`
- Script API `EntityEquippableComponent`
- client entity `enable_attachables`
- client entity `hide_armor`
- armor equipment-slot mapping
- Bedrock 1.26.40 / `@minecraft/server` 2.9.0

Vanilla Mojang references:

- Skeleton behavior
- Wither Skeleton behavior
- Wither Skeleton Stone Sword equipment table
- Skeleton client entity
- Skeleton humanoid geometry
- Wolf `slot.armor.body` behavior

Key distinction:

```text
Mainhand weapon
!=
non-humanoid Body armor
!=
humanoid Chest armor
```
