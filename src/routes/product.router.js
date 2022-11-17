import { Router } from "express"

import productController from "../controllers/product.controller.js"
import { validatePid } from "../middelwares/IDsValidator.js"

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


export default router