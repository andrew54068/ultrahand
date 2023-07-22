import {UltrahandComponent} from "../core/ultrahandComponent";
import {ethers} from "ethers";
import {UltrahandWallet} from "../core/ultrahandWallet";

export class AaveComponent extends UltrahandComponent {

    polygonAddress = "0x1e4b7A6b903680eab0c5dAbcb8fD429cD2a9598c"
    pool = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"
    aaveABI = [
        'function depositETH(address pool,address onBehalfOf,uint16 referralCode)'
    ]

    static id() {
        return "aaveComponent"
    }

    async run(inputs) {
        if (!inputs || inputs.length < 1) {
            throw new Error("input 0 is required")
        }

        console.log(inputs)

        let walletAddress = UltrahandWallet.currentWallet.currentAddress()
        let aaveContract = new ethers.utils.Interface(this.aaveABI);
        let callData = aaveContract.encodeFunctionData("depositETH", [this.pool, walletAddress, 0]);
        this.addInvoke({
            to: this.polygonAddress,
            value: inputs[0].value,
            data: callData
        })
        this.output = []
    }
}