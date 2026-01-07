// Party Manager Component
const PartyManager = {
    name: 'PartyManager',
    data() {
        return {
            partyData: [],
            viewMode: 'cards',
            showAddCharacterModal: false,
            showHealthModal: false,
            editingMember: null,
            healthEdit: {
                adjustment: 0,
                currentHP: 0,
                maxHP: 0
            },
            newCharacter: {
                name: '',
                class: '',
                level: 1,
                ac: 10,
                initiative: 0,
                speed: 30,
                passivePerception: 10,
                maxHP: 10,
                currentHP: 10,
                avatar: '../assets/tokens/default.webp'
            }
        };
    },
    methods: {
        formatModifier(value) {
            return value >= 0 ? `+${value}` : `${value}`;
        },
        getHPPercentage(member) {
            if (!member.hp || member.hp.max === 0) return 0;
            return Math.max(0, Math.min(100, (member.hp.current / member.hp.max) * 100));
        },
        getHPClass(member) {
            const percentage = this.getHPPercentage(member);
            if (percentage > 60) return 'healthy';
            if (percentage > 30) return 'injured';
            return 'critical';
        },
        selectPartyMember(member) {
            if (typeof MapTool !== 'undefined') {
                Utils.focusToken(member.tokenId);
            }
            console.log('Selected party member:', member.name);
        },
        openHealthModal(member, event) {
            event.stopPropagation();
            this.editingMember = member;
            this.healthEdit = {
                adjustment: 0,
                currentHP: member.hp.current,
                maxHP: member.hp.max
            };
            this.showHealthModal = true;
        },
        closeHealthModal() {
            this.showHealthModal = false;
            this.editingMember = null;
            this.healthEdit = { adjustment: 0, currentHP: 0, maxHP: 0 };
        },
        applyHeal() {
            const adjustment = parseInt(this.healthEdit.adjustment) || 0;
            if (adjustment > 0) {
                this.healthEdit.currentHP = Math.min(
                    this.healthEdit.currentHP + adjustment,
                    this.healthEdit.maxHP
                );
                this.saveHealthChanges();
            }
        },
        applyDamage() {
            const adjustment = parseInt(this.healthEdit.adjustment) || 0;
            if (adjustment > 0) {
                this.healthEdit.currentHP = Math.max(
                    this.healthEdit.currentHP - adjustment,
                    0
                );
                this.saveHealthChanges();
            }
        },
        async saveHealthChanges() {
            if (this.editingMember) {
                this.editingMember.hp.current = parseInt(this.healthEdit.currentHP);
                this.editingMember.hp.max = parseInt(this.healthEdit.maxHP);
                
                if (typeof MapTool !== 'undefined') {
                    Utils.updateCharacterHP(this.editingMember.id, this.editingMember.hp);
                }
            }
            this.closeHealthModal();
        },
        addCharacter() {
            this.showAddCharacterModal = true;
        },
        closeAddCharacterModal() {
            this.showAddCharacterModal = false;
            this.resetCharacterForm();
        },
        resetCharacterForm() {
            this.newCharacter = {
                name: '',
                class: '',
                level: 1,
                ac: 10,
                initiative: 0,
                speed: 30,
                passivePerception: 10,
                maxHP: 10,
                currentHP: 10,
                avatar: '../assets/tokens/default.webp'
            };
        },
        async saveCharacter() {
            if (!this.newCharacter.name || !this.newCharacter.class) {
                alert('Please fill in at least the name and class fields.');
                return;
            }

            const character = {
                id: this.party.length > 0 ? Math.max(...this.party.map(p => p.id)) + 1 : 1,
                name: this.newCharacter.name,
                class: this.newCharacter.class,
                level: this.newCharacter.level,
                avatar: this.newCharacter.avatar,
                tokenId: `token-${Date.now()}`,
                ac: this.newCharacter.ac,
                initiative: this.newCharacter.initiative,
                speed: this.newCharacter.speed,
                passivePerception: this.newCharacter.passivePerception,
                hp: {
                    current: this.newCharacter.currentHP,
                    max: this.newCharacter.maxHP
                }
            };

            this.partyData.push(character);
            await this.saveData();
            this.closeAddCharacterModal();
        },
        async saveData() {
            await DataService.savePartyData(this.partyData);
        },
        async loadData() {
            this.partyData = await DataService.loadPartyData();
        },
        makeTokens() {
            console.log('Making tokens for party members');
            // TODO: Implement make tokens functionality
        },
        createPoll() {
            console.log('Creating poll');
            // TODO: Open create poll dialog
        },
        viewResults() {
            console.log('Viewing poll results');
            // TODO: Open results view
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
                    <button class="command-btn" @click="addCharacter">Add Character</button>
                    <button class="command-btn" @click="makeTokens">Make Tokens</button>
                    <button class="command-btn" @click="createPoll">Create Poll</button>
                    <button class="command-btn" @click="viewResults">Results</button>
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
            <div v-if="viewMode === 'cards' && partyData.length > 0" class="party-grid">
                <div class="party-member-card" v-for="member in partyData" :key="member.id" @click="selectPartyMember(member)">
                    <div class="party-member-header">
                        <img :src="member.avatar" :alt="member.name" class="party-member-avatar">
                        <div class="party-member-info">
                            <div class="party-member-name">{{ member.name }}</div>
                            <div class="party-member-class">{{ member.class }} {{ member.level }}</div>
                        </div>
                    </div>
                    <div class="party-member-stats">
                        <div class="stat-item">
                            <span class="stat-label">AC</span>
                            <span class="stat-value">{{ member.ac }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Initiative</span>
                            <span class="stat-value">{{ formatModifier(member.initiative) }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Speed</span>
                            <span class="stat-value">{{ member.speed }} ft</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Passive Perception</span>
                            <span class="stat-value">{{ member.passivePerception }}</span>
                        </div>
                        <div class="hp-display" @click="openHealthModal(member, $event)" style="cursor: pointer;" title="Click to adjust HP">
                            <div class="stat-item" style="border: none; background: none; padding: 0;">
                                <span class="stat-label">Hit Points</span>
                                <span class="stat-value">{{ member.hp.current }} / {{ member.hp.max }}</span>
                            </div>
                            <div class="hp-bar-container">
                                <div class="hp-bar" :class="getHPClass(member)" :style="{ width: getHPPercentage(member) + '%' }"></div>
                                <div class="hp-text">{{ member.hp.current }} / {{ member.hp.max }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table View -->
            <div v-if="viewMode === 'table' && partyData.length > 0">
                <table class="party-table">
                    <thead>
                        <tr>
                            <th class="avatar-cell"></th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Level</th>
                            <th>AC</th>
                            <th>Initiative</th>
                            <th>Speed</th>
                            <th>Perception</th>
                            <th class="hp-cell">Hit Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="member in partyData" :key="member.id" @click="selectPartyMember(member)">
                            <td class="avatar-cell">
                                <img :src="member.avatar" :alt="member.name" class="table-avatar">
                            </td>
                            <td class="name-cell">{{ member.name }}</td>
                            <td class="class-cell">{{ member.class }}</td>
                            <td>{{ member.level }}</td>
                            <td>{{ member.ac }}</td>
                            <td>{{ formatModifier(member.initiative) }}</td>
                            <td>{{ member.speed }} ft</td>
                            <td>{{ member.passivePerception }}</td>
                            <td class="hp-cell" @click="openHealthModal(member, $event)" style="cursor: pointer;" title="Click to adjust HP">
                                <div class="hp-inline">
                                    <div class="hp-bar-small">
                                        <div class="hp-bar-fill" :class="getHPClass(member)" :style="{ width: getHPPercentage(member) + '%' }"></div>
                                    </div>
                                    <span class="hp-value">{{ member.hp.current }}/{{ member.hp.max }}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-if="partyData.length === 0">
                <h3>No Party Members</h3>
                <p>Add party members to track their stats and status.</p>
            </div>

            <!-- Add Character Modal -->
            <div v-if="showAddCharacterModal" class="modal-overlay" @click.self="closeAddCharacterModal">
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Add New Character</h2>
                        <button class="modal-close" @click="closeAddCharacterModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-input" v-model="newCharacter.name" placeholder="Character name">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Class</label>
                                <input type="text" class="form-input" v-model="newCharacter.class" placeholder="Fighter, Wizard, etc.">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Level</label>
                                <input type="number" class="form-input" v-model.number="newCharacter.level" min="1" max="20" placeholder="1-20">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Armor Class</label>
                                <input type="number" class="form-input" v-model.number="newCharacter.ac" min="1" placeholder="AC">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Initiative Modifier</label>
                                <input type="number" class="form-input" v-model.number="newCharacter.initiative" placeholder="+0">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Speed (ft)</label>
                                <input type="number" class="form-input" v-model.number="newCharacter.speed" min="0" placeholder="30">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Passive Perception</label>
                                <input type="number" class="form-input" v-model.number="newCharacter.passivePerception" min="1" placeholder="10">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Max HP</label>
                                <input type="number" class="form-input" v-model.number="newCharacter.maxHP" min="1" placeholder="Max HP">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Current HP</label>
                                <input type="number" class="form-input" v-model.number="newCharacter.currentHP" min="0" placeholder="Current HP">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Avatar URL</label>
                            <input type="text" class="form-input" v-model="newCharacter.avatar" placeholder="../assets/tokens/avatar.webp">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn modal-btn-secondary" @click="closeAddCharacterModal">Cancel</button>
                        <button class="modal-btn modal-btn-primary" @click="saveCharacter">Add Character</button>
                    </div>
                </div>
            </div>

            <!-- Health Modal -->
            <div v-if="showHealthModal" class="modal-overlay" @click.self="closeHealthModal">
                <div class="modal" style="max-width: 400px;">
                    <div class="modal-header">
                        <h2 class="modal-title">Adjust Health</h2>
                        <button class="modal-close" @click="closeHealthModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="editingMember" style="text-align: center; margin-bottom: 20px;">
                            <h3 style="margin: 0 0 5px 0; color: var(--foreground-color);">{{ editingMember.name }}</h3>
                            <p style="margin: 0; opacity: 0.7; color: var(--foreground-color);">{{ editingMember.class }} {{ editingMember.level }}</p>
                        </div>

                        <!-- HP Adjustment Section -->
                        <div class="form-group">
                            <button class="modal-btn modal-btn-primary" @click="applyHeal" style="width: 100%; margin-bottom: 10px;">
                                <i class="fas fa-heart"></i> HEAL
                            </button>
                            <label class="form-label">HP Adjustment</label>
                            <input type="number" class="form-input" v-model.number="healthEdit.adjustment" min="0" placeholder="Amount to heal or damage">
                            <button class="modal-btn" @click="applyDamage" style="width: 100%; margin-top: 10px; background-color: #dc3545; color: white;">
                                <i class="fas fa-skull-crossbones"></i> DAMAGE
                            </button>
                        </div>

                        <hr style="border: none; border-top: 1px solid var(--header-bg); margin: 20px 0;">

                        <!-- Manual HP Editing -->
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Current HP</label>
                                <input type="number" class="form-input" v-model.number="healthEdit.currentHP" min="0" :max="healthEdit.maxHP">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max HP</label>
                                <input type="number" class="form-input" v-model.number="healthEdit.maxHP" min="1">
                            </div>
                        </div>

                        <!-- HP Preview -->
                        <div style="margin-top: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-weight: bold; color: var(--foreground-color);">Preview:</span>
                                <span style="font-weight: bold; color: var(--foreground-color);">{{ healthEdit.currentHP }} / {{ healthEdit.maxHP }}</span>
                            </div>
                            <div class="hp-bar-container">
                                <div class="hp-bar" :class="getHPClass({ hp: { current: healthEdit.currentHP, max: healthEdit.maxHP } })" 
                                     :style="{ width: ((healthEdit.currentHP / healthEdit.maxHP) * 100) + '%' }"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn modal-btn-secondary" @click="closeHealthModal">Cancel</button>
                        <button class="modal-btn modal-btn-primary" @click="saveHealthChanges">OK</button>
                    </div>
                </div>
            </div>
        </div>
    `
};
