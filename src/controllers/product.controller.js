import pino from "pino"
import persistenceFactory from '../dao/Factory.js'
import __dirname from "../utils.js"
import userAdmin from '../app.js'

const streams = [
    {level:'info', stream:process.stdout},
    {level:'warn', stream:pino.destination(__dirname+'/logFiles/warn.log')},
    {level:'error', stream:pino.destination(__dirname+'/logFiles/error.log')},
]
const logger = pino({},pino.multistream(streams))

const getAll = async (req,res)=>{
    let products = await persistenceFactory.ProductService.getAll()
    console.log(products)
    res.send({products})
}

const getByCategory = async (req,res) => {
    let products = await persistenceFactory.ProductService.getAll()
    let data =[]
    products.forEach(element => {
        data.push(element._doc)
    });
    res.render('category', {data})
}
const update = async (req,res) => {
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
                await persistenceFactory.ProductService.update(req.body)
                res.send({status:'success',message:'successfully saved'})
            } catch (error) {
                logger.error(`Couldn't update the product | Method: ${req.method} | URL: ${req.originalUrl}`)
                return res.status(500).send({status:'error', error:"it couldn't update the product"})
            }
        }
    }
}
const createBulk = async (req,res) => {
    let products = req.body
    try {
        for (let item of products) {
            await persistenceFactory.ProductService.addProduct(item)
        }
        res.send('products added')
    } catch (error) {
        res.status(500).send({error:error, message:'couldnt save products'})
    }
}
const add = async (req,res) => {
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/products' method 'POST' no authorized"})
    }else{
        const {name, price, stock} = req.body
        if(!name||!price||!stock||(typeof price != 'number')) return res.status(300).send({status:'error', error:"blank spaces are NOT allowed"})
        try {
            await persistenceFactory.ProductService.addProduct(req.body)
        } catch (error) {
            logger.error(`Couldn't save the product | Method: ${req.method} | URL: ${req.originalUrl}`)
            return res.status(500).send({status:'error', error:"it couldn't save the product"})
        }
        res.send({status:'success',message:'successfully saved' })
    }
}
const deleteOne = async (req,res) => {
    if(!userAdmin){
        return res.send({error:-1, descripction: "route '/products/:pid' method 'DELETE' no authorized"})
    }else{
        try {
            await persistenceFactory.ProductService.deleteById(req.params.pid)
        } catch (error) {
            logger.error(`Couldn't delete the product | Method: ${req.method} | URL: ${req.originalUrl}`)
            return res.status(500).send({status:'error', error:"it couldn't delete the product"})
        }
        res.send({status:'success',message:'successfully deleted' })
    }
}

export default {
    getAll,
    getByCategory,
    update,
    createBulk,
    add,
    deleteOne,
}