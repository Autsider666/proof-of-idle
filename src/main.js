import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketio from 'vue-socket.io';

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'
import './styles/index.scss'

Vue.use(VueMaterial)


Vue.use(VueSocketio, window.location.hostname === "localhost" ?  "http://localhost:4000" : window.location.origin, store);

Vue.config.productionTip = false

window.Vue = new Vue({
    router,
    store,
    render: h => h(App),
    sockets: {
        // connect: () => {
        //     console.log('socket connected')
        // },
    },
}).$mount('#app')
