import {UltrahandComponent} from "../core/ultrahandComponent";

export class LidoComponent extends UltrahandComponent {

    polygonAddress = ""
    ethereumTestnetAddress = '0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F' // goerli

    static id() {
        return "lidoComponent"
    }

    static icon() {
        return "https://lido.fi/static/images/favicon/apple-touch-icon.png"
    }

    async run() {
        this.addInvoke({
            to: this.ethereumTestnetAddress,
            value: '0x186A0',
            data: '0xa1903eab'
        })
        this.output = []
    }
}