import { Router } from "express"

import productController from "../controllers/product.controller.js"
import services from '../dao/index.js'


const router = Router()

// get all products
router.get('/', productController.getAll)

// get products by category
router.get('/category', productController.getByCategory)

// update product
router.put('/:pid', validatePid, productController.update)

// insert a list of products
router.post('/bulk', productController.createBulk)

// add product
router.post('/', productController.add)

//delete product by id
router.delete('/:pid', validatePid, productController.deleteOne)

router.get('/*:params',(req,res)=>{
    logger.warn(`route not implemented -> ${req.originalUrl}`)
    res.send({ error : -2, descripcion: `route '/api/products/${req.params[0]}' method 'GET' no implemented`})
})

async function validatePid(req,res,next){
    try {
        req.params.product = await services.ProductService.getById(req.params.pid)
        if(!req.params.product) return res.status(404).send({status:'error', error:'Product not found'})
    } catch (error) {
        return res.status(404).send({status:'error', error:'Product not found'})
    }
    next()
}

export default router