import express from 'express'
import mongoose from 'mongoose'

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

app.use(express.json())
app.use(express.static(__dirname+'/public'))

app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)

app.get('/',(req,res)=>{
    res.send('holaaaa principal')
})

app.get('/*:params',(req,res)=>{
    res.send({ error : -2, descripcion: `route '/${req.params[0]}' method 'GET' no implemented`})
})

export default userAdmin
