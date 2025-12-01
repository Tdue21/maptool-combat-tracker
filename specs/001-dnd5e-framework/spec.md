# Feature Specification: D&D 5e Framework for MapTool

**Feature Branch**: `001-dnd5e-framework`  
**Created**: 2025-12-01  
**Status**: Draft  
**Input**: User description: "Build a set of add-on libraries for MapTool that encompasses a complete and thorough framework for use with Dungeons & Dragons 5th edition."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Character Creation and Management (Priority: P1)

A Game Master or player needs to create a D&D 5e character from scratch, selecting race, class, background, and abilities, with all mechanics automatically calculated according to 5e rules.

**Why this priority**: Character management is the foundational element of any D&D campaign. Without working characters, no other game mechanics can function. This is the minimum viable product.

**Independent Test**: Can be fully tested by creating a character through the UI, verifying all ability scores, modifiers, proficiencies, and saving throws are correctly calculated, and persisting the character data. Delivers immediate value by eliminating manual calculations.

**Acceptance Scenarios**:

1. **Given** a new character creation form, **When** a player selects race (e.g., Dwarf), class (e.g., Fighter), and rolls/assigns ability scores, **Then** the system automatically calculates racial ability bonuses, skill proficiencies, saving throw proficiencies, hit points, and armor class
2. **Given** an existing character, **When** the player gains a level, **Then** the system prompts for level-up choices (hit points, class features, spell selections if applicable) and updates all derived statistics
3. **Given** a character with equipment, **When** armor or weapons are equipped/unequipped, **Then** AC and attack bonuses automatically update based on proficiency and ability modifiers

---

### User Story 2 - Combat Initiative and Turn Tracking (Priority: P1)

The Game Master needs to manage combat encounters by tracking initiative order, current turn, hit points, and conditions for all participants (player characters, NPCs, and monsters).

**Why this priority**: Combat is a core D&D activity. Initiative tracking is essential for smooth gameplay and is the second most critical feature after characters exist.

**Independent Test**: Can be tested by starting an encounter with multiple tokens, rolling initiative, tracking turn order, applying damage, and applying/removing conditions. Delivers immediate value by eliminating manual initiative tracking.

**Acceptance Scenarios**:

1. **Given** multiple character and monster tokens on the map, **When** the GM initiates combat, **Then** initiative is rolled for all participants (with dexterity bonuses applied), sorted in descending order, and displayed in a tracker
2. **Given** an active combat encounter, **When** the current turn ends, **Then** the tracker advances to the next participant, highlights their token, and displays relevant information (HP, conditions, available actions)
3. **Given** a combatant with ongoing conditions (e.g., poisoned, blessed), **When** their turn begins, **Then** the tracker displays active conditions and prompts for concentration checks if applicable

---

### User Story 3 - Dice Rolling with Modifiers (Priority: P1)

Players and GMs need to roll dice for various checks (ability checks, saving throws, attack rolls, damage) with appropriate modifiers automatically applied.

**Why this priority**: Dice rolling is fundamental to D&D gameplay and must integrate with character statistics. This completes the minimum viable product for basic play.

**Independent Test**: Can be tested by clicking roll buttons for different check types and verifying correct modifiers are applied from character sheet data. Delivers value by ensuring accuracy and saving time.

**Acceptance Scenarios**:

1. **Given** a character sheet, **When** a player clicks "Strength Saving Throw", **Then** the system rolls 1d20, adds the character's Strength modifier and proficiency bonus (if proficient), and displays the result
2. **Given** an attack action, **When** a player rolls to attack, **Then** the system rolls 1d20 + relevant ability modifier + proficiency bonus, compares to target AC, and indicates hit/miss
3. **Given** advantage or disadvantage on a roll, **When** the dice are rolled, **Then** the system rolls 2d20 and automatically selects the higher (advantage) or lower (disadvantage) result

---

### User Story 4 - Spell Management and Casting (Priority: P2)

Spellcasting characters need to manage their known/prepared spells, spell slots, and cast spells with appropriate effects and saving throws.

**Why this priority**: Essential for spellcasting classes but not required for martial classes. Can be developed after core mechanics are working.

**Independent Test**: Can be tested by creating a spellcaster, preparing spells, casting them with resource tracking, and verifying spell effects are applied correctly.

**Acceptance Scenarios**:

1. **Given** a spellcasting character, **When** they prepare spells at the start of a day, **Then** they can select a number of spells equal to their class formula (e.g., Intelligence modifier + Wizard level), and all spell slots are reset
2. **Given** a prepared spell, **When** the player casts it, **Then** an appropriate spell slot is consumed, spell save DC is calculated from character stats, and targets can make saving throws if applicable
3. **Given** a spell with ongoing effects (concentration), **When** the caster takes damage, **Then** a concentration check (DC = 10 or half damage, whichever is higher) is automatically prompted

---

### User Story 5 - Monster/NPC Stat Blocks (Priority: P2)

The Game Master needs to quickly reference and use official D&D 5e monster statistics during encounters.

