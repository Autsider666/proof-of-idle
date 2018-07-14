<template>
    <div>
        <md-card v-for="chain in blockchains">
            <md-card-header>
                <div class="md-title">{{chain.name}} Leaderboard</div>
            </md-card-header>
            <md-table>
                <md-table-row>
                    <md-table-head md-numeric>Rank</md-table-head>
                    <md-table-head>Public key</md-table-head>
                    <md-table-head md-numeric>Amount</md-table-head>
                </md-table-row>

                <md-table-row v-for="(pool,i) in rankedList(chain)">
                    <md-table-cell md-numeric>{{i + 1}}</md-table-cell>
                    <md-table-cell>{{smallKey(pool.publicKey)}}</md-table-cell>
                    <md-table-cell md-numeric>{{pool.amount}}</md-table-cell>
                </md-table-row>

                <md-table-row v-if="Object.keys(chain.maxHeightBlock().utxoPool.pool).length === 0">
                    <md-table-cell md-numeric></md-table-cell>
                    <md-table-cell>There are no players with this resource (yet)</md-table-cell>
                    <md-table-cell md-numeric></md-table-cell>
                </md-table-row>
            </md-table>
        </md-card>
    </div>
</template>

<script>
    import {sync} from "vuex-pathify";
    export default {
        data () {
            return {}
        },
        computed: {
            blockchains: sync('blockchains'),
            account: sync('account'),
        },
        methods: {
            smallKey(key){
                return key.slice(0,32)+'...'
            },
            rankedList(chain){
                if (!chain) return [];
                return Object.values(chain.maxHeightBlock().utxoPool.pool).sort((a, b) => b.amount - a.amount)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .md-card {
        width: 90%;
        margin: 15px 4px;
        display: inline-block;
        vertical-align: top;
    }
</style>
