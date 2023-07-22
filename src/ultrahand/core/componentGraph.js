import {ComponentPool} from "./componentPool";
import {InvokePool} from "./invokePool";

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
                    name: "input 1",
                    description: "input 1 description",
                    valueType: "number",
                    type: "link",
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

    async run() {
        // level first, index second, the both value must be unique & sequential
        // index == 0 -> inputs must be custom
        // same level -> components can not be linked with each other
        // input type == link -> component level must be lower than current level
        // input type == link -> need to check component output spec -> valueType must be the same & output index must exist
        let prevOutput = []
        for (const node of this.nodes) {
            const index = this.nodes.indexOf(node);
            let impl = new ComponentPool().getComponent(node.componentID)
            if (impl == null) {
                alert('component not found: ' + node.componentID)
            } else {
                let instance = new impl()

                for (let i = 0; i < node.inputs.length; i++) {
                    if (node.inputs[i].type === 'link') {
                        const linkedOutput = prevOutput[node.inputs[i].value.outputIndex]
                        node.inputs[i].value = linkedOutput.value
                    }
                }
                await instance.Run(node.inputs)
                prevOutput = instance.getOutput()
                if (this.nodes.length - 1 === index) {
                    await InvokePool.getSingleton().packIntoUserOperation()
                }
            }
        }
    }
}