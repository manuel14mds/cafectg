import * as fs from 'fs'
import __dirname from '../../utils.js'

export default class MemoryContainer {

    constructor() {
    }

    getAll = async () => {
        if (fs.existsSync(this.path)) {
            let fileData = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(fileData)
        } else {
            return []
        }
    }

    save = async (element) => {
        let data = await this.getAll()
        data.push(element)
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t'))
        return element.id
    }

    getById = async (id) => {
        let list = await this.getAll()
        let result = list.find((element) => element.id == id)
        return result
    }

    deleteById = async (id) => {
        let list = await this.getAll()
        let newData = list.filter((element) => element.id != id)
        await fs.promises.writeFile(this.path, JSON.stringify(newData, null, '\t'))
    }

    update = async (id, object) => {
        let list = await this.getAll()

        let index = list.findIndex((element) => element.id == id)
        let result = await this.getById(id)

        if (object.id) delete object.id
        for (const item in object) {
            result[item] = object[item]
        }

        list[index] = result
        await fs.promises.writeFile(this.path, JSON.stringify(list, null, '\t'))
        return result
    }

    deleteAll = async ()=>{
        await fs.promises.writeFile(this.path, JSON.stringify([], null, '\t'))
    }
}