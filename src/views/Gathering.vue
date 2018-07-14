<template>
    <div class="home">
        <md-tabs md-alignment="fixed">
            <md-tab :md-label="chain.name" v-for="chain in blockchains"
                    v-on:click="selected = chain.name"></md-tab>
        </md-tabs>
        <!--<chat></chat>-->
        <div v-for="(chain, i) in blockchains" v-show="selected === chain.name || selected === i">
            <p>
                <gatherer :chain="chain"></gatherer>
            </p>
            <p>
                <leader :chain="chain"></leader>
            </p>
        </div>
    </div>
</template>

<script>
    import Account from '../components/Account.vue'
    import Chat from '../components/Chat.vue'
    import Gatherer from '../components/Gatherer.vue'
    import Leader from '../components/Leader.vue'
    import {sync} from 'vuex-pathify'
    export default {
        components: {
            Account,
            Chat,
            Gatherer,
            Leader,
        },
        data () {
            return {
                selected: 0
            }
        },
        computed: {
            blockchains: sync('blockchains'),
            account: sync('account')
        },
    }
</script>

<style scoped>

</style>
