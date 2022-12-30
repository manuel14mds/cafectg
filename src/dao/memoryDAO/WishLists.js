import MemoryContainer from "./MemoryContainer.js";

export default class WishLists extends MemoryContainer {
    constructor() {
        super()
    }

    create = () => {
        let data = this.getAll()
        let newWishList = {}
        if (data.length === 0) {
            newWishList.id = 1
            newWishList.time_stamp = Date.now().toLocaleString()
        } else {
            newWishList.id = data[data.length - 1].id + 1
            newWishList.time_stamp = Date.now().toLocaleString()
        }
        newWishList.products = []
        this.save(newWishList)
        return newWishList
    }
}
