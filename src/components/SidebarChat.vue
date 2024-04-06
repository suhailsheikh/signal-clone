<script lang="ts">
import { defineComponent } from 'vue';
import { useChatStore } from '../store/ChatStore'

import PocketBase from 'pocketbase'
import getUserInitials from '../util/Helpers'

type MessageType = {
    id: string;
    class_name: string;
    text: string;
    room: string;
    created: Date,
    updated: Date
}

export default defineComponent({
    props: {
        name: { type: String, required: true },
        roomId: { type: String, required: true },
    },
    setup() {
        const store = useChatStore();
        const pocketBase: PocketBase = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
        return {
            store,
            pocketBase
        }
    },
    data() {
        return {
            chatColour: '',
            lastMessage: ''
        }
    },
    mounted: async function () {
        this.getChatColour();

        const messages: MessageType[] = await this.pocketBase.collection('messages').getFullList({ requestKey: null });

        if (messages) {
            const message = messages.find(m => m.room === this.roomId);
            this.lastMessage = message?.text as string;
        }
    },
    methods: {
        returnInitials: function (name: string) {
            return getUserInitials(name);
        },
        getChatColour: function (): void {
            const chatColours: string[] = this.store.getChatColours();
            if (chatColours.length == 0) return;

            this.chatColour = chatColours[(Math.floor(Math.random() * chatColours.length))];
        }
    }
})
</script>

<template>
    <router-link :to='`/rooms/${roomId}/${name}`'>
        <div class="chat__message">
            <div :style="{ 'background-color': chatColour }" class="avatar">{{ returnInitials(name) }}</div>
            <div class="chat__info">
                <h4>{{ name }}</h4>
                <p style="width: 375px; line-height: 1.2;">{{ lastMessage }}</p>
            </div>
        </div>
    </router-link>
</template>

<style scoped>
.chat__message {
    display: flex;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 15px;
}

.chat__message:hover {
    background: lightgray;
    transition: 0.2s all ease-in;
    cursor: pointer;
}

.chat__message > .avatar {
    margin-left: 5px;
    width: 60px;
    height: 60px;
    background-color: gray;
    cursor: hover;
}

.chat__info {
    margin-left: 20px;
    line-height: 10px;
}
</style>