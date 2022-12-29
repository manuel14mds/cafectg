import wishListModelService from '../../models/WhishList.model.js'
import MongoContainer from "./MongoContainer.js";
import DTOwhishList from '../DTOs/DTOwishList.js'

export default class WhishList extends MongoContainer{
    constructor(){
        super()
        this.modelService = wishListModelService
    }

    create = async () => {
        let result = await this.save({})
        result.id = result._id
        return result
    }

    getAll = async () => {
        let data =  await this.modelService.find().lean()
        const whishLists = data.map(item => new DTOwhishList(item._id, item))
        return whishLists
    }

    // return a populated wish list 
    getWhishList = async (id)=>{
        let result = await this.modelService.findOne({_id:id}).lean().populate('products.product')
        const whishList = new DTOwhishList(result._id, result)
        return whishList
    }

    // return a wish list
    getById = async (id)=>{
        let result = await this.modelService.findOne({_id:id}).lean()
        const whishList = new DTOwhishList(result._id, result)
        return whishList
    }
}