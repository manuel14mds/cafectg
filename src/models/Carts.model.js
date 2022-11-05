import mongoose from "mongoose";

const collection = 'carts'

const cartsSchema = mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.SchemaTypes.ObjectId,
                ref:'products'
            },
            qty:Number
        }
    ]
},{timestamps:true})

const cartModelService = mongoose.model(collection,cartsSchema)
export default cartModelService