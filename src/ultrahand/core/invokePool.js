import {UltrahandWallet} from "./ultrahandWallet";
import {UserOperationPool} from "./userOperationPool";

export class InvokePool {

    pool = []

    static singleton = new InvokePool()

    static getSingleton() {
        return InvokePool.singleton
    }

    constructor() {
    }

    addInvoke(invoke) {
        this.pool.push(invoke)
    }

    clearInvoke() {
        this.pool = []
    }

    async packIntoUserOperation() {
        console.log("packIntoUserOperation")
        if (UltrahandWallet.currentWallet.isBatchSupported()) {
            console.log("packIntoUserOperation->packBatchTx")
            let batchTx = await UltrahandWallet.currentWallet.packBatchTx(this.pool)
            UserOperationPool.getSingleton().addUserOperation(batchTx)
        } else {
            for (let i = 0; i < this.pool.length; i++) {
                console.log("packIntoUserOperation->packTx")
                let tx = UltrahandWallet.currentWallet.packTx(this.pool[i])
                UserOperationPool.getSingleton().addUserOperation(tx)
            }
        }
    }

    addUserOperation() {

    }

    invokeNum() {
        return this.pool.length
    }
}