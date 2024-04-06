import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'

import './style.css'
import App from './App.vue'
import Chat from './components/Chat.vue'

// Vue Router Configuration
const routes = [
    {
        path: '/rooms/:roomId/:roomName', 
        component: Chat
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faAngleDown, faArrowLeft, faMobileScreen, faMagnifyingGlass, faPaperPlane, faVideo } from '@fortawesome/free-solid-svg-icons'

library.add(faAngleDown, faArrowLeft, faMobileScreen, faMagnifyingGlass, faPenToSquare, faPaperPlane, faVideo);

const pinia = createPinia()
const app = createApp(App);

app.use(router);
app.use(pinia);

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount("#app");