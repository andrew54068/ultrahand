import {UltrahandWallet} from "../core/ultrahandWallet";
import Safe, {EthersAdapter, SafeAccountConfig, SafeFactory} from '@safe-global/protocol-kit'
import {ethers} from 'ethers'
import SafeApiKit from '@safe-global/api-kit'

export class SafeWallet extends UltrahandWallet {

    safeAddress = ''
    ethAdapterOwner1 = null
    signer = null
    txServiceUrl = 'https://safe-transaction-polygon.safe.global/'

    constructor() {
        super()
    }

    currentAddress() {
        return this.safeAddress
    }

    offChainSignTx() {
    }

    async connect() {

        if (!window.ethereum) throw new Error(`metamask not found.`)
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        this.signer = provider.getSigner();

        const signerAddress = await this.signer.getAddress();
        console.log(`💥 signerAddress: ${signerAddress}`);

        const signerChainId = await this.signer.getChainId()
        console.log(`💥 signerChainId: ${signerChainId}`);

        this.ethAdapterOwner1 = new EthersAdapter({
            ethers,
            signerOrProvider: this.signer || provider
        })

        const safeAccountConfig: SafeAccountConfig = {
            owners: [
                signerAddress,
            ],
            threshold: 1,
        }

        const safeFactory = await SafeFactory.create({ethAdapter: this.ethAdapterOwner1})
        const predictSafeAddress = await safeFactory.predictSafeAddress(safeAccountConfig)
        console.log(`💥 predictSafeAddress: ${JSON.stringify(predictSafeAddress, null, '  ')}`);

        const code = await provider.getCode(predictSafeAddress)
        if (code === "0x") {
            /**
             * deploy address
             */
            const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })
            const safeAddress = await safeSdkOwner1.getAddress()
            console.log(`💥 safeAddress: ${JSON.stringify(safeAddress, null, '  ')}`);
        }

        this.safeAddress = predictSafeAddress
        UltrahandWallet.setCurrentWallet(this)
    }

    async simulateTx(unsignedUOP) {
        const safeSDK = await Safe.create({
            ethAdapter: this.ethAdapterOwner1,
            safeAddress: this.safeAddress
        })

        const safeTransaction = unsignedUOP.data

        // const txServiceUrl = this.txServiceUrl
        const safeService = new SafeApiKit({txServiceUrl: this.txServiceUrl, ethAdapter: this.ethAdapterOwner1})

        // Deterministic hash based on transaction parameters
        const safeTxHash = await safeSDK.getTransactionHash(safeTransaction)

        // Sign transaction to verify that the transaction is coming from owner 1
        const senderSignature = await safeSDK.signTransactionHash(safeTxHash)

        await safeService.proposeTransaction({
            safeAddress: this.safeAddress,
            safeTransactionData: safeTransaction.data,
            safeTxHash,
            senderAddress: await this.signer.getAddress(),
            senderSignature: senderSignature.data,
        })

        return {signedSafeTx: safeTransaction}
    }

    async sendTx(signedUOP) {
        const safeSDK = await Safe.create({
            ethAdapter: this.ethAdapterOwner1,
            safeAddress: this.safeAddress
        })

        const executeTxResponse = await safeSDK.executeTransaction(signedUOP.signedSafeTx)
        const receipt = await executeTxResponse.transactionResponse?.wait()

        console.log('Transaction executed:')
        console.log(`https://www.jiffyscan.xyz/bundle/${receipt.transactionHash}?network=matic&pageNo=0&pageSize=10`)
    }

    isBatchSupported() {
        return true
    }

    packTx(invoke) {
        return {
            to: invoke.to,
            value: invoke.value,
            data: invoke.data
        }
    }

    async packBatchTx(invokes) {
        console.log('packBatchTx', invokes)

        const safeTransactionData = invokes.map(invoke => {
            return {
                to: invoke.to,
                value: invoke.value.startsWith('0x') ? ethers.BigNumber.from(invoke.value).toString(10) : invoke.value,
                data: invoke.data.length === 0 ? '0x' : invoke.data
            }
        })

        const safeSDK = await Safe.create({
            ethAdapter: this.ethAdapterOwner1,
            safeAddress: this.safeAddress
        })

        const safeTransaction = await safeSDK.createTransaction({safeTransactionData})

        return {
            data: safeTransaction,
        }
    }
}