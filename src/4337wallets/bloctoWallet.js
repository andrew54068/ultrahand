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
                chainId: "0x89", // ethereum mainnet
                rpc: "https://mainnet.infura.io/v3/4577e17259294e4a92a22090f8c2c90d"
            },
        });

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
        // blocto mode
        // let requests = []
        // for (let i = 0; i < signedUOP.bloctoData.invokes.length; i++) {
        //     requests.push({
        //         from: this.bloctoAddress,
        //         to: signedUOP.bloctoData.invokes[i].to,
        //         value: signedUOP.bloctoData.invokes[i].value,
        //         data: signedUOP.bloctoData.invokes[i].data,
        //     })
        // }
        //
        // let bloctoWeb3 = new Web3(this.bloctoSDK.ethereum)
        // const txHash = await bloctoWeb3.currentProvider.request({
        //     method: 'blocto_sendBatchTransaction',
        //     params: requests
        // })
        //
        // console.log(txHash)
        // return

        const userOpHash = await this.bloctoSDK.ethereum
            .request({
                method: 'eth_sendUserOperation',
                params: [{callData: signedUOP.bloctoData}],
            })

        let id = setInterval(async () => {
            const receipt = await this.bloctoSDK.ethereum
                .request({
                    method: 'eth_getUserOperationReceipt',
                    jsonrpc: "2.0",
                    id: 1,
                    params: [userOpHash],
                })
            console.log(receipt)

            const userOperation = await this.bloctoSDK.ethereum
                .request({
                    method: 'eth_getUserOperationByHash',
                    jsonrpc: "2.0",
                    id: 1,
                    params: [userOpHash],
                })
            console.log(userOperation)

            if (id && userOperation.error === undefined) {
                clearInterval(id)
            }

        }, 1000)
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

    packBatchTx(invokes) {
        console.log('packBatchTx', invokes)
        let dests = []
        let values = []
        let datas = []
        for (let i = 0; i < invokes.length; i++) {
            dests.push(invokes[i].to)
            // if invokes[i].value starts with 0x, it is hex string
            if (invokes[i].value.startsWith('0x')) {
                values.push(parseInt(invokes[i].value, 16).toString(10))
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