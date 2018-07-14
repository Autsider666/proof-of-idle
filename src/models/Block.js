import sha256 from "crypto-js/sha256";
import UTXOPool from "./UTXOPool";
import { map } from "ramda";
import { actionFromJSON } from "./Action";

const DIFFICULTY = 2;

class Block {
    constructor(opts) {
        const {
            blockchain,
            parentHash,
            height,
            creator,
            nonce,
            utxoPool,
            actions
        } = {
            creator: "root",
            nonce: "", //sha256(new Date().getTime().toString()).toString(),
            utxoPool: new UTXOPool(),
            actions: {},
            ...opts
        };
        this.blockchain = blockchain;
        this.nonce = nonce;
        this.parentHash = parentHash;
        this.height = height;
        this.creator = creator;
        this.utxoPool = utxoPool;
        this.actions = map(actionFromJSON)(actions);
        this._setHash();
    }

    isRoot() {
        return this.parentHash === "root";
    }
    isValid() {
        return (
            this.isRoot() ||
            (this.hash.substr(-DIFFICULTY) === "0".repeat(DIFFICULTY) &&
            this.hash === this._calculateHash())
        );
    }

    createChild(creator) {
        const block = new Block({
            blockchain: this.blockchain,
            parentHash: this.hash,
            height: this.height + 1,
            utxoPool: this.utxoPool.clone(),
            creator
        })
        block.utxoPool.addUTXO(creator, 2);

        return block;
    }

    addAction(action) {
        if (!this.isValidAction(action)) return;
        this.actions[action.hash] = action;
        this.utxoPool.handleAction(action, this.creator);
        this._setHash();
    }

    isValidAction(action) {
        return (
            this.utxoPool.isValidAction(action) &&
            action.hasValidSignature()
        );
    }

    addingActionErrorMessage(action) {
        if (!action.hasValidSignature()) return "Signature is not valid";
        return this.utxoPool.addingActionErrorMessage(action);
    }

    setNonce(nonce) {
        this.nonce = nonce;
        this._setHash();
    }

    combinedActionsHash() {
        if (Object.values(this.actions).length === 0)
            return "No Actions in Block";
        return sha256(
            Object.values(this.actions)
                .map(tx => tx.hash)
                .join("")
        );
    }

    toJSON() {
        return {
            hash: this.hash,
            nonce: this.nonce,
            parentHash: this.parentHash,
            height: this.height,
            creator: this.creator,
            actions: map(action => action.toJSON(), this.actions)
        };
    }

    _setHash() {
        this.hash = this._calculateHash();
    }

    _calculateHash() {
        return sha256(
            this.nonce +
            this.parentHash +
            this.creator +
            this.combinedActionsHash()
        ).toString();
    }
}

export default Block;

export function blockFromJSON(blockchain, data) {
    return new Block({
        ...data,
        blockchain
    });
}