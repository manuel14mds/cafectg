import persistenceFactory from '../dao/Factory.js'
import __dirname from "../utils.js"
import { userAdmin, logger } from '../app.js'

// get all products
const getAll = async (req, res) => {
    try {
        let products = await persistenceFactory.ProductService.getAll()
        res.send({ status: 'success', payload: products })
    } catch (error) {
        logger.error(`Couldn't get all products -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            product.controller: getAll`)
        return res.status(500).send({ status: 'error', error: "Couldn't get all products" })
    }
}

// get product by ID
const getById = async (req, res) => {
    try {
        let product = await persistenceFactory.ProductService.getById(req.params.pid)
        res.send({ status: 'success', payload: product })
    } catch (error) {
        logger.error(`Couldn't get the product -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            product.controller: getById`)
        return res.status(500).send({ status: 'error', error: "Couldn't get the product" })
    }
}

// get products filter by categories
const getByCategory = async (req, res) => {
    try {
        const ctg = req.query.category

        if (ctg === 'all') {
            let products = await persistenceFactory.ProductService.getAll()
            return res.send({ status: 'success', payload: { products, ctg, category:'All Products'} })
        } else {
            let data = await persistenceFactory.ProductService.findByCategory(ctg)
            return res.send({ status: 'success', payload: { products:data.products, ctg, category:data.category } })
        }
    } catch (error) {
        logger.error(`Couldn't get product category list -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            product.controller: getByCategory`)
        return res.status(500).send({ status: 'error', error: "Couldn't get product category list" })
    }
}

// update product by ID
const update = async (req, res) => {
    if (!userAdmin) {
        return res.send({ error: -1, descripction: "route '/products/:pid' method 'PUT' no authorized" })
    } else {
        if (!req.body) {
            return res.status(400).send({ status: 'error', error: "blank spaces are NOT allowed" })
        } else {
            try {
                let result = await persistenceFactory.ProductService.update(req.params.pid, req.body)
                res.send({ status: 'success', message: 'update successfully', product: result })
            } catch (error) {
                logger.error(`Couldn't update the product -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
                    ${error}
                    product.controller: update`)
                return res.status(500).send({ status: 'error', error: "Couldn't update the product" })
            }
        }
    }
}

// create a product group
const createBulk = async (req, res) => {
    try {
        let products = req.body
        for (let item of products) {
            await persistenceFactory.ProductService.addProduct(item)
        }
        res.send('products added')
    } catch (error) {
        logger.error(`Couldnt save products -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            product.controller: createBulk`)
        res.status(500).send({ status: 'error', error: 'couldnt save products' })
    }
}

// create a new product
const add = async (req, res) => {
    try {
        const product = await persistenceFactory.ProductService.addProduct(req.body)
        res.send({ status: 'success', message: 'successfully saved', payload: product })
    } catch (error) {
        logger.error(`Couldn't save product -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            product.controller: add`)
        return res.status(500).send({ status: 'error', error: "it couldn't save the product" })
    }
}
// create a new product with image
const addProduct = async (req, res) => {
    try {
        
        req.body.thumbnail = req.file.filename
        const product = await persistenceFactory.ProductService.addProduct(req.body)
        res.send({ status: 'success', message: 'successfully saved', payload: product })
    } catch (error) {
        logger.error(`Couldn't save product -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            product.controller: add`)
        return res.status(500).send({ status: 'error', error: "it couldn't save the product" })
    }
}

// delete a product by ID
const deleteOne = async (req, res) => {
    try {
        await persistenceFactory.ProductService.deleteById(req.params.pid)
        res.send({ status: 'success', message: 'successfully deleted' })
    } catch (error) {
        logger.error(`Couldn't delete the product -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            product.controller: deleteOne`)
        return res.status(500).send({ status: 'error', error: "Couldn't delete the product" })
    }
}

export default {
    getAll,
    getByCategory,
    getById,
    update,
    createBulk,
    add,
    deleteOne,
    addProduct,
}