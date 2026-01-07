# MapTool Backend Implementation Plan

## Overview
This document outlines all the MapTool macro functions that need to be implemented to support the Campaign Manager frontend.

## Architecture: Lazy Loading Per Tab
The Campaign Manager uses a **lazy loading architecture** where each tab component loads its own data only when activated. This provides:
- ✅ Faster initial page load (only Party tab loads on startup)
- ✅ Reduced memory usage (unused tabs don't hold data)
- ✅ Better separation of concerns (each component owns its data)
- ✅ Easier to add new tabs (self-contained components)

Components use Vue's `<keep-alive>` to cache loaded data when switching tabs, preventing unnecessary reloads.

---

## 1. Core Data Persistence (Priority: CRITICAL)

### `Utils.getPartyData()`
**Purpose**: Load only party/character data from MapTool storage

**Returns**: 
```javascript
[
  { id: 1, name: "Thaldrin", class: "Fighter", level: 5, hp: { current: 45, max: 52 }, ... }
]
```

**Implementation Notes**:
- Should read from campaign properties: `campaign.manager.party`
- Handle versioning/migration if data structure changes
- Return empty array `[]` if no data exists
- Consider error handling for corrupted data

**Called By**: PartyManager component on mount

---

### `Utils.getEncounterData()`
**Purpose**: Load only encounter data from MapTool storage

**Returns**: 
```javascript
[
  { id: 1, name: "Goblin Ambush", difficulty: "Medium", monsters: [...], ... }
]
```

**Implementation Notes**:
- Should read from campaign properties: `campaign.manager.encounters`
- Return empty array `[]` if no data exists
- Encounters can be large - consider lazy loading monster details

**Called By**: EncounterManager component on mount

---

### `Utils.getLocationData()`
**Purpose**: Load only location data from MapTool storage

**Returns**: 
```javascript
[
  { id: 1, name: "Silverhold City", type: "City", mapName: "...", ... }
]
```

**Implementation Notes**:
- Should read from campaign properties: `campaign.manager.locations`
- Return empty array `[]` if no data exists

**Called By**: LocationManager component on mount

---

### `Utils.savePartyData(party)`
**Purpose**: Save party data to MapTool storage

**Parameters**: 
```javascript
[
  { id: 1, name: "Thaldrin", ... }
]
```

**Implementation Notes**:
- Store as JSON in campaign property: `campaign.manager.party`
- Should be atomic (all or nothing)
- Add error handling and validation
- Consider backup before overwriting

**Called By**: PartyManager when adding characters or updating HP

---

### `Utils.saveEncounterData(encounters)`
**Purpose**: Save encounter data to MapTool storage

**Parameters**: Array of encounter objects

**Implementation Notes**:
- Store in campaign property: `campaign.manager.encounters`
- Validate encounter structure before saving

**Called By**: EncounterManager when adding/deleting encounters

---

### `Utils.saveLocationData(locations)`
**Purpose**: Save location data to MapTool storage

**Parameters**: Array of location objects

**Implementation Notes**:
- Store in campaign property: `campaign.manager.locations`

**Called By**: LocationManager when adding/updating locations

---

### `Utils.getManagerData()` ⚠️ LEGACY
**Purpose**: Load all data at once (backward compatibility)

**Status**: Still supported but not actively used. New architecture loads data per-tab.

---

### `Utils.saveManagerData(data)` ⚠️ LEGACY
**Purpose**: Save all data at once (backward compatibility)

**Status**: Still supported but not actively used. New architecture saves data per-tab.

---

## 2. Party Management (Priority: HIGH)

### `Utils.focusToken(tokenId)`
**Purpose**: Center map view on a specific token

**Parameters**:
- `tokenId` (String) - Unique token identifier

**Implementation Notes**:
- Use MapTool's goto/center functions
- Handle invalid/missing tokens gracefully
- Consider switching to token's current map first
- Should work for both PC and NPC tokens

**Usage Locations**:
- Party Manager: When clicking on a character card
- Location Manager: When selecting a location with a token

---

### `Utils.updateCharacterHP(characterId, hp)`
**Purpose**: Update character HP after adjustment in health modal

**Parameters**:
- `characterId` (Number) - Character's unique ID
- `hp` (Object) - `{ current: Number, max: Number }`

**Implementation Notes**:
- Update the actual token's HP bar/properties
- Trigger any HP-change events (bloodied status, death saves, etc.)
- Update both the stored data AND the token on the map
- Consider logging HP changes for history/audit
- Handle tokens that aren't on current map
- Sync with initiative tracker if active

**Usage Example**:
```javascript
Utils.updateCharacterHP(1, { current: 25, max: 40 });
```

---

### `Utils.saveCharacter(character)` ⚠️ STUB
**Purpose**: Save a newly created character (not currently called)

**Parameters**: Full character object

**Status**: Referenced in comments but not actively used. Character creation currently goes through `saveManagerData()` workflow.

**Future Enhancement**: Could create a token on current map when character is added.

---

## 3. Encounter Management (Priority: HIGH)

### `Utils.loadEncounter(encounterId)`
**Purpose**: Load an encounter's monsters onto the current map

**Parameters**:
- `encounterId` (Number) - Unique encounter identifier

**Implementation Notes**:
- Look up encounter data from storage
- Spawn tokens for all monsters in encounter
- Position them appropriately (grid, group, scatter?)
- Set token properties (HP, AC, name, image)
- Don't auto-start initiative (that's separate)
- Consider asking where to place them (selection area?)

