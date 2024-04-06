<script lang="ts">
import { defineComponent } from 'vue';
import moment from 'moment'

import ChatHeader from './ChatHeader.vue'
import ChatFooter from './ChatFooter.vue'
import PocketBase from 'pocketbase'

type MessageType = {
    id: string;
    class_name: string;
    text: string;
    room: string;
    created: Date,
    updated: Date
}

export default defineComponent({
    setup() {
        const pocketBase: PocketBase = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
        return {
            pocketBase
        }
    },
    beforeUpdate: async function (): Promise<void> {
        this.getChatMessage();
    },
    mounted: async function (): Promise<void> {
        this.getChatMessage();
    },
    data() {
        return {
            chatMessages: [
                { 
                    id: '', 
                    text: '',
                    class_name: '',
                    created: new Date(),
                    updated: new Date()
                }
            ]
        }
    },
    methods: {
        getChatMessage: async function (): Promise<void> {
            // Source: https://github.com/pocketbase/js-sdk#auto-cancellation
            const messages: MessageType[] = await this.pocketBase.collection('messages').getFullList({ requestKey: null });
            const roomId = this.$route.params.roomId as string;

            if (messages) {
                this.chatMessages = messages.filter(m => m.room === roomId) as MessageType[];
            }
        },
        getTimestamp: function (timestamp: Date) {
            return moment(timestamp).format('hh:mm');
        }
    },
    components: {
        ChatHeader,
        ChatFooter
    }
})
</script>

<template>
    <div class="chat">
        <ChatHeader :room-name="$route.params.roomName.toString()" />
        <div class="chat__body">
            <template v-for="message in chatMessages" :key="message.id">
                <div :class=message.class_name>
                    {{ message.text }}
                    <small class="message__timestamp">{{ getTimestamp(message?.created) }}</small>
                </div>
            </template>
        </div>
        <ChatFooter />
    </div>
</template>

<style scoped>
.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
}

.chat__body {
    flex: 1;
    padding: 1em;
}

.chat__message {
    background-color: #3C3744;
    color: white;
    width: fit-content;
    padding: 1em;
    margin-top: 1em;
    border-radius: 2em;
}

.chat__receiver {
    margin-left: auto;
    background-color: #2C6BED;
}
</style>