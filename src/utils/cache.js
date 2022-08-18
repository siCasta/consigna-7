class Cache {
    constructor() {
        this.cache = {}
    }

    get(key) {
        return this.cache[key]
    }

    set(key, value) {
        this.cache[key] = value
    }

    clear() {
        this.cache = null
    }
}

export default Cache