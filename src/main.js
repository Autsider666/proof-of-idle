import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketio from 'vue-socket.io';

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
