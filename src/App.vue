<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useChatStore } from './store/ChatStore'

let isMobile = ref<boolean>(false);
let router = useRouter();
const store = useChatStore();

onMounted(() => {
  store.getRooms();
  store.getMessages();

  window.addEventListener('resize', function (): void {
    if (this.document.documentElement.clientWidth <= 845) {
      isMobile.value = true;
    }
    else {
      isMobile.value = false;
    }
  });
});
</script>

<template>
  <div class="container">
    <div class="app__body">
      <template v-if="isMobile && router.currentRoute.value.path.includes('rooms')">
        <router-view></router-view>
      </template>
      <template v-else-if="isMobile && router.currentRoute.value.path === '/'">
        <Sidebar />
      </template>
      <template v-else>
        <Sidebar />
        <router-view></router-view>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  place-items: center;
  margin-top: 3em;
}

.app__body {
  width: 90vw;
  height: 100vh;
  margin-top: -50px;
  display: flex;
  overflow: hidden;
}

@media screen and (width <= 845px) {
  .app__body {
    width: 100vw;
  }
}
</style>
