import {ComponentPool} from "./componentPool";

export class ComponentGraph {
    examples = [
        {
            level: 0,
            index: 0,
            componentID: 'component A',
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
            level: 1,
            index: 1,
            componentID: 'component B',
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
                    type: "link",
                    name: "input 1",
                    description: "input 1 description",
                    valueType: "number",
                    value: {
                        componentIndex: 0,
                        outputIndex: 0,
                    },
                    optionIndex: 1,
                },
            ]
        },
    ]

    constructor(nodes = []) {
        this.nodes = nodes
    }

    run() {

        // level first, index second, the both value must be unique & sequential
        // index == 0 -> inputs must be custom
        // same level -> components can not be linked with each other
        // input type == link -> component level must be lower than current level
        // input type == link -> need to check component output spec -> valueType must be the same & output index must exist
        this.nodes.forEach(node => {
            let impl = new ComponentPool().getComponent(node.componentID)
            if (impl == null) {
                alert('component not found: ' + node.componentID)
            } else {
                new impl().Run()
            }
        })
    }
}