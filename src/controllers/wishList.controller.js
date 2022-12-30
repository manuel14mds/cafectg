import config from '../config/config.js'

import WishListPopulateDTO from '../dao/DTOs/DTOwishListPopulate.js'
import WishList from '../dao/DTOs/DTOwishList.js'

import persistenceFactory from '../dao/Factory.js'

import __dirname from "../utils.js"
import { logger } from '../app.js'

// get all whishlists
const getAllWLs = async (req, res) => {
    try {
        let whishLists = await persistenceFactory.WishListService.getAll()
        res.send({ status: 'success', message: 'WishList successfully created', payload: whishLists })
    } catch (error) {
        logger.error(`Couldn't get all wishlists -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            wishList.controller: getAllWLs`)
        return res.status(500).send({ status: 'error', error: "Couldn't get all wishlists" })
    }
}

// create a new wishlist
const createOne = async (req, res) => {
    try {
        const newWishList = await persistenceFactory.WishListService.create()
        res.send({ status: 'success', message: 'WishList successfully created', payload: newWishList })
    } catch (error) {
        logger.error(`Couldn't create a wishlist -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            wishList.controller: createOne`)
        return res.status(500).send({ status: 'error', error: "Couldn't create a wishlist" })
    }
}

// get a wishlist by ID
const getById = async (req, res) => {
    try {
        let wishList
        if (config.app.PERSISTENCE != 'MONGODB') {
            wishList = new WishListPopulateDTO(req.params.wishList.id, req.params.wishList)
            await wishList.populate()
        } else {
            wishList = await persistenceFactory.WishListService.getWhishList(req.params.wishList.id)
        }

        res.status(200).send({ status: 'success', payload: wishList })
    } catch (error) {
        logger.error(`Couldn't get the wishlist -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            wishList.controller: getById`)
        return res.status(500).send({ status: 'error', error: "it couldn't get wish list" })
    }
}

// add a product into the wishlist
const addProduct = async (req, res) => {
    try {
        const wishList = new WishList(req.params.wishList.id, req.params.wishList)
        const pid = req.params.product.id

        wishList.add(pid)

        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)

        if (config.app.PERSISTENCE != 'MONGODB') {
            result = new WishListPopulateDTO(result.id, result)
            await result.populate()
        } else {
            result = await persistenceFactory.WishListService.getWhishList(req.params.wishList.id)
        }

        return res.send({ status: 'success', message: 'successfully added into the wish list', result })

    } catch (error) {
        logger.error(`Couldn't upload the product into the wish list -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            wishList.controller: addProduct`)
        return res.status(500).send({ status: 'error', error: "it couldn't upload the product into the wish list" })
    }
}

// delete a product from the wishlist
const deleteProduct = async (req, res) => {
    try {
        const wishList = new WishList(req.params.wishList.id, req.params.wishList)
        const pid = req.params.product.id

        wishList.delete(pid)

        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)

        if (config.app.PERSISTENCE != 'MONGODB') {
            result = new WishListPopulateDTO(result.id, result)
            await result.populate()
        } else {
            result = await persistenceFactory.WishListService.getWhishList(req.params.wishList.id)
        }

        return res.send({ status: 'success', message: 'successfully delete from the wish list', result })

    } catch (error) {
        logger.error(`Couldn't delete the product from the wish list -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            wishList.controller: deleteProduct`)
        return res.status(500).send({ status: 'error', error: "it couldn't delete the product from the wish list" })
    }
}

// empty the wishlist
const emptyWishList = async (req, res) => {
    try {
        const wishList = new WishList(req.params.wishList.id, req.params.wishList)
        wishList.empty()
        let result = await persistenceFactory.WishListService.update(wishList.id, wishList)
        return res.send({ status: 'success', message: 'empty wish list successfully', result })
    } catch (error) {
        logger.error(`Couldn't empty wishlist -> ${req.protocol + '://' + req.get('host') + req.originalUrl} Method: ${req.method} || error 500:
            ${error}
            wishList.controller: emptyWishList`)
        return res.status(500).send({ status: 'error', error: "it couldn't empty the wishlist" })
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