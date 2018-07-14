<template>
    <div class="centered-container">
        <md-content class="md-elevation-3">
            <div class="title">
                <img src="../assets/hourglass.png">
                <div class="md-title">Proof of Idle</div>
                <div class="md-body-1">
                    Keep your private key save. It's your password and proof that you are you in this game.
                </div>
            </div>

            <div class="form">
                <md-field>
                    <label>Public Key</label>
                    <md-input v-model="account.publicKey"></md-input>
                </md-field>

                <md-field>
                    <label>Private Key</label>
                    <md-input v-model="account.privateKey"></md-input>
                </md-field>
            </div>

            <div class="actions md-layout md-alignment-center-space-between">
                <md-dialog-confirm
                        :md-active.sync="resetAccountConfirmation"
                        md-title="Are you sure you want to create new keys?"
                        md-content="Make sure you've written down your current key pair if you ever want to access this account again."
                        md-confirm-text="Yes, I am"
                        md-cancel-text="On second thought..."
                        @md-cancel="resetAccountConfirmation = false"
                        @md-confirm="generateNew()"/>

                <md-button class="md-raised md-accent"
                           @click="account.privateKey ? resetAccountConfirmation = true : generateNew()">Create new keys
                </md-button>

                <md-button class="md-raised md-primary" @click="useKeys"
                           :disabled="!account.privateKey && !account.publicKey">Use keys
                </md-button>
            </div>

            <div class="loading-overlay" v-if="loading">
                <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
            </div>

        </md-content>
        <div class="background"/>
    </div>
</template>

<script>
    import {generatePair} from './../helpers/crypto'
    import {sync} from "vuex-pathify";
    export default {
        name: "App",
        data() {
            return {
                loading: false,
                resetAccountConfirmation: false,
//                login: {
//                    email: "",
//                    password: ""
//                }
            };
        },
        methods: {
            useKeys() {
                window.localStorage.setItem('account', JSON.stringify(this.account))
                this.$router.push('/')
            },
            generateNew() {
                let account = generatePair();
                this.$set(this.account, 'publicKey', account.publicKey)
                this.$set(this.account, 'privateKey', account.privateKey)
                this.resetAccountConfirmation = false
            }
        },
        computed: {
            account: sync('account'),
        }
    };
</script>

<style lang="scss">
    .centered-container input {
        font-size: 10px !important;
    }

    .centered-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 100vh;
        .title {
            text-align: center;
            margin-bottom: 30px;
            img {
                margin-bottom: 16px;
                max-width: 80px;
            }
        }
        .actions {
            .md-button {
                margin: 0;
            }
        }
        .form {
            margin-bottom: 60px;
        }
        .md-content {
            z-index: 1;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            position: relative;
        }
        .loading-overlay {
            z-index: 10;
            top: 0;
            left: 0;
            right: 0;
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