**Why this priority**: Important for GM efficiency but GMs can manually track monsters if needed initially. Enhances the experience after core PC mechanics work.

**Independent Test**: Can be tested by spawning monster tokens with full stat blocks, rolling their attacks/saves, and tracking their resources independently of PCs.

**Acceptance Scenarios**:

1. **Given** a monster library, **When** the GM searches for a creature (e.g., "Goblin"), **Then** the full stat block is displayed with abilities, actions, reactions, and legendary actions if applicable
2. **Given** a monster token in combat, **When** the GM clicks an attack action, **Then** the attack roll is made with correct modifiers and damage is rolled automatically
3. **Given** a monster with limited-use abilities (e.g., "Recharge 5-6"), **When** the ability is used, **Then** the system tracks usage and automatically rolls for recharge at the start of the monster's turn

---

### User Story 6 - Inventory and Equipment Management (Priority: P3)

Players need to track their character's inventory, equipment, currency, and encumbrance according to 5e rules.

**Why this priority**: Important for campaign management but not critical for immediate gameplay. Can be manually tracked initially.

**Independent Test**: Can be tested by adding/removing items, tracking weight, and verifying encumbrance penalties are applied when carrying capacity is exceeded.

**Acceptance Scenarios**:

1. **Given** a character inventory, **When** items are added or removed, **Then** total weight is calculated and compared against carrying capacity (Strength × 15 lbs)
2. **Given** magical items, **When** they are attuned, **Then** the system enforces the 3-attunement limit and tracks active magical effects
3. **Given** currency of different types, **When** transactions occur, **Then** the system can automatically convert between copper, silver, gold, and platinum pieces

---

### User Story 7 - Rest and Resource Recovery (Priority: P3)

Characters need to take short and long rests to recover hit points, spell slots, and limited-use abilities.

**Why this priority**: Important for campaign pacing but GMs can manage manually. Enhances automation after core mechanics are solid.

**Independent Test**: Can be tested by triggering rest actions and verifying correct resources are recovered based on rest type and class features.

**Acceptance Scenarios**:

1. **Given** a short rest, **When** initiated by a player, **Then** the character can spend hit dice to recover HP (rolling hit die + Constitution modifier) and certain abilities recharge
2. **Given** a long rest, **When** completed (8 hours), **Then** the character recovers all HP, regains half of spent hit dice (minimum 1), recovers all spell slots, and resets daily abilities
3. **Given** a character with exhaustion levels, **When** completing a long rest, **Then** exhaustion is reduced by one level

---

### User Story 8 - Conditions and Status Effects (Priority: P2)

The system needs to track D&D 5e conditions (blinded, charmed, frightened, etc.) and apply their mechanical effects automatically.

**Why this priority**: Critical for combat accuracy but can be manually tracked initially. Important for quality gameplay experience.

**Independent Test**: Can be tested by applying various conditions to tokens and verifying mechanical effects (advantage/disadvantage, movement restrictions) are enforced.

**Acceptance Scenarios**:

1. **Given** a character or monster, **When** the "frightened" condition is applied, **Then** the affected creature has disadvantage on ability checks and attack rolls while the source of fear is in sight
2. **Given** multiple conditions on a creature, **When** displayed, **Then** all active conditions are shown with tooltips explaining their effects
3. **Given** a condition with a duration, **When** the specified duration expires, **Then** the condition is automatically removed

---

### Edge Cases

- What happens when a character multiclasses into spellcasting classes with different spellcasting ability modifiers?
- How does the system handle homebrew races, classes, or abilities added by the GM?
- What happens when ability scores are modified temporarily by spells or effects (e.g., Enhance Ability, Reduce)?
- How are legendary resistances tracked when a creature uses them?
- What happens if a character attempts to attune to more than 3 magical items?
- How does the system handle death saving throws and stabilization?
- What happens when a creature is polymorphed or wild-shaped (separate HP pool, different abilities)?
- How are hit point maximum changes tracked (e.g., from life drain effects)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support character creation for all official D&D 5e races from the Player's Handbook (Dwarf, Elf, Halfling, Human, Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling) with correct racial traits and ability score increases
- **FR-002**: System MUST support all D&D 5e classes from the Player's Handbook (Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard) with class features gained at appropriate levels
- **FR-003**: System MUST automatically calculate ability modifiers, saving throw bonuses, skill check bonuses, initiative bonuses, armor class, and attack bonuses based on character data
- **FR-004**: System MUST support the six D&D 5e ability scores (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) with standard array, point buy, or dice rolling generation methods
- **FR-005**: System MUST track character hit points, temporary hit points, hit dice, and damage taken
- **FR-006**: System MUST support initiative tracking with automatic sorting, turn advancement, and visual indication of the active combatant
- **FR-007**: System MUST apply D&D 5e condition mechanics (blinded, charmed, deafened, frightened, grappled, incapacitated, invisible, paralyzed, petrified, poisoned, prone, restrained, stunned, unconscious) with appropriate mechanical effects
- **FR-008**: System MUST track spell slots, spell preparation, and spell casting for all spellcasting classes with correct spell save DC and spell attack bonus calculations
- **FR-009**: System MUST support advantage and disadvantage mechanics on all d20 rolls (ability checks, saving throws, attack rolls)
- **FR-010**: System MUST include a monster library with statistics for commonly used D&D 5e creatures
- **FR-011**: System MUST support proficiency bonus progression according to character level (starting at +2 at level 1, increasing to +6 at level 20)
- **FR-012**: System MUST track equipment, inventory, weight, and carrying capacity with encumbrance rules
- **FR-013**: System MUST support short rest and long rest mechanics with appropriate resource recovery
- **FR-014**: System MUST track currency in copper, silver, electrum, gold, and platinum pieces
- **FR-015**: System MUST support death saving throws with automatic tracking of successes and failures
- **FR-016**: System MUST support magical item attunement with the 3-item limit
- **FR-017**: System MUST calculate multiclass character statistics correctly, including spell slot progression for multiclass spellcasters
- **FR-018**: System MUST support backgrounds with skill proficiencies, tool proficiencies, and starting equipment
- **FR-019**: System MUST track experience points and level advancement
- **FR-020**: System MUST support feats as optional character improvements
- **FR-021**: System MUST provide dice roller functionality for all standard polyhedral dice (d4, d6, d8, d10, d12, d20, d100) with modifier support
- **FR-022**: System MUST display character sheet information in a readable, organized format following D&D 5e conventions
- **FR-023**: System MUST persist character data between MapTool sessions
- **FR-024**: System MUST support GM tools for managing encounters, including adding/removing combatants and adjusting initiative order
- **FR-025**: System MUST validate character creation choices against D&D 5e rules (e.g., class/race restrictions, prerequisite checks for multiclassing)

