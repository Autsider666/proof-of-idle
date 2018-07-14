import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Account from './views/Account.vue'
import Gathering from './views/Gathering.vue'
import LeaderBoard from './views/LeaderBoard.vue'
import store from './store'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            beforeEnter: (to, from, next) => {
                if (store.state.account.privateKey) {
                    next()
                } else {
                    next('/account')
                }
            },
            children: [
                {
                    path: '',
                    name: 'gathering',
                    component: Gathering
                },
                {
                    path: 'rankings',
                    name: 'rankings',
                    component: LeaderBoard
                },
            ]
        },
        {
            path: '/account',
            name: 'account',
            component: Account
        },
    ]
})
