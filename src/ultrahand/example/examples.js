import {ComponentGraph} from "../core/componentGraph";
import {UltrahandWallet} from "../core/ultrahandWallet";
import {BloctoWallet} from "../4337wallets/bloctoWallet";
import {SafeWallet} from "../4337wallets/safeWallet";
import {LidoComponent} from "../components/lidoComponent";
import {InvokePool} from "../core/invokePool";
import {UserOperationPool} from "../core/userOperationPool";

let componentGraphTest = async (nodes) => {
    await new ComponentGraph(nodes).run()
}

let connectSafeTest = async () => {
    UltrahandWallet.setCurrentWallet(new SafeWallet())
    await UltrahandWallet.currentWallet.connect()
}

let connectBloctoTest = async () => {
    UltrahandWallet.setCurrentWallet(new BloctoWallet())
    await UltrahandWallet.currentWallet.connect()
}

let lidoTest = async () => {
    new LidoComponent().run()
}

let safeTest = async () => {

    await connectSafeTest()
    InvokePool.getSingleton().clearInvoke()
    UserOperationPool.getSingleton().clear()
    await componentGraphTest(
        [
            {
                level: 0,
                index: 0,
                componentID: 'lidoComponent',
                inputs: [
                    {
                        type: "custom",
                        name: "input 0",
                        description: "input 0 description",
                        valueType: "string",
                        value: "abcdefg",
                        optionIndex: 0,
                    },
                    {
                        type: "custom",
                        name: "input 1",
                        description: "input 1 description",
                        valueType: "number",
                        value: 123,
                        optionIndex: 1,
                    },
                ]
            },
        ]
    )
    let unsignedUOP = UserOperationPool.getSingleton().popUserOperation()
    let signedUOP = await UltrahandWallet.currentWallet.simulateTx(unsignedUOP)
    await UltrahandWallet.currentWallet.sendTx(signedUOP)
}


let bloctoTest = async () => {
    await connectBloctoTest()
    InvokePool.getSingleton().clearInvoke()
    UserOperationPool.getSingleton().clear()

    await componentGraphTest([
        {
            level: 0,
            index: 0,
            componentID: '1inchComponent',
            inputs: [
                {
                    value: "10000",
                    optionIndex: 0,
                },
            ]
        },
        {
            level: 1,
            index: 1,
            componentID: 'aaveComponent',
            inputs: [
                {
                    type: "link",
                    value: {
                        componentIndex: 0,
                        outputIndex: 0,
                    },
                },
            ]
        },
    ])

    let unsignedUOP = UserOperationPool.getSingleton().popUserOperation()
    let signedUOP = await UltrahandWallet.currentWallet.simulateTx(unsignedUOP)
    await UltrahandWallet.currentWallet.sendTx(signedUOP)
}
