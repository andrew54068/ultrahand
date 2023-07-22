import {InvokePool} from "./invokePool";

export class UltrahandComponent {

    output = []

    constructor() {

    }

    static id() {
        // override this method
    }

    static icon() {
        // override this method
        return "https://1inch.io/img/favicon/safari-pinned-tab.svg"
    }

    async run() {
        // override this method
    }

    async Run(inputs) {
        // clear invoke pool by component id
        let invokeNum = InvokePool.getSingleton().invokeNum()
        await this.run(inputs);
        if (invokeNum === InvokePool.getSingleton().invokeNum()) {
            InvokePool.getSingleton().packIntoUserOperation()
        }
    }

    addInvoke(invoke) {
        InvokePool.getSingleton().addInvoke(invoke);
    }

    getOutput() {
        return this.output
    }

    inputOptions() {
        return []
    }

    customInputMsg() {
        return ""
    }

    inputMsg() {
        return ""
    }

    outputMsg() {
        return ""
    }

}