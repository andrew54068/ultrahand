import {UltrahandWallet} from "../core/ultrahandWallet";
import {SafeAuthKit, Web3AuthModalPack} from '@safe-global/auth-kit';
import Safe, {EthersAdapter, SafeAccountConfig, SafeFactory} from '@safe-global/protocol-kit'
import {OpenloginAdapter} from '@web3auth/openlogin-adapter';
import {CHAIN_NAMESPACES, WALLET_ADAPTERS} from "@web3auth/base";
import {Web3AuthOptions} from '@web3auth/modal';
import {ethers} from 'ethers'
import SafeApiKit from '@safe-global/api-kit'

export class SafeWallet extends UltrahandWallet {

    safeAddress = ''
    ethAdapterOwner1 = null
    signer = null

    constructor() {
        super()
    }

    currentAddress() {
        return this.safeAddress
    }

    offChainSignTx() {
    }

    async connect() {
        // const [web3AuthModalPackA, setWeb3AuthModalPack] = useState<Web3AuthModalPack>(null)
        // const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<AuthKitSignInData | null>(
        //     null
        // )
        // const [userInfoA, setUserInfo] = useState<Partial<UserInfo>>(null)
        // const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)

// https://dashboard.web3auth.io/
//         const WEB3_AUTH_CLIENT_ID= process.env.REACT_APP_WEB3_AUTH_CLIENT_ID!

// https://web3auth.io/docs/sdk/web/modal/initialize#arguments
        const options: Web3AuthOptions = {
            clientId: "BJ-5QLnwlR5iO5lXi_RyJ4luCUVIgty5_ThfR-2OXPAmI0r8Gh1Z1I3pJ99VII02MxE-siZ0fIuN_bJC9JJwJqE",
            web3AuthNetwork: 'testnet',
            chainConfig: {
                chainNamespace: CHAIN_NAMESPACES.EIP155,
                chainId: '0x5',
                // https://chainlist.org/
                rpcTarget: `https://rpc.ankr.com/eth_goerli`
            },
            uiConfig: {
                theme: 'dark',
                loginMethodsOrder: ['google', 'facebook']
            }
        }

// https://web3auth.io/docs/sdk/web/modal/initialize#configuring-adapters
        const modalConfig = {
            [WALLET_ADAPTERS.TORUS_EVM]: {
                label: 'torus',
                showOnModal: false
            },
            [WALLET_ADAPTERS.METAMASK]: {
                label: 'metamask',
                showOnDesktop: true,
                showOnMobile: false
            }
        }

// https://web3auth.io/docs/sdk/web/modal/whitelabel#whitelabeling-while-modal-initialization
        const openloginAdapter = new OpenloginAdapter({
            loginSettings: {
                mfaLevel: 'mandatory'
            },
            adapterSettings: {
                uxMode: 'popup',
                whiteLabel: {
                    name: 'Safe'
                }
            }
        })

        const web3AuthModalPack = new Web3AuthModalPack(options, [openloginAdapter], modalConfig)

        const safeAuthKit = await SafeAuthKit.init(web3AuthModalPack, {
            txServiceUrl: 'https://safe-transaction-goerli.safe.global'
        })

        await safeAuthKit.signIn();

        const provider = new ethers.providers.Web3Provider(safeAuthKit.getProvider(), {
            name: 'goerli',
            chainId: 5
        });
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
        /**
         * deploy address
         */
        // const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })
        // const safeAddress = await safeSdkOwner1.getAddress()
        // console.log(`💥 safeAddress: ${JSON.stringify(safeAddress, null, '  ')}`);

        this.safeAddress = predictSafeAddress
        UltrahandWallet.setCurrentWallet(this)
    }

    async simulateTx(unsignedUOP) {
        const safeSDK = await Safe.create({
            ethAdapter: this.ethAdapterOwner1,
            safeAddress: this.safeAddress
        })

        // trigger signing process
        // Create a Safe transaction with the provided parameters
        const safeTransactionData: MetaTransactionData = {
            to: unsignedUOP.to,
            data: unsignedUOP.data,
            value: parseInt(unsignedUOP.value, 16).toString(10),
            // value: unsignedUOP.value, // ethers.utils.parseUnits('0.00001', 'ether').toString()
        }

        const safeTransaction = await safeSDK.createTransaction({safeTransactionData})
        console.log(`💥 safeTransaction: ${JSON.stringify(safeTransaction, null, '  ')}`);

        const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
        const safeService = new SafeApiKit({txServiceUrl, ethAdapter: this.ethAdapterOwner1})

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

        // const pendingTransactions = await safeService.getPendingTransactions(safeAddress).results
        const executeTxResponse = await safeSDK.executeTransaction(signedUOP.signedSafeTx)
        const receipt = await executeTxResponse.transactionResponse?.wait()

        // console.log('pendingTransactions', pendingTransactions)
        console.log('Transaction executed:')
        console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)
    }

    isBatchSupported() {
        return false
    }

    packTx(invoke) {
        return {
            to: invoke.to,
            value: invoke.value,
            data: invoke.data
        }
    }

    packBatchTx(invokes) {
        alert('batch tx not supported')
    }
}