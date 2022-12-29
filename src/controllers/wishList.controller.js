import { logger } from '../app.js'
import persistenceFactory from '../dao/Factory.js'
import __dirname from "../utils.js"
import config from '../config/config.js'
import WishListPopulateDTO from '../dao/DTOs/DTOwishListPopulate.js'
import WishList from '../dao/DTOs/DTOwishList.js'

const getAllWLs = async (req,res)=>{
    let whishLists = await persistenceFactory.WishListService.getAll()
    res.send(whishLists)
}

const createOne = async (req,res)=>{
    await persistenceFactory.WishListService.create()
    res.send({status:'success',message:'Wish list successfully created'})
}

const getById = async (req,res)=>{
    try {
        let wishList
        if(config.app.PERSISTENCE != 'MONGODB'){
            wishList = new WishListPopulateDTO(req.params.wishList.id,req.params.wishList)
            await wishList.populate()
        }else{
            wishList = await persistenceFactory.WishListService.getWhishList(req.params.wishList.id)
        }
        
        res.status(200).send({status:'success', payload:wishList})
    } catch (error) {
        logger.error(`Couldn't get wish list | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't get wish list"})
    }
}

const addProduct = async (req,res)=>{
    try {
        const wishList = new WishList(req.params.wishList.id,req.params.wishList)
        const pid = req.params.product.id
        
        wishList.add(pid)
        
        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)

        if(config.app.PERSISTENCE != 'MONGODB'){
            result = new WishListPopulateDTO(result.id,result)
            await result.populate()
        }else{
            result = await persistenceFactory.WishListService.getWhishList(req.params.wishList.id)
        }

        return res.send({status:'success',message:'successfully added into the wish list', result })

    } catch (error) {
        logger.error(`Couldn't upload the product into the wish list | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't upload the product into the wish list"})
    }
}

const deleteProduct = async (req,res)=>{
    try {
        const wishList = new WishList(req.params.wishList.id,req.params.wishList)
        const pid = req.params.product.id

        wishList.delete(pid)

        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)

        if(config.app.PERSISTENCE != 'MONGODB'){
            result = new WishListPopulateDTO(result.id,result)
            await result.populate()
        }else{
            result = await persistenceFactory.WishListService.getWhishList(req.params.wishList.id)
        }

        return res.send({status:'success',message:'successfully delete from the wish list', result })

    } catch (error) {
        logger.error(`Couldn't delete the product from the wish list | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't delete the product from the wish list"})
    }
}
const emptyWishList = async (req,res)=>{
    try {
        const wishList = new WishList(req.params.wishList.id,req.params.wishList)
        wishList.empty()
        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)
        return res.send({status:'success',message:'empty wish list successfully', result })

    } catch (error) {
        logger.error(`Couldn't empty wish list | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't empty the wish list"})
    }
}



export default {
    getAllWLs,
    createOne,
    addProduct,
    deleteProduct,
    emptyWishList,
    getById,
}