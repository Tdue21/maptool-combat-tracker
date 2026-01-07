// Location Manager Component
const LocationManager = {
    name: 'LocationManager',
    data() {
        return {
            locationData: [],
            viewMode: 'cards'
        };
    },
    methods: {
        selectLocation(location) {
            if (typeof MapTool !== 'undefined') {
                Utils.loadMap(location.mapName);
                if (location.tokenId) {
                    Utils.focusToken(location.tokenId);
                }
            }
            console.log('Selected location:', location.name);
        },
        addLocation() {
            console.log('Adding new location');
            // TODO: Open add location dialog
        },
        importLocation() {
            console.log('Importing location');
            // TODO: Open import location dialog
        },
        async saveData() {
            await DataService.saveLocationData(this.locationData);
        },
        async loadData() {
            this.locationData = await DataService.loadLocationData();
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
                    <button class="command-btn" @click="addLocation">Add Location</button>
                    <button class="command-btn" @click="importLocation">Import</button>
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
            <div v-if="viewMode === 'cards' && locationData.length > 0" class="location-grid">
                <div class="location-card" v-for="location in locationData" :key="location.id" @click="selectLocation(location)">
                    <img :src="location.image" :alt="location.name" class="location-image">
                    <div class="location-body">
                        <div class="location-name">{{ location.name }}</div>
                        <div class="location-type">{{ location.type }}</div>
                        <div class="location-description">{{ location.description }}</div>
                        <div class="location-details">
                            <div class="location-detail-item" v-if="location.mapName">
                                <span class="detail-label">Map:</span>
                                <span class="detail-value">{{ location.mapName }}</span>
                            </div>
                            <div class="location-detail-item" v-if="location.region">
                                <span class="detail-label">Region:</span>
                                <span class="detail-value">{{ location.region }}</span>
                            </div>
                            <div class="location-detail-item" v-if="location.discovered !== undefined">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value">{{ location.discovered ? 'Discovered' : 'Undiscovered' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table View -->
            <div v-if="viewMode === 'table' && locationData.length > 0">
                <table class="location-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Region</th>
                            <th>Map</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="location in locationData" :key="location.id" @click="selectLocation(location)">
                            <td class="name-cell">{{ location.name }}</td>
                            <td><span class="type-badge">{{ location.type }}</span></td>
                            <td>{{ location.description }}</td>
                            <td>{{ location.region || '-' }}</td>
                            <td>{{ location.mapName || '-' }}</td>
                            <td>
                                <span v-if="location.discovered !== undefined" 
                                      class="status-badge" 
                                      :class="location.discovered ? 'status-discovered' : 'status-undiscovered'">
                                    {{ location.discovered ? 'Discovered' : 'Undiscovered' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-if="locationData.length === 0">
                <h3>No Locations</h3>
                <p>Add locations to track places in your campaign world.</p>
            </div>
        </div>
    `
};
