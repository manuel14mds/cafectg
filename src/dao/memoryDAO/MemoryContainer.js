export default class MemoryContainer {

    constructor() {
        this.data = []
    }

    getAll = () => {
        return this.data
    }

    save = (element) => {
        this.data.push(element)
        return element.id
    }

    getById = (id) => {
        let result = this.data.find((element) => element.id == id)
        return result
    }

    deleteById = (id) => {
        let newData = this.data.filter((element) => element.id != id)
        this.data = newData
    }

    update = (id, object) => {
        let index = this.data.findIndex((element) => element.id == id)
        let result = this.getById(id)

        if (object.id) delete object.id
        for (const item in object) {
            result[item] = object[item]
        }

        this.data[index] = result
        return this.data[index]
    }

    deleteAll = () => {
        this.data = []
    }
}