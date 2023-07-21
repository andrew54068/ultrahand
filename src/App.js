import logo from './logo.svg';
import './App.css';
import {ComponentGraph} from "./core/componentGraph";
import {BloctoWallet} from "./4337wallets/bloctoWallet";
import {SafeWallet} from "./4337wallets/safeWallet";

function App() {

  let componentGraphTest = () => {
    new ComponentGraph([
      {
        level: 0,
        index: 0,
        componentID: 'testComponent',
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
      {
        level: 0,
        index: 0,
        componentID: 'testComponent2',
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
      }
    ]).run()
  }

  let connectTest = async () => {
    await new SafeWallet().connect()
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
        }}>Test</button>
      </header>
    </div>
  );
}

export default App;
