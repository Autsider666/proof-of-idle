import sha256 from "crypto-js/sha256";
import {verifySignature} from "../helpers/crypto";

export default class Action {
    constructor(inputPublicKey, outputPublicKey, type, amount, fee, signature) {
        this.inputPublicKey = inputPublicKey;
        this.outputPublicKey = outputPublicKey;
        this.type = type
        this.amount = amount;
        this.fee = fee;
        this.signature = signature;
        this._setHash();
    }

    hasValidSignature() {
        if (this.signature === undefined) return false;

        switch (this.type) {
            case "GATHER":
                return verifySignature(this.hash, this.signature, this.outputPublicKey);
            default:
                return verifySignature(this.hash, this.signature, this.inputPublicKey);
        }
    }

    toJSON() {
        return {
            inputPublicKey: this.inputPublicKey,
            outputPublicKey: this.outputPublicKey,
            type: this.type,
            amount: this.amount,
            fee: this.fee,
            hash: this.hash,
            signature: this.signature
        };
    }

    _setHash() {
        this.hash = this._calculateHash();
    }

    _calculateHash() {
        return sha256(
            this.inputPublicKey + this.outputPublicKey + this.type + this.amount + this.fee
        ).toString();
    }
}

export function actionFromJSON(action) {
    return new Action(
        action.inputPublicKey,
        action.outputPublicKey,
        action.type,
        action.amount,
        action.fee,
        action.signature
    );
}