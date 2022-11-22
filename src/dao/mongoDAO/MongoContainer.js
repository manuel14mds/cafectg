

export default class MongoContainer {
    constructor() {
    }

    save = async (element) => {
        let result = await this.modelService.create(element)
        return result
    }

    getById = async (id) => {
        //let result = await this.modelService.findById(id) //cuidado con esta prueba, puede dar error, no testeada
        let result = await this.modelService.findOne({_id:id}).lean()
        return result
    }

    deleteById = async (id) => {
        await this.modelService.deleteOne({_id:id})
    }

    update = async (object) => {
        await this.modelService.updateOne({_id:object._id}, {$set:object})
    }

    deleteAll = async ()=>{
        await this.modelService.deleteMany()
    }
}