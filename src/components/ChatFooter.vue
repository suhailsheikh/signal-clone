<script lang="ts">
import { defineComponent } from 'vue';
import PocketBase from 'pocketbase'

export default defineComponent({
    setup() {
        const pocketBase: PocketBase = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
        return { pocketBase }
    },
    data() {
        return {
            message: ''
        }
    },
    methods: {
        onSubmit: async function(e: any) {
            e.preventDefault();
            
            const record = await this.pocketBase.collection('messages').create({
                class_name: "chat__message chat__receiver",
                text: this.message,
                room: this.$route.params.roomId
            });

            if (record) {
                this.message = '';
            }
        }
    }
})
</script>

<template>
    <div class="chat__footer">
        <form @submit="onSubmit">
            <input type="text" placeholder="Send message" v-model="message" />
            <button class="send__message" :disabled="message.length === 0">
                <font-awesome-icon :icon="['fas', 'paper-plane']" class="icon alt" />
            </button>
        </form>
    </div>
</template>

<style scoped>
.chat__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 62px;
    border-top: 1px solid lightgray;
    background-color: #ededed;
}

.chat__footer > form {
  flex: 1;
  display: flex;
  padding: 1em;
  gap: 1em;
}

.chat__footer > form > input {
  flex: 1;
  border-radius: 30px;
  padding: 10px;
  border: none;
}

.send__message {
    border: none;
    background-color: #2C6BED;
    width: 40px;
    height: 40px;
    border-radius: 2em;
    color: white;
    cursor: pointer;
}
</style>