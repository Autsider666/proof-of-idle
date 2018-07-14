import {clone} from 'ramda';
import UTXO from './UTXO';

export default class UTXOPool {
    constructor(pool = {}) {
        this.pool = pool
    }

    addUTXO(publicKey, amount) {
        if (this.pool[publicKey]) {
            this.pool[publicKey].amount += amount
        } else {
            this.pool[publicKey] = new UTXO(publicKey, amount)
        }
    }

    handleAction(action, feeReceiver) {
        if (!this.isValidAction(action)) return
        const inputUTXO = this.pool[action.inputPublicKey];
        if (action.type !== "GATHER" && inputUTXO) { //TODO safe to do this without checking?
            inputUTXO.amount -= action.amount
            inputUTXO.amount -= action.fee
            if (inputUTXO.amount === 0)
                delete this.pool[action.inputPublicKey]
        }
        this.addUTXO(action.outputPublicKey, action.amount)
        this.addUTXO(feeReceiver, action.fee)
    }

    isValidAction(action) {
        const {inputPublicKey, type, amount, fee} = action
        switch (type) {
            case "GATHER":
                return amount > 0
                break;
            default:
                const utxo = this.pool[inputPublicKey]
                return utxo !== undefined && utxo.amount >= (amount + fee) && amount > 0
        }
    }

    addingActionErrorMessage(action) {
        const {inputPublicKey, amount, fee} = action
        const utxo = this.pool[inputPublicKey]
        if (utxo === undefined)
            return "No UTXO was associated with this public key"
        if (amount <= 0)
            return "Amount has to be at least 0"
        if (utxo.amount < amount + fee)
            return `UTXO associated with this public key (${utxo.amount}) does not cover desired amount (${amount}) and fee (${fee})`
    }

    clone() {
        return new UTXOPool(clone(this.pool))
    }
}