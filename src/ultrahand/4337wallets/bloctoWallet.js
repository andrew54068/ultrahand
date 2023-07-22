import {UltrahandWallet} from "../core/ultrahandWallet";
import Web3 from "web3";
import BloctoSDK from "@blocto/sdk";
import {ethers} from "ethers";

export class BloctoWallet extends UltrahandWallet {

    bloctoAccountABI = [
        'function execute(address dest, uint256 value, bytes func)',
        'function executeBatch(address[] dest, uint256[] value, bytes[] func)',
    ]

    web3 = null
    bloctoSDK = null
    bloctoAddress = null

    constructor() {
        super()
    }

    currentAddress() {
        return this.bloctoAddress
    }

    offChainSignTx() {
    }

    async connect() {

        this.bloctoSDK = new BloctoSDK({
            ethereum: {
                // chainId: "0x13881", // (required) chainId to be used
                // rpc: "https://rpc-mumbai.maticvigil.com/",
                // chainId: "0x1", // ethereum mainnet
                // rpc: "https://mainnet.infura.io/v3/4577e17259294e4a92a22090f8c2c90d"
                chainId: "0x89", // polygon
                rpc: "https://mainnet.infura.io/v3/4577e17259294e4a92a22090f8c2c90d"
            },
        });

        // await this.bloctoSDK.ethereum.request({ method: "wallet_disconnect" });
        localStorage.removeItem("sdk.session");

        this.web3 = new Web3(this.bloctoSDK.ethereum);

        const loginHandler = async () => {
            const accounts = await this.bloctoSDK.ethereum.request({
                method: "eth_requestAccounts"
            });
            this.bloctoAddress = accounts[0];
        };

        await loginHandler()
    }

    simulateTx(unsignedUOP) {
        // trigger signing process
        return {bloctoData: unsignedUOP.data}
    }

    async sendTx(signedUOP) {
        const userOpHash = await this.bloctoSDK.ethereum
            .request({
                method: 'eth_sendUserOperation',
                params: [{callData: signedUOP.bloctoData}],
            })

        console.log(userOpHash)
        return {UserOpHash: userOpHash}
    }

    isBatchSupported() {
        return true
    }

    packTx(invoke) {
        let accountContract = new ethers.utils.Interface(this.bloctoAccountABI);
        let callData = accountContract.encodeFunctionData("execute", [invoke.to, invoke.value, invoke.data.length === 0 ? '0x' : invoke.data]);
        return {
            data: callData,
        }
    }

    async packBatchTx(invokes) {
        console.log('packBatchTx', invokes)
        let dests = []
        let values = []
        let datas = []
        for (let i = 0; i < invokes.length; i++) {
            dests.push(invokes[i].to)
            // if invokes[i].value starts with 0x, it is hex string
            if (invokes[i].value.startsWith('0x')) {
                values.push(ethers.BigNumber.from(invokes[i].value).toString(10))
            } else {
                values.push(invokes[i].value)
            }
            datas.push(invokes[i].data.length === 0 ? '0x' : invokes[i].data)
        }
        let accountContract = new ethers.utils.Interface(this.bloctoAccountABI);
        let callData = accountContract.encodeFunctionData("executeBatch", [dests, values, datas]);
        return {
            data: callData,
        }
    }
}