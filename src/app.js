import express from 'express'
import mongoose from 'mongoose'
import pino from 'pino'

import __dirname from './utils.js'
import config from '../config/config.js'

import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'

const streams = [
    {level:'info', stream:process.stdout},
    {level:'warn', stream:pino.destination(__dirname+'/logFiles/warn.log')},
]
const logger = pino({},pino.multistream(streams))

const app = express()
const PORT = process.env.PORT || 8080
const MONGO_URL = `mongodb+srv://${config.mongo.USER}:${config.mongo.PSW}@clusterprueba.fp95ssd.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`
const server = app.listen(PORT, ()=> console.log(`listening on ${PORT} port`))
//const connection = mongoose.connect(`mongodb+srv://${config.mongo.USER}:${config.mongo.PSW}@clusterprueba.fp95ssd.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`)

mongoose.connect(MONGO_URL, err=>{
    err?console.log(MONGO_URL,err):console.log('connected to Atlas Mongo')
    //if(err){
    //    console.log(err)
    //}else{
    //    console.log('connected to Atlas Mongo')
    //}
})

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



let userAdmin = true
export default userAdmin