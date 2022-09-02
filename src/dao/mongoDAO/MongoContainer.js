
export default class MongoContainer {
    constructor() {
    }

    getAll = async () => {
        let data =  await this.modelService.find()
        return data
    }

    save = async (element) => {
        let result = await this.modelService.create(element)
        return result
    }

    getById = async (id) => {
        let result = await this.modelService.findOne({_id:id})
        return result
    }

    deleteById = async (id) => {
        await this.modelService.deleteOne({_id:id})
    }

    update = async (object) => {
        let id = object.id
        delete object.id
        await this.modelService.updateOne({_id:id}, {$set:object})
    }

    deleteAll = async ()=>{
        await this.modelService.deleteAll()
    }
}