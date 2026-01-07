// Data Service for Campaign Manager
const DataService = {
    // Load all data at once (legacy, for backward compatibility)
    async loadData() {
        try {
            if (typeof MapTool !== 'undefined') {
                const data = await Utils.getManagerData();
                return {
                    party: data.party || [],
                    encounters: data.encounters || [],
                    locations: data.locations || []
                };
            }
        } catch (error) {
            console.error('Error loading manager data:', error);
        }
        return null;
    },

    // Load only party data
    async loadPartyData() {
        try {
            if (typeof MapTool !== 'undefined') {
                const data = await Utils.getPartyData();
                return data || [];
            }
        } catch (error) {
            console.error('Error loading party data:', error);
        }
        return this.generateMockData().party;
    },

    // Load only encounter data
    async loadEncounterData() {
        try {
            if (typeof MapTool !== 'undefined') {
                const data = await Utils.getEncounterData();
                return data || [];
            }
        } catch (error) {
            console.error('Error loading encounter data:', error);
        }
        return this.generateMockData().encounters;
    },

    // Load only location data
    async loadLocationData() {
        try {
            if (typeof MapTool !== 'undefined') {
                const data = await Utils.getLocationData();
                return data || [];
            }
        } catch (error) {
            console.error('Error loading location data:', error);
        }
        return this.generateMockData().locations;
    },

    // Save party data
    async savePartyData(party) {
        try {
            if (typeof MapTool !== 'undefined') {
                await Utils.savePartyData(party);
                console.log('Party data saved successfully');
                return true;
            }
        } catch (error) {
            console.error('Error saving party data:', error);
        }
        return false;
    },

    // Save encounter data
    async saveEncounterData(encounters) {
        try {
            if (typeof MapTool !== 'undefined') {
                await Utils.saveEncounterData(encounters);
                console.log('Encounter data saved successfully');
                return true;
            }
        } catch (error) {
            console.error('Error saving encounter data:', error);
        }
        return false;
    },

    // Save location data
    async saveLocationData(locations) {
        try {
            if (typeof MapTool !== 'undefined') {
                await Utils.saveLocationData(locations);
                console.log('Location data saved successfully');
                return true;
            }
        } catch (error) {
            console.error('Error saving location data:', error);
        }
        return false;
    },

    // Save all data at once (legacy, for backward compatibility)
    async saveData(data) {
        try {
            if (typeof MapTool !== 'undefined') {
                await Utils.saveManagerData(data);
                console.log('Data saved successfully');
                return true;
            }
        } catch (error) {
            console.error('Error saving manager data:', error);
        }
        return false;
    },

    generateMockData() {
        return {
            party: [
                {
                    id: 1,
                    name: "Thaldrin Ironforge",
                    class: "Fighter",
                    level: 5,
                    avatar: "../assets/tokens/Aesculapian.webp",
                    tokenId: "token-1",
                    ac: 18,
                    initiative: 2,
                    speed: 30,
                    passivePerception: 13,
                    hp: { current: 45, max: 52 }
                },
                {
                    id: 2,
                    name: "Elara Moonwhisper",
                    class: "Wizard",
                    level: 5,
                    avatar: "../assets/tokens/Chitra.webp",
                    tokenId: "token-2",
                    ac: 13,
                    initiative: 3,
                    speed: 30,
                    passivePerception: 14,
                    hp: { current: 28, max: 28 }
                },
                {
                    id: 3,
                    name: "Kael Shadowstep",
                    class: "Rogue",
                    level: 5,
                    avatar: "../assets/tokens/ISRA.webp",
                    tokenId: "token-3",
                    ac: 16,
                    initiative: 4,
                    speed: 30,
                    passivePerception: 18,
                    hp: { current: 15, max: 35 }
                },
                {
                    id: 4,
                    name: "Lyria Dawnbringer",
                    class: "Cleric",
                    level: 5,
                    avatar: "../assets/tokens/Orgotek.webp",
                    tokenId: "token-4",
                    ac: 17,
                    initiative: 1,
                    speed: 25,
                    passivePerception: 16,
                    hp: { current: 40, max: 40 }
                }
            ],
            encounters: [
                {
                    id: 1,
                    name: "Goblin Ambush",
                    difficulty: "Medium",
                    totalXP: 600,
                    adjustedXP: 900,
                    mapName: "Forest Road",
                    monsters: [
                        { id: 1, name: "Goblin", cr: "1/4", type: "Humanoid", count: 6 },
                        { id: 2, name: "Goblin Boss", cr: "1", type: "Humanoid", count: 1 }
                    ]
                },
                {
                    id: 2,
                    name: "Dragon's Lair",
                    difficulty: "Deadly",
                    totalXP: 8400,
                    adjustedXP: 12600,
                    mapName: "Mountain Peak",
                    monsters: [
                        { id: 1, name: "Young Red Dragon", cr: "10", type: "Dragon", count: 1 },
                        { id: 2, name: "Kobold", cr: "1/8", type: "Humanoid", count: 8 }
                    ]
                },
                {
                    id: 3,
                    name: "Undead Horde",
                    difficulty: "Hard",
                    totalXP: 2100,
                    adjustedXP: 3150,
                    mapName: "Graveyard",
                    monsters: [
                        { id: 1, name: "Zombie", cr: "1/4", type: "Undead", count: 10 },
                        { id: 2, name: "Ghoul", cr: "1", type: "Undead", count: 3 },
                        { id: 3, name: "Wraith", cr: "5", type: "Undead", count: 1 }
                    ]
                }
            ],
            locations: [
                {
                    id: 1,
                    name: "Silverhold City",
                    type: "City",
                    description: "A bustling metropolis known for its silver mines and grand marketplace. The city is protected by high walls and patrolled by vigilant guards.",
                    image: "../assets/tokens/AeonTrinity.webp",
                    mapName: "Silverhold Map",
                    region: "Northern Territories",
                    tokenId: "loc-1",
                    discovered: true
                },
                {
                    id: 2,
                    name: "Shadowfen Swamp",
                    type: "Wilderness",
                    description: "A dark and treacherous swamp filled with poisonous plants and dangerous creatures. Local legends speak of ancient ruins hidden deep within.",
                    image: "../assets/tokens/Broken.png",
                    mapName: "Shadowfen",
                    region: "Eastern Marshlands",
                    tokenId: "loc-2",
                    discovered: true
                },
                {
                    id: 3,
                    name: "The Azure Tower",
                    type: "Dungeon",
                    description: "A mysterious wizard's tower that glows with an eerie blue light. It is said to contain powerful magical artifacts and deadly traps.",
                    image: "../assets/tokens/Norca.webp",
                    mapName: "Azure Tower Interior",
                    region: "Arcane Wastes",
                    tokenId: "loc-3",
                    discovered: false
                },
                {
                    id: 4,
                    name: "Tavern of the Dancing Dragon",
                    type: "Tavern",
                    description: "A popular inn and tavern where adventurers gather to share tales and seek employment. The owner, a retired adventurer, has many connections.",
                    image: "../assets/tokens/mother-maw-token.png",
                    mapName: "Tavern Interior",
                    region: "Silverhold City",
                    tokenId: "loc-4",
                    discovered: true
                },
                {
                    id: 5,
                    name: "Dragonspire Mountain",
                    type: "Landmark",
                    description: "The highest peak in the region, rumored to be the lair of an ancient dragon. Few who venture there return to tell the tale.",
                    image: "../assets/tokens/sub-aberrant-mutant.png",
                    mapName: "Mountain Peak",
                    region: "Northern Territories",
                    tokenId: "loc-5",
                    discovered: false
                }
            ]
        };
    }
};
