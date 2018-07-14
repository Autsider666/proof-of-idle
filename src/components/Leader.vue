<template>
    <div v-if="block">
        <md-field>
            <label><span v-if="trying">Handling</span> {{Object.keys(chain.pendingActions).length}} {{chain.name}} <span v-if="!trying">ready for processing</span></label>
            <md-input v-model="block.nonce" readonly :disabled="!trying"></md-input>
        </md-field>
        <md-button class="md-raised" v-on:click="tryUntilFound" :disabled="disabled">Handle {{chain.name}}</md-button>
    </div>
</template>

<script>
    import {sync} from "vuex-pathify"
    import Block from "../models/Block"
    import sha256 from "crypto-js/sha256"
    export default {
        props: {
            chain: {}
        },
        data () {
            return {
                block: null,
                trying:false,
            }
        },
        computed: {
            publicKey: sync('account.publicKey'),
            disabled(){
                return Object.keys(this.chain.pendingActions).length === 0 || this.block.isValid() || this.trying
            },
        },
        methods: {
            tryUntilFound() {
                this.trying = true;
                if (!this.block.isValid()) {
                    for (let i in this.chain.pendingActions) {
                        let action = this.chain.pendingActions[i]
                        this.block.addAction(action)
                    }

                    this.block.setNonce(
                        sha256(new Date().getTime().toString()).toString()
                    );

                    if (!this.block.isValid()) {
                        setTimeout(this.tryUntilFound, 2);
                        return;
                    }
                }
                this.trying = false
                this.chain._addBlock(this.block)
                this.$socket.emit("BLOCKS_BROADCAST", {
                    blocks: [this.block.toJSON()],
                    blockchainName: this.chain.name
                })

                this.block = this.chain.maxHeightBlock().createChild(this.publicKey)
            }
        },
        mounted() {
            this.block = this.chain.maxHeightBlock().createChild(this.publicKey)
        }
    }
</script>

<style scoped>

</style>
