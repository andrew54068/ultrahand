import {UltrahandWallet} from "../core/ultrahandWallet";
import {Web3AuthModalPack} from '@safe-global/auth-kit';
import {OpenloginAdapter} from '@web3auth/openlogin-adapter';
import {CHAIN_NAMESPACES, WALLET_ADAPTERS} from "@web3auth/base";
import {Web3AuthOptions} from '@web3auth/modal';

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

        const web3AuthModalPack = new Web3AuthModalPack({
            txServiceUrl: 'https://safe-transaction-goerli.safe.global'
        })

        await web3AuthModalPack.init({options, adapters: [openloginAdapter], modalConfig})

        const signInInfo = await web3AuthModalPack.signIn()
        console.log('SIGN IN RESPONSE: ', signInInfo)

        const userInfo = await web3AuthModalPack.getUserInfo()
        console.log('USER INFO: ', userInfo)

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