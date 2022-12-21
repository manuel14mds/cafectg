import { Router } from 'express'
import purchaseController from '../controllers/purchase.controller.js'
import {validateBid, validateCid} from '../middelwares/IDsValidator.js'
import {loginValidater} from '../middelwares/authUser.js'

const router = Router ()

router.get('/', purchaseController.get)
router.post('/:cid', loginValidater, validateCid, purchaseController.create)
router.get('/:bid', validateBid, purchaseController.getById)

export default router