**Example Encounter Data**:
```javascript
{
  id: 1,
  name: "Goblin Ambush",
  monsters: [
    { id: 1, name: "Goblin", cr: "1/4", count: 6 },
    { id: 2, name: "Goblin Boss", cr: "1", count: 1 }
  ]
}
```

---

### `Utils.startEncounter(encounterId)`
**Purpose**: Load encounter AND start initiative tracker

**Parameters**:
- `encounterId` (Number) - Unique encounter identifier

**Implementation Notes**:
- Call `loadEncounter()` first if not already loaded
- Roll initiative for all monsters
- Add PCs to initiative if not already present
- Open/switch to initiative tracker panel
- Sort by initiative order
- Consider advantage/disadvantage options

**Workflow**:
1. Load monsters (if needed)
2. Roll initiative for each monster
3. Gather PC initiatives (or roll for them)
4. Sort initiative order
5. Display initiative tracker
6. Set to round 1

---

### `Utils.deleteEncounter(encounterId)` ℹ️ CLIENT-SIDE
**Status**: Currently handled entirely in frontend

**Future Enhancement**: Could add server-side validation or soft-delete with undo capability

---

## 4. Location Management (Priority: MEDIUM)

### `Utils.loadMap(mapName)`
**Purpose**: Switch to a different map

**Parameters**:
- `mapName` (String) - Name of the map to load

**Implementation Notes**:
- Use MapTool's map switching functionality
- Handle case where map doesn't exist (show error)
- Consider asking for confirmation if unsaved changes
- May need to expose players to new map
- Consider zoom level and camera position

**Usage Example**:
```javascript
Utils.loadMap("Silverhold Map");
```

---

## 5. Missing/TODO Features (Priority: LOW)

These functions are referenced in console.log statements but not implemented:

### Party Manager
- **`makeTokens()`** - Generate tokens for all party members on current map
- **`createPoll()`** - Create a player poll/vote
- **`viewResults()`** - View poll results

### Encounter Manager
- **`editEncounter(encounterId)`** - Open encounter editor dialog
- **`addEncounter()`** - Open create encounter dialog
- **`importEncounter()`** - Import encounter from file/compendium
- **`exportEncounters()`** - Export encounters to file

### Location Manager
- **`addLocation()`** - Create new location
- **`importLocation()`** - Import location data

---

## 6. Recommended Additional Utilities

### `Utils.getTokenList()`
**Purpose**: Get all tokens on current map for linking to characters

**Returns**: Array of token objects with id, name, type

---

### `Utils.createToken(characterData)`
**Purpose**: Create a new token from character data

**Parameters**: Character object with name, image, stats, etc.

**Returns**: Token ID of created token

---

### `Utils.syncPartyFromTokens()`
**Purpose**: Scan map for PC tokens and update party list

**Use Case**: Auto-discover characters when DM adds new players

---

### `Utils.backupData()`
**Purpose**: Create timestamped backup of all manager data

**Returns**: Backup ID or filename

---

## Implementation Priority Order

### Phase 1 - Core (Required for basic functionality)
1. ✅ `getPartyData()` - Load party data (lazy)
2. ✅ `getEncounterData()` - Load encounter data (lazy)
3. ✅ `getLocationData()` - Load location data (lazy)
4. ✅ `savePartyData()` - Save party data
5. ✅ `saveEncounterData()` - Save encounter data
6. ✅ `saveLocationData()` - Save location data
7. ✅ `focusToken()` - Navigate to tokens

### Phase 2 - Combat (Makes encounters usable)
8. 🔲 `loadEncounter()` - Spawn monsters
9. 🔲 `startEncounter()` - Begin combat
10. 🔲 `updateCharacterHP()` - Track damage

