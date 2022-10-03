import dotenv from 'dotenv'
import __dirname from '../src/utils.js'

const mode = process.argv.slice(2)[0]
let path
if(mode === "DEV"){
    path = __dirname+'/../.env.dev'
}else{
    path = __dirname+'/../.env.prod'
}

dotenv.config({
    path:path
})

export default {
    app:{
        MODE:process.env.MODE||'PROD',
        PORT:process.env.PORT||3000,
        DEBUG:process.env.DEBUG||false,
        MONGO_URL:process.env.MONGO_URL||'NONE'
    }
}