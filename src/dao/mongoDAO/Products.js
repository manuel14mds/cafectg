import productModelService from '../../models/Products.model.js'
import MongoContainer from "./MongoContainer.js";
export default class Products extends MongoContainer{
    constructor(){
        super()
        this.modelService = productModelService
    }

    //generate a new product code
    codeGenerator = async () => {
        let codes = await this.modelService.find({}, {code:1, _id:0})
        //let product = await this.modelService.find({_id:'631129ad3ccd80cdc3c7dfd9'})
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
        let products = []
        try {
            switch (category) {
                case 'co':
                    products = await this.modelService.find({country:'Colombia'}).lean()
                    break;
                case 'pa':
                    products = await this.modelService.find({country:'Panamá'}).lean()
                    break;
                case 'gt':
                    products = await this.modelService.find({country:'Guatemala'}).lean()
                    break;
                case 'jv':
                    products = await this.modelService.find({brand:'Juan Valdez'}).lean()
                    break;
                case 'om':
                    products = await this.modelService.find({brand:'Café oma'}).lean()
                    break;
                case 'du':
                    products = await this.modelService.find({brand:'Café DURÁN'}).lean()
                    break;
                case 'ev':
                    products = await this.modelService.find({brand:'Café Entre Valles'}).lean()
                    break;
            }
        } catch (error) {
            console.log('error: ',error)
        }
        return products
    }
}