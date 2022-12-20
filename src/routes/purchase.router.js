import { Router } from 'express'
import purchaseController from '../controllers/purchase.controller.js'
import {validateBid, validateCid} from '../middelwares/IDsValidator.js'

const router = Router ()

router.get('/', purchaseController.get)
router.post('/:cid', validateCid, purchaseController.create)
router.get('/:bid', purchaseController.getById)

export default router