### Key Entities

- **Character**: Represents a player character or NPC with full D&D 5e statistics including race, class(es), level(s), ability scores, skills, feats, equipment, spells, and current state (HP, conditions, resources)
- **Monster**: Represents a creature from D&D 5e monster manual with stat block including abilities, attacks, special abilities, legendary actions, and lair actions
- **Spell**: Represents a D&D 5e spell with level, school, casting time, range, components, duration, and description of effects
- **Item**: Represents equipment or treasure with properties including name, type, weight, cost, magical properties, and attunement requirements
- **Condition**: Represents a D&D 5e status effect with name, mechanical effects, and duration tracking
- **Combat Encounter**: Represents an active combat with participants in initiative order, current turn, round counter, and encounter-specific state
- **Campaign**: Represents a game session with persistent character data, world state, and GM settings

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can create a complete, rules-compliant D&D 5e character from level 1 through level 20 in under 10 minutes using the interface
- **SC-002**: All ability checks, saving throws, and attack rolls are automatically calculated with correct modifiers without manual lookup
- **SC-003**: Combat encounters with 6 participants are managed smoothly with initiative tracking, turn advancement, and condition tracking without manual record-keeping
- **SC-004**: Spell slot consumption and spell save DC calculations are 100% accurate according to D&D 5e rules
- **SC-005**: The system correctly handles multiclass characters with accurate proficiency bonus, hit points, and spell slot calculations
- **SC-006**: 95% of common D&D 5e monsters are available in the monster library with complete, accurate stat blocks
- **SC-007**: Character data persists between sessions with zero data loss
- **SC-008**: GMs can spawn and manage monster tokens in combat with full stat block functionality in under 30 seconds per monster
- **SC-009**: Players report that gameplay is faster and smoother compared to manual character sheet management (measured by user feedback survey)
- **SC-010**: The system reduces rules lookup time by at least 70% during typical gameplay sessions (measured by session duration comparison)

## Assumptions

- The framework will initially support content from the D&D 5e Player's Handbook; additional sourcebooks (Xanathar's Guide, Tasha's Cauldron, etc.) can be added in future iterations
- Standard D&D 5e rules are used; variant rules (such as flanking, feats as optional) will have toggle settings
- Character data is stored per MapTool campaign and is not shared between campaigns
- The GM has final authority to override any automated calculations or rules
- Monster stat blocks will be based on official D&D 5e sources; homebrew monsters can be added via custom entries
- The system assumes basic familiarity with D&D 5e rules; it assists with calculations but doesn't teach the rules
- Visual design follows MapTool's existing add-on conventions and integrates with the existing combat tracker UI
- All dice rolls are visible to appropriate participants (GM sees all rolls, players see their own and public rolls)
- Network play through MapTool's built-in networking is supported using MapTool's standard token synchronization

## Out of Scope

- Automated battlemap terrain effects and line-of-sight calculations (handled by MapTool's built-in features)
- Integration with D&D Beyond or other third-party character management tools
- Automated encounter balancing or CR calculation tools
- Campaign narrative tracking or quest log functionality
- Voice/video chat integration (players use external tools)
- Homebrew class creation tools (GMs can manually create homebrew content)
- Advanced automation of complex spell effects that require GM adjudication
- Licensed artwork or copyrighted descriptive text from official D&D books
- Support for previous D&D editions (3.5e, 4e) or other game systems
