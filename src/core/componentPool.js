import {TestComponent} from "../components/testComponent";
import {LidoComponent} from "../components/lidoComponent";

export class ComponentPool {

    static defaultPool = [
        TestComponent,
        LidoComponent
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