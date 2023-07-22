export class GlobalConfig {
    nodes = []

    static singleton = new GlobalConfig()

    update = () => {

    }

    static getSingleton() {
        return GlobalConfig.singleton
    }

    constructor() {
    }

    addNode(node) {
        this.nodes.push(node)
        this.update()
    }

    clearNodes() {
        this.nodes = []
        this.update()
    }
}