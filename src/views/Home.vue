<template>
    <div class="home">
        <account></account>
        <div v-if="account.privateKey">
            <chat></chat>
            <p>
                <gatherer v-for="chain in blockchains" :chain="chain"></gatherer>
            </p>
            <p>
                <leader v-for="chain in blockchains" :chain="chain"></leader>
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
        name: 'home',
        components: {
            Account,
            Chat,
            Gatherer,
            Leader,
        },
        computed: {
            blockchains: sync('blockchains'),
            account: sync('account')
        }
    }
</script>