### Phase 3 - Navigation (Map management)
11. 🔲 `loadMap()` - Switch maps

### Phase 4 - Enhancement (Nice to have)
12. 🔲 Add/Edit/Import dialogs
13. 🔲 Token creation utilities
14. 🔲 Poll system

---

## Data Storage Recommendations

### Recommended Storage Structure (Per-Tab)

**Campaign Property: `campaign.manager.party`**
```javascript
[
  { id: 1, name: "Thaldrin", class: "Fighter", level: 5, ... },
  { id: 2, name: "Elara", class: "Wizard", level: 5, ... }
]
```

**Campaign Property: `campaign.manager.encounters`**
```javascript
[
  { id: 1, name: "Goblin Ambush", difficulty: "Medium", monsters: [...] },
  { id: 2, name: "Dragon's Lair", difficulty: "Deadly", monsters: [...] }
]
```

**Campaign Property: `campaign.manager.locations`**
```javascript
[
  { id: 1, name: "Silverhold City", type: "City", mapName: "...", ... },
  { id: 2, name: "Shadowfen Swamp", type: "Wilderness", ... }
]
```

### Metadata Tracking (Optional)

**Campaign Property: `campaign.manager.metadata`**
```javascript
{
  version: "1.0",
  lastModified: {
    party: timestamp,
    encounters: timestamp,
    locations: timestamp
  },
  lastBackup: timestamp,
  modifiedBy: "GM Name"
}
```

### Storage Location

**Recommended: Campaign Properties**
- Property names: `campaign.manager.party`, `campaign.manager.encounters`, `campaign.manager.locations`
- Pros: Accessible from anywhere, survives campaign save/load, granular updates
- Cons: Need to manage each property separately

**Alternative: Single Consolidated Property**
- Property name: `campaign.manager.data`
- Store all data in one object
- Pros: Simpler to manage, atomic updates
- Cons: Larger payload, no lazy loading benefits on backend

---

## Error Handling Guidelines

All backend functions should:
1. Validate input parameters
2. Return meaningful error messages
3. Log errors to MapTool chat (GM only)
4. Provide fallback/recovery options
5. Never leave data in inconsistent state

---

## Testing Checklist

For each implemented function:
- [ ] Test with valid data
- [ ] Test with invalid/missing data
- [ ] Test with empty/null values
- [ ] Test concurrent access (if applicable)
- [ ] Test with large datasets
- [ ] Verify no memory leaks
- [ ] Check performance with 20+ party members
- [ ] Verify data persistence across sessions

---

## Migration/Versioning

When data structure changes:
1. Increment version number
2. Write migration function
3. Detect old version on load
4. Auto-migrate with backup
5. Log migration for audit

Example:
```javascript
if (loadedData.version === "1.0") {
  loadedData = migrateV1toV2(loadedData);
}
```

---

## Current Frontend Usage Map

| Component | Frontend Action | Calls Backend | Status |
|-----------|----------------|---------------|--------|
| **PartyManager** | `mounted()` | `getPartyData()` | ⚠️ Required |
| **PartyManager** | `saveData()` | `savePartyData()` | ⚠️ Required |
| **PartyManager** | `selectPartyMember()` | `focusToken()` | ⚠️ Required |
| **PartyManager** | `saveHealthChanges()` | `updateCharacterHP()` | ⚠️ Required |
| **EncounterManager** | `mounted()` | `getEncounterData()` | ⚠️ Required |
| **EncounterManager** | `saveData()` | `saveEncounterData()` | ⚠️ Required |
| **EncounterManager** | `loadEncounter()` | `loadEncounter()` | ⚠️ Required |
| **EncounterManager** | `startEncounter()` | `startEncounter()` | ⚠️ Required |
| **LocationManager** | `mounted()` | `getLocationData()` | ⚠️ Required |
| **LocationManager** | `saveData()` | `saveLocationData()` | ⚠️ Required |
| **LocationManager** | `selectLocation()` | `loadMap()`, `focusToken()` | ⚠️ Required |

---

## Notes

- All async functions should use proper error handling
- Consider rate limiting for save operations
- Implement debouncing for frequent updates
- Add undo/redo support for critical operations
- Consider multi-user scenarios (multiple GMs?)
- Plan for data export/import for campaign sharing
- **NEW**: Each component loads its own data independently (lazy loading)
- **NEW**: Use `keep-alive` in Vue to cache component state when switching tabs
- **NEW**: Backend can optimize by caching frequently accessed data (e.g., party data)
