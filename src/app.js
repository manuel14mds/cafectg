import express from 'express'
import mongoose from 'mongoose'
import pino from 'pino'

import __dirname from './utils.js'
import config from '../config/config.js'

import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'

const app = express()
const PORT = config.app.PORT
const MONGO_URL = config.app.MONGO_URL
//const PORT = process.env.PORT||8080
const server = app.listen(PORT, ()=> console.log(`listening on ${PORT} port`))

mongoose.connect(MONGO_URL, err=>{
    if(err){
        console.log(err)
    }else{
        console.log('connected to Atlas Mongo')
    }
})

let userAdmin = true

const streams = [
    {level:'info', stream:process.stdout},
    {level:'warn', stream:pino.destination(__dirname+'/logFiles/warn.log')},
]
const logger = pino({},pino.multistream(streams))

app.use(express.json())
app.use(express.static(__dirname+'/public'))

app.use('/api/products',reqInfo,productRouter)
app.use('/api/carts',reqInfo,cartRouter)

app.get('/',reqInfo,(req,res)=>{
    res.send('holaaaa principal')
})

app.get('/*:params',(req,res)=>{
    res.send({ error : -2, descripcion: `route '/${req.params[0]}' method 'GET' no implemented`})
})
function reqInfo(req,res,next){
    logger.info(`Method: ${req.method} | URL: ${req.protocol + '://' + req.get('host') + req.originalUrl}`)
    next()
}

export default userAdmin
