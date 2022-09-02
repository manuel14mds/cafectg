import mongoose from "mongoose";

const collection = 'carts'

const cartsSchema = mongoose.Schema({
    products:{
        type:Array,
        default:[]
    }
},{timestamps:true})

const cartModelService = mongoose.model(collection,cartsSchema)
export default cartModelService