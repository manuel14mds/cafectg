import { Router } from "express"
import pino from "pino"

import services from '../dao/index.js'
import __dirname from "../utils.js"
import userAdmin from '../app.js'

const router = Router()
const streams = [
    {level:'info', stream:process.stdout},
    {level:'warn', stream:pino.destination(__dirname+'/logFiles/warn.log')},
    {level:'error', stream:pino.destination(__dirname+'/logFiles/error.log')},
]
const logger = pino({},pino.multistream(streams))

router.get('/', async(req,res)=>{
    let products = await services.ProductService.getAll()
    console.log(products)
    res.send({products})
})

router.get('/:pid', validatePid, async(req,res)=>{
    res.send(req.params.product)
})

router.get('/category', async(req,res)=>{
    let products = await services.ProductService.getAll()
    let data =[]
    products.forEach(element => {
        data.push(element._doc)
    });
    res.render('category', {data})
})

router.put('/:pid', validatePid, async (req,res)=>{
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/products/:pid' method 'PUT' no authorized"})
    }else{
        const {name, price, stock, enable} = req.body
        if(!name||!price||!stock||!enable){
            return res.status(400).send({status:'error', error:"blank spaces are NOT allowed"})
        }else{
            try {
                req.body.id=req.params.pid
                console.log(req.body)
                await services.ProductService.update(req.body)
                res.send({status:'success',message:'successfully saved'})
            } catch (error) {
                logger.error(`Couldn't update the product | Method: ${req.method} | URL: ${req.originalUrl}`)
                return res.status(500).send({status:'error', error:"it couldn't update the product"})
            }
        }
    }
})

router.post('/',async (req,res)=>{
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/products' method 'POST' no authorized"})
    }else{
        const {name, price, stock} = req.body
        if(!name||!price||!stock||(typeof price != 'number')) return res.status(300).send({status:'error', error:"blank spaces are NOT allowed"})
        try {
            await services.ProductService.addProduct(req.body)
        } catch (error) {
            logger.error(`Couldn't save the product | Method: ${req.method} | URL: ${req.originalUrl}`)
            return res.status(500).send({status:'error', error:"it couldn't save the product"})
        }
        res.send({status:'success',message:'successfully saved' })
    }
})

router.delete('/:pid', validatePid, async(req,res)=>{
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/products/:pid' method 'DELETE' no authorized"})
    }else{
        try {
            await services.ProductService.deleteById(req.params.pid)
        } catch (error) {
            logger.error(`Couldn't delete the product | Method: ${req.method} | URL: ${req.originalUrl}`)
            return res.status(500).send({status:'error', error:"it couldn't delete the product"})
        }
        res.send({status:'success',message:'successfully deleted' })
    }
})

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