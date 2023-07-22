
export class UltrahandWallet {

    static currentWallet = null;

    static setCurrentWallet(wallet) {
        UltrahandWallet.currentWallet = wallet;
    }

    constructor() {

    }

    currentAddress() {}

    offChainSignTx() {}

    connect() {}

    simulateTx(unsignedUOP) {
        // trigger signing process
    }

    sendTx(signedUOP) {}

    isBatchSupported() {}

    packTx(invoke) {}

    async packBatchTx(invokes) {}
}