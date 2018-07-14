import Vue from 'vue'
import Vuex from 'vuex'
import pathify from 'vuex-pathify'
import Blockchain from "./models/Blockchain"
import {blockFromJSON} from './models/Block'
import {actionFromJSON} from './models/Action'

Vue.use(Vuex)

let stockBlockchain = new Blockchain('Stone')

export default new Vuex.Store({
    plugins: [pathify.plugin],
    state: {
        connect: false,
        chat: [],
        players: 0,
        blockchains: [stockBlockchain],
        selectedBlockchain: stockBlockchain,
        account: window.localStorage.getItem('account') ? JSON.parse(window.localStorage.getItem('account')) : {},
    },
    mutations: {
        SOCKET_CONNECT: (state, status) => {
            console.log('Connection made')
            state.connect = true;
            state.blockchains.forEach(chain => {
                console.log('Requesting update for ', chain.name)
                window.Vue.$socket.emit("REQUEST_BLOCKS", {blockchainName: chain.name})
            })
        },
        SOCKET_PLAYER_CONNECTED(state, {}) {
            console.log('connected');
            (new Vue()).$set(state, 'players', state.players + 1)
        },
        SOCKET_PLAYER_DISCONNECTED(state, {}) {
            console.log('disconnected');
            (new Vue()).$set(state, 'players', state.players - 1)
        },
        SOCKET_BLOCKS_BROADCAST: (state, data) => {
            if (data[0] && data[0].blockchainName && data[0].blocks) {
                let blockchainName = data[0].blockchainName
                let blocks = data[0].blocks
                console.log('Recieved blocks for ' + blockchainName, blocks)
                for (let i in state.blockchains) {
                    let chain = state.blockchains[i];
                    if (blockchainName === chain.name) {
                        blocks.forEach(block => {
                            chain._addBlock(blockFromJSON(chain, block))
                        });
                        (new Vue()).$set(state.blockchains, i, chain)
                        break;
                    }
                }
            }
        },
        SOCKET_ACTION_BROADCAST: (state, data) => {
            if (data[0] && data[0].blockchainName && data[0].action) {
                let blockchainName = data[0].blockchainName
                let action = data[0].action
                console.log('new action', action, blockchainName)
                for (let i in state.blockchains) {
                    let chain = state.blockchains[i];
                    if (blockchainName === chain.name) {
                        (new Vue()).$set(chain.pendingActions, action.hash, actionFromJSON(action))
                        break;
                    }
                }
            }
        },
        SOCKET_REQUEST_BLOCKS: (state, data) => {
            if (data[0] && data[0].blockchainName) {
                let blockchainName = data[0].blockchainName
                console.log('Request for sharing blocks of ' + blockchainName)
                for (let i in state.blockchains) {
                    let chain = state.blockchains[i];
                    if (blockchainName === chain.name) {
                        window.Vue.$socket.emit("BLOCKS_BROADCAST", {
                            blockchainName,
                            blocks: Object.values(chain.blocks).map(b => b.toJSON())
                        })
                        break;
                    }
                }
            }
        },
        SOCKET_SEND_CHAT_MESSAGE(state,data) {
            if (data[0] && data[0].message)  {
                state.chat.unshift(data[0])
                console.log('message',data[0])
            }
        }
    },
    actions: {}
})
