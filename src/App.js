import logo from './logo.svg';
import './App.css';
import {ComponentGraph} from "./ultrahand/core/componentGraph";
import {BloctoWallet} from "./ultrahand/4337wallets/bloctoWallet";
import {SafeWallet} from "./ultrahand/4337wallets/safeWallet";
import {LidoComponent} from "./ultrahand/components/lidoComponent";
import {InvokePool} from "./ultrahand/core/invokePool";
import {UserOperationPool} from "./ultrahand/core/userOperationPool";
import {UltrahandWallet} from "./ultrahand/core/ultrahandWallet";

function App() {

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
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <button onClick={async () => {
                    // await connectSafeTest()
                    // new OneInchComponent().run()
                    // return
                    // safe test
                    // await connectSafeTest()
                    // InvokePool.getSingleton().clearInvoke()
                    // UserOperationPool.getSingleton().clear()
                    // await componentGraphTest(
                    //     [
                    //       {
                    //         level: 0,
                    //         index: 0,
                    //         componentID: 'lidoComponent',
                    //         inputs: [
                    //           {
                    //             type: "custom",
                    //             name: "input 0",
                    //             description: "input 0 description",
                    //             valueType: "string",
                    //             value: "abcdefg",
                    //             optionIndex: 0,
                    //           },
                    //           {
                    //             type: "custom",
                    //             name: "input 1",
                    //             description: "input 1 description",
                    //             valueType: "number",
                    //             value: 123,
                    //             optionIndex: 1,
                    //           },
                    //         ]
                    //       },
                    //     ]
                    // )
                    // let unsignedUOP = UserOperationPool.getSingleton().popUserOperation()
                    // let signedUOP = await UltrahandWallet.currentWallet.simulateTx(unsignedUOP)
                    // await UltrahandWallet.currentWallet.sendTx(signedUOP)

                    // blocto test
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
                }}>Test
                </button>
            </header>
        </div>
    );
}

export default App;
