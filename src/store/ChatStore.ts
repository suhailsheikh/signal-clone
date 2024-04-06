import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

type RoomType = {
    id: string;
    name: string;
}

type MessageType = {
    id: string;
    class_name: string;
    text: string;
    room: string;
    created: Date;
    updated: Date;
}

export const useChatStore = defineStore('chat', {
    state: () => ({
        chatColours: [],
        rooms: [{ id: '', name: ''}],
        messages: [{id: '', class_name: '', text: '', room: ''}],
        pocketBase: new PocketBase(import.meta.env.VITE_POCKETBASE_URL)
    }),
    actions: {
        getChatColours() {
            return [
                '#EF5350', 
                '#EC407A', 
                '#AB47BC', 
                '#7E57C2', 
                '#5C6BC0', 
                '#2196F3', 
                '#03A9F4', 
                '#00BCD4', 
                '#009688', 
                '#4CAF50', 
                '#7CB342',
                '#FF9700',
                '#FF5722',
                '#FFB300',
                '#607D8B'
            ]
        },
        async getRooms(): Promise<void> {    
            const rooms: RoomType[] = await this.pocketBase.collection('rooms').getFullList({ sort: '-created' });
            this.rooms = rooms;
        },
        async getMessages(): Promise<void> {
            const messages: MessageType[] = await this.pocketBase.collection('messages').getFullList({ 
                requestKey: null 
            });

            this.messages = messages;
        },
        async createChat(chatName: string): Promise<void> {
            const record = await this.pocketBase.collection('rooms').create({
                name: chatName
            });

            if (record) {
                window.location.reload();
            }
        }
    }
  });