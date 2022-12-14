import productModelService from '../../models/Products.model.js'
import MongoContainer from "./MongoContainer.js";
import ProductDTO from '../DTOs/DTO.product.js'
export default class Products extends MongoContainer{
    constructor(){
        super()
        this.modelService = productModelService
    }

    getAll = async () => {
        let data =  await this.modelService.find().lean()
        const products = data.map(product => new ProductDTO(product._id, product))
        return products
    }

    //generate a new product code
    codeGenerator = async () => {
        let codes = await this.modelService.find({}, {code:1, _id:0})
        let new_code = ''
        if(!codes){
            new_code = (Math.random() + 1).toString(36).substring(7)
        }else{
            do {
                new_code = (Math.random() + 1).toString(36).substring(7)
            } while (codes.some(code => code === new_code))
        }
        return new_code
    }

    //Add a new product
    addProduct = async (product) => {
        product.code = await this.codeGenerator()
        let result = await this.save(product)
        return result
    }
    //Filter products by categories
    findByCategory = async (category)=>{
        let result = []
        let ctg = ''
        switch (category) {
            case 'co':
                result = await this.modelService.find({country:'Colombia'}).lean()
                ctg = 'Colombia'
                break;
            case 'pa':
                result = await this.modelService.find({country:'Panamá'}).lean()
                ctg = 'Panamá'
                break;
            case 'gt':
                result = await this.modelService.find({country:'Guatemala'}).lean()
                ctg = 'Guatemala'
                break;
            case 'jv':
                result = await this.modelService.find({brand:'Juan Valdez'}).lean()
                ctg = 'Juan Valdéz'
                break;
            case 'om':
                result = await this.modelService.find({brand:'Café oma'}).lean()
                ctg = 'Café oma'
                break;
            case 'du':
                result = await this.modelService.find({brand:'Café DURÁN'}).lean()
                ctg = 'Café DURÁN'
                break;
            case 'ev':
                result = await this.modelService.find({brand:'Café Entre Valles'}).lean()
                ctg = 'Café Entre Valles'
                break;
        }
        const products = result.map(product => new ProductDTO(product._id, product))
        return {products, category:ctg}
    }
    // purchase: decrese product qty
    purchaseSubst = async(cart)=>{
        try {
            let product = {}
            for (const item of cart.products) {
                product = await this.getById(item.product)
                product.stock -= item.qty
                await this.update(product.id, product)
            }
        } catch (error) {
            return false
        }
        return true
    }
}