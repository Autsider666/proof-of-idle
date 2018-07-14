import Block from "./Block";
import { blockFromJSON } from "./Block";
import { actionFromJSON } from "./Action";
// import { publish, subscribeTo } from "../network";
import { maxBy, reduce, unfold, reverse, values, prop } from "ramda";

// import vue from 'vue'
// const Vue = new vue();

class Blockchain {
    constructor(name) {
        this.name = name;
        this.genesis = null;
        this.blocks = {};

        this.pendingActions = {};

        this.createGenesisBlock();
    }

    maxHeightBlock() {
        const blocks = values(this.blocks);
        const maxByHeight = maxBy(prop("height"));
        return reduce(maxByHeight, blocks[0], blocks);
    }

    longestChain() {
        const getParent = x => {
            if (x === undefined) {
                return false;
            }

            return [x, this.blocks[x.parentHash]];
        };
        return reverse(unfold(getParent, this.maxHeightBlock()));
    }

    createGenesisBlock() {
        const block = new Block({
            blockchain: this,
            parentHash: "root",
            height: 1
        });
        this.blocks[block.hash] = block;
        this.genesis = block;
    }

    containsBlock(block) {
        return this.blocks[block.hash] !== undefined;
    }

    addBlock(newBlock) {
        this._addBlock(newBlock);
        // publish("BLOCKS_BROADCAST", {
        //     blocks: [newBlock.toJSON()],
        //     blockchainName: this.name
        // });
    }

    _addBlock(block) {
        if (!block.isValid()) return;
        if (this.containsBlock(block)) return;

        // check that the parent is actually existent and the advertised height is correct
        const parent = this.blocks[block.parentHash];

        if (parent === undefined || parent && parent.height + 1 !== block.height) return;

        const isParentMaxHeight = this.maxHeightBlock().hash === parent.hash;

        // clone the utxo pool of the parent and reconcile with the block
        const newUtxoPool = parent.utxoPool.clone();
        block.utxoPool = newUtxoPool;

        // Add coinbase coin to the pool
        block.utxoPool.addUTXO(block.creator, 12.5);

        // Reapply actions to validate them
        const actions = block.actions;
        block.actions = {};
        let containsInvalidActions = false;
        Object.values(actions).forEach(action => {
            if (block.isValidAction(action)) {
                block.addAction(action);

                // if we have the action as a pending one on the chain, remove it from the pending pool if we are at max height
                if (isParentMaxHeight && this.pendingActions[action.hash])
                    delete this.pendingActions[action.hash];
            } else {
                containsInvalidActions = true;
            }
        });

        // If we found any invalid actions, dont add the block
        if (containsInvalidActions) return;

        this.blocks[block.hash] = block;
    }
}
export default Blockchain;