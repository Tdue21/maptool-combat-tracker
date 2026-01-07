// Encounter Manager Component
const EncounterManager = {
    name: 'EncounterManager',
    data() {
        return {
            encounterData: [],
            viewMode: 'cards'
        };
    },
    methods: {
        loadEncounter(encounter) {
            if (typeof MapTool !== 'undefined') {
                Utils.loadEncounter(encounter.id);
            }
            console.log('Loading encounter:', encounter.name);
        },
        startEncounter(encounter) {
            if (typeof MapTool !== 'undefined') {
                Utils.startEncounter(encounter.id);
            }
            console.log('Starting encounter:', encounter.name);
        },
        editEncounter(encounter) {
            console.log('Editing encounter:', encounter.name);
            // TODO: Open edit dialog
        },
        async deleteEncounter(encounter) {
            if (confirm(`Delete encounter "${encounter.name}"?`)) {
                const index = this.encounterData.findIndex(e => e.id === encounter.id);
                if (index !== -1) {
                    this.encounterData.splice(index, 1);
                    this.saveData();
                }
            }
        },
        addEncounter() {
            console.log('Adding new encounter');
            // TODO: Open add encounter dialog
        },
        importEncounter() {
            console.log('Importing encounter');
            // TODO: Open import encounter dialog
        },
        exportEncounters() {
            console.log('Exporting encounters');
            // TODO: Implement export encounters functionality
        },
        async saveData() {
            await DataService.saveEncounterData(this.encounterData);
        },
        async loadData() {
            this.encounterData = await DataService.loadEncounterData();
        }
    },
    mounted() {
        this.loadData();
    },
    template: `
        <div>
            <!-- View Toggle -->
            <div class="view-toggle-container">
                <div class="command-buttons">
                    <button class="command-btn" @click="addEncounter">Add Encounter</button>
                    <button class="command-btn" @click="importEncounter">Import</button>
                    <button class="command-btn" @click="exportEncounters">Export</button>
                </div>
                <div class="toggle-switch">
                    <div class="toggle-option" :class="{ active: viewMode === 'cards' }" @click="viewMode = 'cards'" title="Cards View">
                        <i class="fas fa-grip"></i>
                    </div>
                    <div class="toggle-option" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'" title="Table View">
                        <i class="fas fa-list"></i>
                    </div>
                </div>
            </div>

            <!-- Cards View -->
            <div v-if="viewMode === 'cards' && encounterData.length > 0" class="encounter-list">
                <div class="encounter-card" v-for="encounter in encounterData" :key="encounter.id">
                    <div class="encounter-header">
                        <div class="encounter-title">{{ encounter.name }}</div>
                        <div class="encounter-difficulty" :class="'difficulty-' + encounter.difficulty.toLowerCase()">
                            {{ encounter.difficulty }}
                        </div>
                    </div>
                    <div class="encounter-info">
                        <span><strong>Total XP:</strong> {{ encounter.totalXP }}</span>
                        <span><strong>Adjusted XP:</strong> {{ encounter.adjustedXP }}</span>
                        <span><strong>Map:</strong> {{ encounter.mapName || 'Not set' }}</span>
                    </div>
                    <div class="encounter-monsters">
                        <div class="monster-item" v-for="monster in encounter.monsters" :key="monster.id">
                            <div>
                                <div class="monster-name">{{ monster.name }}</div>
                                <div class="monster-stats">CR {{ monster.cr }} • {{ monster.type }}</div>
                            </div>
                            <div class="monster-count">×{{ monster.count }}</div>
                        </div>
                    </div>
                    <div class="encounter-actions">
                        <button class="action-button" @click="loadEncounter(encounter)">Load to Map</button>
                        <button class="action-button" @click="startEncounter(encounter)">Start Initiative</button>
                        <button class="action-button" @click="editEncounter(encounter)">Edit</button>
                        <button class="action-button" @click="deleteEncounter(encounter)">Delete</button>
                    </div>
                </div>
            </div>

            <!-- Table View -->
            <div v-if="viewMode === 'table' && encounterData.length > 0">
                <table class="encounter-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Difficulty</th>
                            <th>Total XP</th>
                            <th>Adjusted XP</th>
                            <th>Map</th>
                            <th>Monsters</th>
                            <th class="actions-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="encounter in encounterData" :key="encounter.id">
                            <td class="name-cell">{{ encounter.name }}</td>
                            <td class="difficulty-cell">
                                <span :class="'difficulty-' + encounter.difficulty.toLowerCase()" style="padding: 4px 12px; border-radius: 12px;">
                                    {{ encounter.difficulty }}
                                </span>
                            </td>
                            <td>{{ encounter.totalXP }}</td>
                            <td>{{ encounter.adjustedXP }}</td>
                            <td>{{ encounter.mapName || 'Not set' }}</td>
                            <td>{{ encounter.monsters.length }} type(s)</td>
                            <td class="actions-cell">
                                <button class="action-btn-small" @click="loadEncounter(encounter)" title="Load to Map">Load</button>
                                <button class="action-btn-small" @click="startEncounter(encounter)" title="Start Initiative">Start</button>
                                <button class="action-btn-small" @click="editEncounter(encounter)" title="Edit">Edit</button>
                                <button class="action-btn-small" @click="deleteEncounter(encounter)" title="Delete">Del</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-if="encounterData.length === 0">
                <h3>No Encounters Prepared</h3>
                <p>Create encounters to quickly load monsters onto the map.</p>
            </div>
        </div>
    `
};
