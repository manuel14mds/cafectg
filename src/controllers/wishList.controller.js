import { userAdmin, logger } from '../app.js'
import persistenceFactory from '../dao/Factory.js'
import __dirname from "../utils.js"
import WhishListPopulateDTO from '../dao/DTOs/DTOwishListPopulate.js'
import WhishList from '../dao/DTOs/DTOwhishList.js'

const getWhishLists = async (req,res)=>{
    let whishLists = await persistenceFactory.WishListService.getAll()
    res.send(whishLists)
}

const createOne = async (req,res)=>{
    await persistenceFactory.WishListService.create()
    res.send({status:'success',message:'Wish list successfully created'})
}

const deleteById = async (req,res)=>{
    /* if(!userAdmin){
        return res.send({error:-1, descripction: "route '/carts/:cid' method 'DELETE' no authorized"})
    }else{
        try {
            await persistenceFactory.CartService.deleteById(req.params.cid)
            res.send({status:'success',message:'successfully deleted'})
        } catch (error) {
            logger.error(`cart couldn't been deleted | Method: ${req.method} | URL: ${req.originalUrl}`)
            return res.status(500).send({status:'error', error:"cart couldn't been deleted"})
        }
    } */
}

const getWhole = async (req,res)=>{
    try {
        let whishList = new WhishListPopulateDTO(req.params.wishList.id, req.params.wishList)
        res.send({message:'success', payload:whishList})
    } catch (error) {
        logger.error(`Products couldn't be listed | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"Wish list couldn't be listed"})
    }
}

const addProducts = async (req,res)=>{
    try {
        const wishList = new WhishList(req.params.wid.id,req.params.wid)
        const {pid} = req.body
        let product = await persistenceFactory.ProductService.getById(pid)
        if(!product){
            return res.status(404).send({status:'error', error:'Product not found'})
        }
        wishList.add(pid)
        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)
        return res.send({status:'success',message:'successfully added into the wish list', result })

    } catch (error) {
        logger.error(`Couldn't upload the product into the wish list | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't upload the product into the wish list"})
    }
}

const deleteProduct = async (req,res)=>{
    try {
        const wishList = new WhishList(req.params.wid.id,req.params.wid)
        const {pid} = req.body
        let product = await persistenceFactory.ProductService.getById(pid)
        if(!product){
            return res.status(404).send({status:'error', error:'Product not found'})
        }
        wishList.delete(pid)
        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)
        return res.send({status:'success',message:'successfully delete from the wish list', result })

    } catch (error) {
        logger.error(`Couldn't delete the product from the wish list | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't delete the product ftom the wish list"})
    }
}
const emptyWishList = async (req,res)=>{
    try {
        const wishList = new WhishList(req.params.wid.id,req.params.wid)
        wishList.empty()
        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)
        return res.send({status:'success',message:'empty wish list successfully', result })

    } catch (error) {
        logger.error(`Couldn't delete the product from the wish list | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't delete the product ftom the wish list"})
    }
}
const getById = async (req,res)=>{
    try {
        const wishList = new WhishListPopulateDTO(req.params.wid.id,req.params.wid)
        res.send({status:'success', payload:wishList})
    } catch (error) {
        logger.error(`Couldn't get wish list | Method: ${req.method} | URL: ${req.originalUrl}`)
        return res.status(500).send({status:'error', error:"it couldn't get wish list"})
    }
}


export default {
    getWhishLists,
    createOne,
    getWhole,
    addProducts,
    deleteProduct,
    emptyWishList,
    getById,
}