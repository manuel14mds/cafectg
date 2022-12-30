import mongoose from "mongoose";

const collection = 'wishLists'

const whishListSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'products'
            }
        }
    ]
}, { timestamps: true })

const whishListModelService = mongoose.model(collection, whishListSchema)
export default whishListModelService