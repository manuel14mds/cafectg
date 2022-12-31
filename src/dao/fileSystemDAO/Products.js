import __dirname from '../../utils.js'
import FileSystemContainer from "./FileSystemContainer.js";
import ProductDTO from '../DTOs/DTO.product.js';
export default class Products extends FileSystemContainer {
    constructor() {
        super()
        this.path = __dirname + '/files/products.json'
    }

    //generate a new product code
    codeGenerator = async () => {
        let data = await this.getAll()
        let new_code = ''
        do {
            new_code = (Math.random() + 1).toString(36).substring(7)
        } while (data.some(e => e.code === new_code))
        return new_code
    }

    //Add a new product
    addProduct = async (product) => {
        let data = await this.getAll()
        if (data.length === 0) {
            product.id = 1
            product.code = (Math.random() + 1).toString(36).substring(7) //create a random code
            product.enable = true
            product.time_stamp = Date.now().toLocaleString()
            await this.save(product)
            return product.id
        } else {
            product.id = data[data.length - 1].id + 1
            product.code = await this.codeGenerator()
            product.time_stamp = Date.now().toLocaleString()
            product.enable = true
            await this.save(product)
            return product.id
        }

    }

    findByCategory = async (category) => {
        let data = await this.getAll()
        let result = []
        let ctg = ''
        switch (category) {
            case 'co':
                result = data.filter((e) => e.country == 'Colombia')
                ctg = 'Colombia'
                break;
            case 'pa':
                result = data.filter((e) => e.country == 'Panamá')
                ctg = 'Panamá'
                break;
            case 'gt':
                result = data.filter((e) => e.country == 'Guatemala')
                ctg = 'Guatemala'
                break;
            case 'jv':
                result = data.filter((e) => e.brand == 'Juan Valdez')
                ctg = 'Juan Valdéz'
                break;
            case 'om':
                result = data.filter((e) => e.brand == 'Café oma')
                ctg = 'Café oma'
                break;
            case 'du':
                result = data.filter((e) => e.brand == 'Café DURÁN')
                ctg = 'Café DURÁN'
                break;
            case 'ev':
                result = data.filter((e) => e.brand == 'Café Entre Valles')
                ctg = 'Café Entre Valles'
                break;
        }
        const products = result.map(product => new ProductDTO(product.id, product))
        return {products, category:ctg}
    }

    // purchase: decrese product qty
    purchaseSubst = async (cart) => {
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
