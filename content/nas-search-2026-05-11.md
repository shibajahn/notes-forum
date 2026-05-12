# 2026-05-11

## NAS Product Search Report

**Date:** 2026-05-11
**Search Scope:** ServeTheHome Storage category (pages 1-20+), ASUSTOR product list, Minisforum NAS collection
**Feeds Scanned:**
- ServeTheHome Storage category (https://www.servethehome.com/category/storage/) - Pages 1-20+ (~100+ articles reviewed)
- ASUSTOR Product List (https://www.asustor.com/en/product/product_list) - Full product catalog checked
- Minisforum NAS Collection (https://www.minisforum.com/collections/nas-series) - Full collection checked

**Total Articles Analyzed:** ~100+ NAS-related articles
**Products Evaluated:** 10 NAS products

---

## Search Criteria

1. **CPU Cores:** 12+ cores (at least 12)
2. **Networking:** At least 1x 10GbE port (25GbE also qualifies)
3. **M.2 NVMe:** At least 2x M.2 NVMe SSD slots with PCIe 4.0 x2+ speed
4. **HDD Bays:** At least 2x 3.5" SATA HDD bays

---

## NEW PRODUCT MATCH FOUND ✅

### Minisforum N5 MAX AI NAS

**Source:** Minisforum Store (https://store.minisforum.com/products/minisforum-n5-max-ai-nas)
**Date:** May 2026 (new listing, pre-launch)
**Price:** $1,439.00 (sale from $1,799.00)
**Availability:** Out of Stock (pre-launch)

| Criteria | Required | Actual | Status |
|----------|----------|--------|--------|
| CPU Cores | 12+ | 16 cores / 32 threads (AMD Ryzen AI Max+ 395) | ✅ PASS |
| 10GbE+ | 1x | Dual 10GbE (2x 10GbE ports) | ✅ PASS |
| M.2 NVMe | 2x PCIe 4.0 x2+ | 5x M.2 NVMe slots | ✅ PASS |
| 3.5" SATA | 2x | 5x 3.5"/2.5" SATA HDD bays | ✅ PASS |

**Full Specs:**
- **CPU:** AMD Ryzen AI Max+ 395 (16 cores: 8 Zen 5 P-cores + 8 Zen 5c E-cores, 32 threads), Radeon 8060S iGPU, up to 126 TOPS AI
- **Memory:** LPDDR5x (high-bandwidth architecture)
- **Storage:** 5x 3.5"/2.5" SATA HDD + 5x M.2 NVMe (Hybrid Tiered Storage, up to 200TB)
- **Networking:** 2x 10GbE + USB4v2 80Gbps
- **Form Factor:** 5-bay AI NAS

**Notes:**
- This is a brand new product announced in 2026, still in pre-launch/pre-order status
- Uses the powerful AMD Ryzen AI Max+ 395 platform with 16 Zen 5 cores
- Hybrid storage architecture with both HDD and NVMe bays
- Dual 10GbE for network connectivity
- Planned software updates: One-Click Permission Control and UPS Protection (end of Q3 2026)
- **This is the first new product found matching all 4 criteria**

---

## Previously Known Match

### Minisforum N5 Pro (AMD Ryzen AI 9 HX PRO 370, 12 cores, 10GbE, 3x M.2 Gen4, 5x HDD bays)

**Source:** ServeTheHome Review (Oct 2025), Minisforum Store
**Price:** $899-$1,439 (varies with RAM/SSD config)

| Criteria | Required | Actual | Status |
|----------|----------|--------|--------|
| CPU Cores | 12+ | 12 cores / 24 threads (AMD Ryzen AI 9 HX PRO 370) | ✅ PASS |
| 10GbE+ | 1x | 1x 10GbE (Marvell AQC113 10Gbase-T) + 1x 5GbE | ✅ PASS |
| M.2 NVMe | 2x PCIe 4.0 x2+ | 3x M.2 NVMe (supports 2280/22110, PCIe 4.0) | ✅ PASS |
| 3.5" SATA | 2x | 5x 3.5" SATA HDD bays | ✅ PASS |

**Full Specs:**
- **CPU:** AMD Ryzen AI 9 HX PRO 370 (12 cores, Zen 5), Radeon iGPU, NPU
- **Memory:** DDR5 (up to 96GB ECC supported)
- **Storage:** 3x M.2 NVMe + 5x 3.5" SATA HDD
- **Networking:** 10GbE (Marvell AQC113) + 5GbE (Realtek RTL8126)
- **Extras:** USB4v2, HDMI, OCuLink, PCIe low-profile slot, external 280W PSU
- **Software:** Beta NAS OS (users report installing Proxmox/TrueNAS)

---

## Products Close But Failing Some Criteria

### QNAP TS-h1290FX ⚠️ Partial Match
**Source:** ServeTheHome Review (Feb 2026)

| Criteria | Required | Actual | Status |
|----------|----------|--------|--------|
| CPU Cores | 12+ | AMD EPYC (configurable, 16/24/32 core options) | ✅ PASS |
| 10GbE+ | 1x | Dual 25GbE SFP28 (Mellanox ConnectX-6) | ✅ PASS |
| M.2 NVMe | 2x PCIe 4.0 x2+ | 0x M.2 (12x U.2 only) | ❌ FAIL |
| 3.5" SATA | 2x | 0x (12x U.2 2.5" only) | ❌ FAIL |

**Notes:** Excellent networking and CPU, but all-flash U.2 only — no 3.5" SATA bays and no M.2 slots. Enterprise all-flash NAS.

---

### Beelink ME Pro ⚠️ Partial Match
**Source:** ServeTheHome Review (Mar 2026)

| Criteria | Required | Actual | Status |
|----------|----------|--------|--------|
| CPU Cores | 12+ | Intel N95 (4 cores / 4 threads) | ❌ FAIL |
| 10GbE+ | 1x | 5GbE (RTL8126) + 2.5GbE (Intel i226) | ❌ FAIL |
| M.2 NVMe | 2x PCIe 4.0 x2+ | 3x M.2 (Gen3 x2 + 2x Gen3 x1) | ❌ FAIL (Gen3) |
| 3.5" SATA | 2x | 2x 3.5" SATA | ✅ PASS |

**Notes:** Ultra-compact entry-level NAS. Only 2 HDD bays (borderline). Fails CPU, networking, and M.2 speed criteria.

---

### QNAP TBS-h574TX ⚠️ Partial Match
**Source:** ServeTheHome Review

| Criteria | Required | Actual | Status |
|----------|----------|--------|--------|
| CPU Cores | 12+ | i3-1320PE (8 cores) or i5-1340PE (12 cores) | ⚠️ EDGE (i5 version) |
| 10GbE+ | 1x | Thunderbolt 4 (no Ethernet mentioned) | ❌ FAIL |
| M.2 NVMe | 2x PCIe 4.0 x2+ | 5x E1.S via M.2 adapters (PCIe Gen3 x2) | ⚠️ Partial (Gen3) |
| 3.5" SATA | 2x | 0x (5x E1.S/2.5" only) | ❌ FAIL |

**Notes:** E1.S form factor is unusual. i5 version has 12 cores but lacks Ethernet and 3.5" bays.

---

## Products That Do Not Match Criteria

### TerraMaster F8-SSD Plus
- **CPU:** Intel Core i3-N305 (6 cores) — FAIL
- **Network:** 1x 10GbE — PASS
- **M.2:** 8x M.2 — PASS
- **HDD Bays:** 0x 3.5" — FAIL
- **Verdict:** All-flash only, insufficient cores

### Asustor Flashstor 12 Pro FS6712X
- **CPU:** Intel Celeron N5105 (4 cores) — FAIL
- **Network:** 1x 10GbE — PASS
- **M.2:** 12x M.2 — PASS
- **HDD Bays:** 0x 3.5" — FAIL
- **Verdict:** All-flash only, insufficient cores

### CWWK X86-P6
- **CPU:** Intel N150 (4 cores) or N355 (8 cores) — FAIL
- **Network:** 2x 2.5GbE — FAIL
- **M.2:** 4x M.2 (Gen3) — FAIL (Gen3)
- **HDD Bays:** 0x 3.5" — FAIL
- **Verdict:** Budget pocket NAS, fails all major criteria

### QNAP TS-1655
- **CPU:** Intel Atom C5125 (~8 cores) — FAIL
- **Network:** 2x 2.5GbE — FAIL
- **M.2:** None internal — FAIL
- **HDD Bays:** 12x 3.5" + 4x 2.5" — PASS
- **Verdict:** Large HDD NAS with expansion options, but no 10GbE or M.2

### Asustor Flashstor 6 FS6706T
- **CPU:** Intel Celeron N5105 (4 cores) — FAIL
- **Network:** 2x 2.5GbE — FAIL
- **M.2:** 6x M.2 — PASS
- **HDD Bays:** 0x 3.5" — FAIL
- **Verdict:** Entry-level all-flash NAS

---

## Sources Checked

### ServeTheHome Storage Category
- Pages 1-20 of https://www.servethehome.com/category/storage/
- Scanned ~100+ articles for NAS-related content
- Keywords searched: NAS, storage server, minisforum, qnap, synology, terramaster, beelink, asustor, thecus

### ASUSTOR Product List
- https://www.asustor.com/en/product/product_list
- Products found: DRIVESTOR 2/4, AS5x0xT, LOCKERSTOR 2/4/6/8/10/12/16 (Gen2/Gen3/Pro), FLASHSTOR 6/12 (Gen2), LOCKERSTOR 12R/16R/24R Pro Gen2, XPANSTOR
- None of the ASUSTOR products in the catalog matched all 4 criteria (most are all-flash or lack sufficient cores/10GbE/M.2 combo)

### Minisforum NAS Collection
- https://www.minisforum.com/collections/nas-series
- Products found: N5, N5 AIR, N5 Pro, **N5 MAX** (new), MS-02 Ultra, MS-S1 Max, MS-R1, MS-A2, MS-01, NAB6/NAB9
- N5 MAX is the new discovery matching all criteria

---

## Summary

**New Products Matching All Criteria (1):**
1. Minisforum N5 MAX AI NAS — 16 cores, dual 10GbE, 5x M.2 NVMe, 5x 3.5" SATA — **$1,439 (pre-launch)**

**Previously Known Match (1):**
1. Minisforum N5 Pro — 12 cores, 10GbE, 3x M.2 NVMe, 5x 3.5" SATA — **$899+**

**Partial Matches (3):**
1. QNAP TS-h1290FX — Has 12+ cores and 25GbE but U.2-only (no 3.5" SATA or M.2)
2. Beelink ME Pro — Has 2x 3.5" SATA bays but only 4-core CPU, no 10GbE
3. QNAP TBS-h574TX — i5 version has 12 cores but no Ethernet or 3.5" SATA bays

**Conclusion:** The Minisforum N5 MAX is a genuinely new find — it is the second Minisforum NAS to match all four criteria. This represents a clear trend of Minisforum dominating the high-core-count, multi-10GbE, hybrid storage NAS segment. The N5 MAX is significantly more powerful than the N5 Pro with 16 vs 12 cores, dual vs single 10GbE, and 5 vs 3 M.2 slots.
