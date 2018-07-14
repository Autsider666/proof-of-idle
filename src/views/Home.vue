<template>
    <div class="page-container">
        <md-app md-waterfall md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
                    <md-icon>menu</md-icon>
                </md-button>
                <span class="md-title">Proof of Idle</span>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
                <md-toolbar class="md-transparent" md-elevation="0">
                    <span>Navigation</span>

                    <div class="md-toolbar-section-end">
                        <md-button class="md-icon-button md-dense" @click="toggleMenu">
                            <md-icon>keyboard_arrow_left</md-icon>
                        </md-button>
                    </div>
                </md-toolbar>

                <md-list>
                    <md-list-item v-on:click="$router.push('/account')">
                        <md-icon>account_box</md-icon>
                        <span class="md-list-item-text">Account</span>
                    </md-list-item>

                    <md-list-item v-on:click="$router.push('/')">
                        <md-icon>touch_app</md-icon>
                        <span class="md-list-item-text">Gathering</span>
                    </md-list-item>

                    <md-list-item v-on:click="$router.push('/rankings')">
                        <md-icon>view_list</md-icon>
                        <span class="md-list-item-text">Ranking</span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>

            <md-app-content>
                <router-view/>
            </md-app-content>
        </md-app>
        <div class="background"/>
    </div>
</template>

<script>
    import {sync} from 'vuex-pathify'

    export default {
        name: 'home',
        data: () => ({
            menuVisible: false
        }),
        computed: {
            blockchains: sync('blockchains'),
            account: sync('account')
        },
        methods: {
            toggleMenu () {
                this.menuVisible = !this.menuVisible
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page-container {
        margin: 0 16px;
        padding-top: 16px;
    }

    .md-app {
        min-height: 500px;
        /*border: 1px solid rgba(#000, .12);*/
    }

    // Demo purposes only
    .md-drawer {
        width: 230px;
        max-width: calc(100vw - 125px);
    }
</style>
