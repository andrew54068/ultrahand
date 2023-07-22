export class UserOperationPool {

    pool = []

    static singleton = new UserOperationPool()

    static getSingleton() {
        return UserOperationPool.singleton
    }

    constructor() {
    }

    addUserOperation(operation) {
        this.pool.push(operation)
    }

    popUserOperation() {
        return this.pool.shift()
    }

    clear() {
        this.pool = []
    }
}