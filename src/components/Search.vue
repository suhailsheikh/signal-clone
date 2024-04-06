<script lang="ts">
import { defineComponent } from 'vue';
import { useChatStore } from '../store/ChatStore'

export default defineComponent({
    setup() {
        const store = useChatStore();
        return { store }
    },
    beforeUpdate() {
        let parent = this.$parent as any;
        
        parent.data = this.store.$state.rooms
        .filter(item => item.name.toLowerCase()
        .includes(this.searchTerm.toLowerCase()));

        if (this.searchTerm === '') {
            parent.data = this.store.$state.rooms;
        }
    },
    data() {
        return {
            searchTerm: '',
        }
    }
})
</script>

<template>
    <div class="search__container">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="icon alt" />
        <input type="text" v-model="searchTerm" placeholder="Search" />
    </div>
</template>

<style scoped>
.search__container {
    display: flex;
    align-items: center;
    background-color: white;
    width: 100%;
    height: 35px;
    margin-right: 2px;
    border-radius: 10px;
}

.search__container > input {
    border: none;
    margin-left: 10px;
    width: 100%;
    font-size: 18px;
}

.search__container > input:focus {
    outline: none;
}

.search__container > .icon {
    margin-left: 1em;
}
</style>