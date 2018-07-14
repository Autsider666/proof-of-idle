<template>
    <div v-if="block">
        {{chain.name}} waiting: {{Object.keys(chain.pendingActions).length}}
        <input type="text" size="64" v-model="block.nonce" readonly>
        <button v-on:click="tryUntilFound" :disabled="disabled">Handle {{chain.name}}</button>
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
            }
        },
        computed: {
            publicKey: sync('account.publicKey'),
            disabled(){
                return Object.keys(this.chain.pendingActions).length === 0 || this.block.isValid()
            },
        },
        methods: {
            tryUntilFound() {
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
