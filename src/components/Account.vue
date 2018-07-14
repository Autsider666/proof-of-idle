<template>
    <div>
        <div v-if="account && account.privateKey">
            Account-key: {{account.publicKey}}<br>
            Private-key: <span v-if="hidden" v-on:click="hidden=false"><i>Hidden</i></span><span v-else=""
                                                                                                 v-on:click="hidden=true">{{account.privateKey}}</span>
        </div>
        <div>
            <button v-on:click="generateNewAccount()">Generate Key</button>
        </div>
        <p v-for="chain in blockchains" v-if="account && account.privateKey">
            {{chain.name}} amount: {{chain.maxHeightBlock().utxoPool.pool[account.publicKey] ? chain.maxHeightBlock().utxoPool.pool[account.publicKey].amount : 0}}</p>
        <p>
            Active players since you can online: {{players}}
        </p>
    </div>
</template>

<script>
    import {sync} from 'vuex-pathify'
    import {generatePair} from './../helpers/crypto'
    export default {
        data () {
            return {
                hidden: true
            }
        },
        computed: {
            account: sync('account'),
            blockchains: sync('blockchains'),
            players: sync('players'),
        },
        methods: {
            generateNewAccount() {
                if (!this.account.privateKey || confirm('Are you sure?')) {
                    let account = generatePair();
                    this.$set(this.account, 'publicKey', account.publicKey)
                    this.$set(this.account, 'privateKey', account.privateKey)
//                    this.account.publicKey = account.publicKey
//                    this.account.privateKey = account.privateKey
                    window.localStorage.setItem('account', JSON.stringify(this.account))
                }
            }
        }
    }
</script>

<style scoped>

</style>
