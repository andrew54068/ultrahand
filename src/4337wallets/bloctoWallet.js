import {UltrahandWallet} from "../core/ultrahandWallet";
import Web3 from "web3";
import BloctoSDK from "@blocto/sdk";

export class BloctoWallet extends UltrahandWallet {

    web3 = null
    bloctoSDK = null
    currentAddress = null

    constructor() {
        super()
    }

    currentAddress() {
        return this.currentAddress
    }

    offChainSignTx() {
    }

    async connect() {
        this.bloctoSDK = new BloctoSDK({
            ethereum: {
                chainId: "0x13881", // (required) chainId to be used
                rpc: "https://rpc-mumbai.maticvigil.com/",
            },
        });

        this.web3 = new Web3(this.bloctoSDK.ethereum);

        const loginHandler = async () => {
            const accounts = await this.bloctoSDK.ethereum.request({
                method: "eth_requestAccounts"
            });
            this.currentAddress = accounts[0];
        };

        await loginHandler()
    }

    simulateTx(unsignedUOP) {
        // trigger signing process
    }

    sendTx(signedUOP) {
    }

    isBatchSupported() {
    }

    packTx(invoke) {
    }

    packBatchTx(invokes) {
    }
}