<script lang="ts">
import { defineComponent } from 'vue';
import PocketBase from 'pocketbase'
import Search from './Search.vue'
import SidebarChat from './SidebarChat.vue'

import { useChatStore } from '../store/ChatStore'

type RoomType = {
    id: string;
    name: string;
}

export default defineComponent({
    setup() {
        const pocketBase: PocketBase = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
        const store = useChatStore();

        return {
            pocketBase,
            store
        }
    },
    data() {
        return {
            chatRooms: [{ id: '', name: '' }]
        }
    },
    mounted: async function () {
        const rooms: RoomType[] = await this.pocketBase.collection('rooms').getFullList({ requestKey: null });
        this.chatRooms = rooms;   
    },
    methods: {
        createChat: async function (): Promise<void> {
            let result = prompt('Create a new chat') as string;
            await this.store.createChat(result);
        }
    },
    components: {
        Search,
        SidebarChat
    }
})
</script>

<template>
    <div class="sidebar">
        <div class="sidebar__header">
            <div class="avatar">SS</div>
            <div class="sidebar__headerRight">
                <font-awesome-icon :icon="['fas', 'mobile-screen']" class="icon alt" />
                <font-awesome-icon icon="fa-regular fa-pen-to-square" class="icon alt" @click="createChat"/>
            </div>
        </div>
        <div class="sidebar__search">
            <Search />
        </div>
        <div class="chat__messages__container">
            <div v-for="item in chatRooms">
                <template v-if="item.id && item.name">
                    <SidebarChat :name="item.name" :roomId="item.id" />
                </template>
                <template v-else>Could not load chat...</template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sidebar {
  width: 500px;
  height: 100%;
  display: block;
  border-right: 1px solid lightgray;
  background-color: #ededed;
}

.sidebar__header {
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar__headerRight > .icon {
  font-size: 1.5rem;
  margin-right: 1em;
  cursor: pointer;
}

.sidebar__search {
  padding: 1em;
}

.chat__messages__container {
  padding: 1em;
}
</style>
