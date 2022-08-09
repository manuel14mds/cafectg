import express from 'express'
import __dirname from './utils.js'

const app = express()

const server = app.listen(8080, ()=> console.log('listening on 8080 port'))

app.use(express.json())
app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.send('holaaaa')
})