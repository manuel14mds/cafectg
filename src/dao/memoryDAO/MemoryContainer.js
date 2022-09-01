export default class MemoryContainer {

    constructor() {
        this.data = []
    }

    getAll = () => {
        return this.data
    }

    save = (element) => {
        this.data.push(element)
        return element
    }

    getById = (id) => {
        let result = this.data.find((element) => element.id === id)
        return result
    }

    deleteById = (id) => {
        let newData = this.data.filter((element) => element.id != id)
        this.data = newData
    }

    update = (object) => {
        let index = this.data.findIndex((element) => element.id === object.id)
        this.data[index] = object
        return true
    }

    deleteAll = ()=>{
        this.data = []
    }
}