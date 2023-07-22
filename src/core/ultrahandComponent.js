import {InvokePool} from "./invokePool";

export class UltrahandComponent {

    output = []

    constructor() {

    }

    static id() {
        // override this method
    }

    run() {
        // override this method
    }

    Run() {
        // clear invoke pool by component id
        let invokeNum = InvokePool.getSingleton().invokeNum()
        console.log("run component: " + this.constructor.name, "invokeNum: " + invokeNum)
        this.run();
        if (invokeNum === InvokePool.getSingleton().invokeNum()) {
            InvokePool.getSingleton().packIntoUserOperation()
        }
        console.log("run component: " + this.constructor.name, "invokeNum: " + invokeNum)
    }

    addInvoke(invoke) {
        InvokePool.getSingleton().addInvoke(invoke);
    }

    getOutput() {
        return this.output
    }

}