import {TestComponent} from "../components/testComponent";

export class ComponentPool {

    static defaultPool = [
        TestComponent
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