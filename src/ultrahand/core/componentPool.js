import {LidoComponent} from "../components/lidoComponent";
import {TransferComponent} from "../components/transferComponent";
import {OneInchComponent} from "../components/1inchComponent";
import {AaveComponent} from "../components/aaveComponent";

export class ComponentPool {

    static defaultPool = [
        LidoComponent,
        TransferComponent,
        OneInchComponent,
        AaveComponent
    ]

    components = {}

    constructor() {
        ComponentPool.defaultPool.forEach((component) => {
            console.log(component.id())
            this.components[component.id()] = component
        })
    }

    getComponent(componentID) {
        return this.components[componentID]
    }
}