import { Router } from 'express'
import purchaseController from '../controllers/purchase.controller.js'
import {validateBid, validateCid} from '../middelwares/IDsValidator.js'
import {loginValidater} from '../middelwares/authUser.js'

const router = Router ()

router.get('/', purchaseController.get)
router.post('/:cid', loginValidater, validateCid, purchaseController.create)
router.get('/:bid', validateBid, purchaseController.getById)

router.all('/*:params',(req,res)=>{
    logger.warn(`route not implemented -> ${req.originalUrl} Method: ${req.method}` )
    res.send({ error : -2, descripcion: `route ${req.originalUrl}' Method: ${req.method} no implemented`})
})

export default router