import {UltrahandComponent} from "../core/ultrahandComponent";

export class TransferComponent extends UltrahandComponent {

    static id() {
        return "transferComponent"
    }

    static icon() {
        return 'https://cdn-icons-png.flaticon.com/128/876/876784.png'
    }

    async run() {
        this.addInvoke({
            to: '0x2D46CB6bb4Ede661B523D97C612c185520927591',
            value: '0x186A0',
            data: ''
        })
        this.output = []
    }
}