import logo from './logo.svg';
import './App.css';
import {ComponentGraph} from "./core/componentGraph";
import {BloctoWallet} from "./4337wallets/bloctoWallet";
import {SafeWallet} from "./4337wallets/safeWallet";
import {LidoComponent} from "./components/lidoComponent";
import {InvokePool} from "./core/invokePool";
import {UserOperationPool} from "./core/userOperationPool";
import {UltrahandWallet} from "./core/ultrahandWallet";

function App() {

  let componentGraphTest = () => {
    new ComponentGraph([
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
      // {
      //   level: 0,
      //   index: 0,
      //   componentID: 'testComponent2',
      //   inputs: [
      //     {
      //       type: "custom",
      //       name: "input 0",
      //       description: "input 0 description",
      //       valueType: "string",
      //       value: "abcdefg",
      //       optionIndex: 0,
      //     },
      //     {
      //       type: "custom",
      //       name: "input 1",
      //       description: "input 1 description",
      //       valueType: "number",
      //       value: 123,
      //       optionIndex: 1,
      //     },
      //   ]
      // }
    ]).run()
  }

  let connectTest = async () => {
    UltrahandWallet.setCurrentWallet(new SafeWallet())
    await UltrahandWallet.currentWallet.connect()
  }

  let lidoTest = async () => {
    new LidoComponent().run()
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
        <button onClick={ async () => {
          await connectTest()
          InvokePool.getSingleton().clearInvoke()
          UserOperationPool.getSingleton().clear()
          await componentGraphTest()
          let unsignedUOP = UserOperationPool.getSingleton().popUserOperation()
          let signedUOP = await UltrahandWallet.currentWallet.simulateTx(unsignedUOP)
          await UltrahandWallet.currentWallet.sendTx(signedUOP)
        }}>Test</button>
      </header>
    </div>
  );
}

export default App;
