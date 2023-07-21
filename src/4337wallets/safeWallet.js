import {UltrahandWallet} from "../core/ultrahandWallet";
import {Web3AuthModalPack, SafeAuthKit} from '@safe-global/auth-kit';
import Safe, { EthersAdapter, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit'
import {OpenloginAdapter} from '@web3auth/openlogin-adapter';
import {CHAIN_NAMESPACES, WALLET_ADAPTERS} from "@web3auth/base";
import {Web3AuthOptions} from '@web3auth/modal';
import { ethers } from 'ethers'

export class SafeWallet extends UltrahandWallet {

    constructor() {
        super()
    }

    currentAddress() {
        return ""
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
        const signer = provider.getSigner();

        const signerAddress = await signer.getAddress();

        const signerChainId = await signer.getChainId()
        console.log(`💥 signerChainId: ${signerChainId}`);

        const ethAdapterOwner1 = new EthersAdapter({
            ethers,
            signerOrProvider: signer || provider
          })

        const safeAccountConfig: SafeAccountConfig = {
            owners: [
                signerAddress,
            ],
            threshold: 1,
          }

        const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
        const predictSafeAddress = await safeFactory.predictSafeAddress(safeAccountConfig)
        console.log(`💥 predictSafeAddress: ${JSON.stringify(predictSafeAddress, null, '  ')}`);
        /**
         * deploy address
         */
        const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })
        const safeAddress = await safeSdkOwner1.getAddress()

        /**
         * already deploy address
         * const safeAddress = "0x9Be8EE8e11B0Fc9Edf26883809C58C4bb2E6d095"
         */

        const safeSDK = await Safe.create({
            ethAdapter: ethAdapterOwner1,
            safeAddress
        })
        
        // Create a Safe transaction with the provided parameters
        const safeTransactionData: MetaTransactionData = {
            to: '0xF4911Cb13b50D967b9603c747e558dA7c1457e91',
            data: '0x',
            value: ethers.utils.parseUnits('0.00001', 'ether').toString()
        }
          
        const safeTransaction = await safeSDK.createTransaction({ safeTransactionData })

        console.log(`💥 safeTransaction: ${JSON.stringify(safeTransaction, null, '  ')}`);

        // setSafeAuthSignInResponse(signInInfo)
        // setUserInfo(userInfo || undefined)
        // setProvider(web3AuthModalPack.getProvider())
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