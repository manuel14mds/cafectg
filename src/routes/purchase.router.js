import { Router } from 'express'

import purchaseController from '../controllers/purchase.controller.js'
import { validateBid, validateCid } from '../middelwares/IDsValidator.js'
import { loginValidater } from '../middelwares/authUser.js'

const router = Router()

// get all purchases 
router.get('/', purchaseController.get)

// create a new purchase
router.post('/:cid', loginValidater, validateCid, purchaseController.create)

// get a purchase
router.get('/:bid', validateBid, purchaseController.getById)


export default router