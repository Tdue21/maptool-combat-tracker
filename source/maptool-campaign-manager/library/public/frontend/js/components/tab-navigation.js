// Tab Navigation Component
const TabNavigation = {
    name: 'TabNavigation',
    props: {
        activeTab: {
            type: String,
            required: true
        },
        tabs: {
            type: Array,
            required: true
        }
    },
    emits: ['update:activeTab'],
    template: `
        <div class="tabs-container">
            <button 
                v-for="tab in tabs" 
                :key="tab.id"
                class="tab" 
                :class="{ active: activeTab === tab.id }" 
                @click="$emit('update:activeTab', tab.id)">
                {{ tab.label }}
            </button>
        </div>
    `
};
