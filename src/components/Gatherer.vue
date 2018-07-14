<template>
    <!--<button v-on:click="gather(chain.name)" :disabled="disabled">-->
        <!--Gather {{chain.name}}-->
    <!--</button>-->

    <md-button class="md-raised md-accent" v-on:click="gather(chain.name)" :disabled="disabled">
        Gather {{chain.name}}
    </md-button>
</template>

<script>
    import Action from "../models/Action"
    import {sync} from 'vuex-pathify'
    import {sign} from "../helpers/crypto";
    export default {
        props: {
            chain: {}
        },
        data () {
            return {
                disabled: false,
            }
        },
        methods: {
            gather(name){
                this.disabled = true
                let action = new Action(null, this.account.publicKey, 'GATHER', 1, 0);
                action.signature = sign(action.hash, this.account.privateKey)
                if (action.hasValidSignature()) {
                    this.$socket.emit('ACTION_BROADCAST', {blockchainName: name, action: action.toJSON()})

                    setTimeout(() => {
                        this.disabled = false
                    }, 1000)
                } else {
                    console.log('error with signature validation')
                }
            }
        },
        computed: {
            account: sync('account')
        }
    }
</script>

<style scoped>

</style>
