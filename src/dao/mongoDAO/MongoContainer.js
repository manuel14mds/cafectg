

export default class MongoContainer {
    constructor() {
    }

    save = async (element) => {
        let result = await this.modelService.create(element)
        result.id = result._id
        return result
    }

    getById = async (id) => {
        let result = await this.modelService.findOne({_id:id}).lean()
        result.id = result._id
        return result
    }

    deleteById = async (id) => {
        await this.modelService.deleteOne({_id:id})
    }

    update = async (id, object) => {
        let result = await this.modelService.updateOne({_id:id}, {$set:object})
        result.id = result._id
        return result
    }

    deleteAll = async ()=>{
        await this.modelService.deleteMany()
    }
}