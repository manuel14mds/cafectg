import mongoose from "mongoose";

const collection = 'products'

const productsSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:String,
    thumbnail:String,
    price:{
        type:Number,
        require:true
    },
    stock:{
        type:Number,
        require:true
    },
    code:String,
    enable:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const productModelService = mongoose.model(collection,productsSchema)
export default productModelService