import { Router } from "express"

import productController from "../controllers/product.controller.js"
import { validatePid } from "../middelwares/IDsValidator.js"
import { prodBodyValidator } from '../middelwares/productBody.js'
import { prodCategoryValidator } from '../middelwares/productCategory.js'


const router = Router()

// get all products
router.get('/', productController.getAll)

// get products by category
router.get('/category', productController.getByCategory)

// get products by category
router.get('/:pid', prodCategoryValidator, validatePid, productController.getById)

// update product
router.put('/:pid', validatePid, productController.update)

// insert a list of products
router.post('/bulk', productController.createBulk)

// add product
router.post('/', prodBodyValidator, productController.add)

//delete product by id
router.delete('/:pid', validatePid, productController.deleteOne)



export default router