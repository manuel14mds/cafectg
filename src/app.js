import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import pino from 'pino'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import initializePassport from './config/passport.config.js'
import __dirname from './utils.js'
import config from './config/config.js'

import viewsRouter from './routes/views.router.js'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import sessionsRouter from './routes/sessions.router.js'

const streams = [
    {level:'info', stream:process.stdout},
    {level:'warn', stream:pino.destination(__dirname+'/logFiles/warn.log')},
]
const logger = pino({},pino.multistream(streams))
const app = express()

const hbs = handlebars.create({
    extname:'handlebars',
    defaultLayout:'main',
    layoutsDir:__dirname+'/views/layouts',
    partialsDir:__dirname+'/views/partials'
})
app.engine('handlebars', hbs.engine)
app.set('views', __dirname+'/views')
app.set('partials',__dirname + '/views/partials')
app.set('view engine', 'handlebars')
/* app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('partials',__dirname + '/views/partials')
app.set('view engine', 'handlebars') */


app.use(express.json())
app.use(express.static(__dirname+'/public'))
app.use(cookieParser())

initializePassport()
app.use(passport.initialize())

app.use('/',viewsRouter)
app.use('/api/products',reqInfo,productRouter)
app.use('/api/carts',reqInfo,cartRouter)
app.use('/api/sessions', sessionsRouter)


app.get('/*:params',(req,res)=>{
    res.send({ error : -2, descripcion: `route '/${req.params[0]}' method 'GET' no implemented`})
})
function reqInfo(req,res,next){
    logger.info(`Method: ${req.method} | URL: ${req.protocol + '://' + req.get('host') + req.originalUrl}`)
    next()
}

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, ()=> console.log(`listening on ${PORT} port`))
const MONGO_URL = `mongodb+srv://${config.mongo.USER}:${config.mongo.PSW}@clusterprueba.fp95ssd.mongodb.net/${config.mongo.DB}?retryWrites=true&w=majority`

mongoose.connect(MONGO_URL, err=>{
    err?console.log(MONGO_URL,err):console.log('connected to Atlas Mongo')
})


let userAdmin = true
export default userAdmin