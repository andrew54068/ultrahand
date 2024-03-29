import {ApeCoinComponent} from "../components/apeCoinComponent";
import {TransferComponent} from "../components/transferComponent";
import {OneInchComponent} from "../components/1inchComponent";
import {AaveComponent} from "../components/aaveComponent";

export class ComponentPool {

    static defaultPool = [
        TransferComponent,
        OneInchComponent,
        AaveComponent,
        ApeCoinComponent,
    ]

    components = {}

    constructor() {
        ComponentPool.defaultPool.forEach((component) => {
            this.components[component.id()] = component
        })
    }

    getComponent(componentID) {
        return this.components[componentID]
    }
}