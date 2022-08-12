
import * as fs from 'fs'
import __dirname from '../utils.js'

class ProductManager {
    constructor() {
        this.path = __dirname + '/files/products.json'
    }

    //return all products saved
    getAll = async () => {
        try {
            if (fs.existsSync(this.path)) {
                let fileData = await fs.promises.readFile(this.path, 'utf-8')
                let products = JSON.parse(fileData)
                return products
            } else {
                return []
            }
        } catch (error) {
            console.log('product manager error, getAll()')
            console.log(error)
        }
    }

    //add a new product and return its id
    addProduct = async (product) => {
        try {
            let products = await this.getAll()
            if (products.length === 0) {
                product.id = 1
                product.code = (Math.random() + 1).toString(36).substring(7) //create a random code
                product.enable = true
                product.time_stamp = Date.now().toLocaleString()
                products.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
                return product.id
            } else {
                product.id = products[products.length - 1].id + 1
                product.code = this.codeGenerator(products)
                product.time_stamp = Date.now().toLocaleString()
                product.enable = true
                products.push(product)
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
                return product.id
            }
        } catch (error) {
            console.log('product manager error, addProduct()')
            console.log(error)
        }
    }

    //generate a new product code
    codeGenerator = (products) => {
        let new_code = ''
        do {
            new_code = (Math.random() + 1).toString(36).substring(7)
        } while (products.some(e => e.code === new_code))
        return new_code
    }

    //return a product due an id
    getProductById = async (id) => {
        try {
            let products = await this.getAll()
            let product = null
            for (const item of products) {
                if (item.id === id) {
                    product = item
                }
            }
            return product
        } catch (error) {
            console.log('product manager error, getProductById()')
            console.log(error)
        }
    }

    //delete a product by id
    deleteProductById = async (id) => {
        try {
            let products = await this.getAll()
            let newproducts = []
            for (const item of products) {
                if (item.id === id) {
                    continue
                }
                newproducts.push(item)
            }
            await fs.promises.writeFile(this.path, JSON.stringify(newproducts, null, '\t'))
        } catch (error) {
            console.log('product manager error, deleteProductById')
            console.log(error)
        }
    }

    //delete all products
    deleteAll = async () => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify([], null, '\t'))
        } catch (error) {
            console.log('product manager error, deleteAll')
            console.log(error)
        }
    }

    updateProduct = async (id, newData) => {
        try {
            let product = await this.getProductById(id) //original product
            let keysProduct = Object.keys(product)
            for (const key of keysProduct) {
                if (product[key] != newData[key]) {
                    product[key] = newData[key]
                }
            }
            let productsArray = await this.getAll()
            let newproducts = []
            for (const item of productsArray) {
                if (item.id === id) {
                    newproducts.push(product)
                    continue
                }
                newproducts.push(item)
            }
            await fs.promises.writeFile(this.path, JSON.stringify(newproducts, null, '\t'))
        } catch (error) {
            console.log('product manager error, updateProduct()')
            console.log(error)
        }
    }
}

export default ProductManager