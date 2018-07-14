<template>
    <div>
        <div>
            <p v-for="message in chat">{{message}}</p>
        </div>
        <form v-on:submit.prevent="send(msg)">
            <input type="text" placeholder="Send a message" v-model="msg">
            <input type="submit" value="Send">
        </form>
    </div>
</template>

<script>
    import {sync} from "vuex-pathify";
    export default {
        data () {
            return {
                msg: null
            }
        },
        computed: {
            chat: sync('chat'),
            account: sync('account')
        },
        methods: {
            send(msg) {
                this.$socket.emit('SEND_CHAT_MESSAGE', {person: this.account.publicKey, message: msg})
                this.msg = null;
            }
        }
    }
</script>

<style scoped>

</style>
