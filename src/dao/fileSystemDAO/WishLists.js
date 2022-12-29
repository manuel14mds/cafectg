import __dirname from '../../utils.js'
import FileSystemContainer from "./FileSystemContainer.js";

export default class WishLists extends FileSystemContainer{
    constructor(){
        super()
        this.path = __dirname + '/files/wishlists.json'
    }

    create = async () => {
        let data = await this.getAll()
        let newWishList = {}
        if (data.length === 0) {
            newWishList.id = 1
            newWishList.time_stamp = Date.now().toLocaleString()
        } else {
            newWishList.id = data[data.length - 1].id + 1
            newWishList.time_stamp = Date.now().toLocaleString()
        }
        newWishList.products = []
        const wishlistId =  await this.save(newWishList)
        return wishlistId
    }

}
