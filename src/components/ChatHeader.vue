<script lang="ts">
import { defineComponent } from 'vue';
import PocketBase from 'pocketbase'
import getUserInitials from '../util/Helpers'

export default defineComponent({
    props: {
        roomName: { type: String, required: true }
    },
    data() {
        return {
            isMobile: false,
            showMenuOption: false
        }
    },
    mounted() {
        let self = this;

        window.addEventListener('resize', function (): void {
            if (this.document.documentElement.clientWidth <= 845) {
                self.isMobile = true;
            }
            else {
                self.isMobile = false;
            }
        });
    },
    methods: {
        displaySidebar: function (): void {
            let self = this;
            self.$router.push({ path: '/'});

            // We only want to show the sidebar so this seems to do the trick!
            setTimeout(() => {
                window.location.reload();
            }, 10);
        },
        displayMenu: function (): void {
            let self = this;
            self.showMenuOption = !self.showMenuOption;
        },
        deleteChat: async function (): Promise<void> {
            let self = this;

            const pocketBase: PocketBase = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
            const roomId = self.$router.currentRoute.value.params.roomId as string;

            try {
                await pocketBase.collection('rooms').delete(roomId);
                self.$router.push('/');

                setTimeout(() => {
                    window.location.reload();
                }, 10);
            }
            catch (error) {
                console.log("Failed to delete chat: ", error);
            }
        },
        returnInitials: function (name: string) {
            return getUserInitials(name);
        }
    }
})
</script>

<template>
    <div class="chat__header">
        <div class="chat__header__title">
            <div v-if="isMobile" class="back-arrow" @click="displaySidebar" >
                <font-awesome-icon :icon="['fas', 'arrow-left']" class="icon alt" />
            </div>
            <div class="room__name">
                <div class="avatar">{{ returnInitials(roomName) }}</div>
                <h2>{{ roomName }}</h2>
            </div>
        </div>
        <div class="chat__header__icons">
            <template v-if="!isMobile">
                <font-awesome-icon :icon="['fas', 'video']" class="icon alt" />
                <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="icon alt" />
            </template>
            <font-awesome-icon :icon="['fas', 'angle-down']" class="icon alt" @click="displayMenu" />
            <div v-if="showMenuOption" class="delete__chat__button" @click="deleteChat">Delete chat</div>
        </div>
    </div>
</template>

<style scoped>
.chat__header {
    padding: 0.5em;
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
    position: sticky;
    justify-content: space-between;
}

.chat__header__title {
    display: flex;
    align-items: center;
}

.chat__header__title > h2 {
    margin-left: 1em;
}

.room__name {
    display: flex;
    align-items: center;
    justify-content: center;
}

.room__name > .avatar {
    margin-right: 1em;
    width: 50px;
    height: 50px;
}

.icon {
    font-size: 1.6em;
    margin-right: 1em;
    cursor: pointer;
}

.delete__chat__button {
    position: absolute;
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 5px;
    cursor: pointer;
    padding: 0.8em;
    right: 30px;
    top: 60px;
}

.delete__chat__button:hover {
    color: red;
    transition: 0.2s ease-in;
}

@media screen and (width <= 845px) {
  .back-arrow {
    margin-left: 1em;
  }

  .chat__header__title {
    justify-content: space-between;
  }
}
</style>