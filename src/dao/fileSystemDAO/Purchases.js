import __dirname from '../../utils.js'
import FileSystemContainer from "./FileSystemContainer.js";

export default class Purchases extends FileSystemContainer {
    constructor() {
        super()
        this.path = __dirname + '/files/purchases.json'
    }

    create = async (cart) => {
        let data = await this.getAll()
        let newPurchase = {}
        if (data.length === 0) {
            newPurchase.id = 1
            newPurchase.time_stamp = Date.now().toLocaleString()
        } else {
            newPurchase.id = data[data.length - 1].id + 1
            newPurchase.time_stamp = Date.now().toLocaleString()
        }
        newPurchase.products = cart.products
        newPurchase.total = cart.total
        const purchaseId = await this.save(newPurchase)
        return purchaseId
    }

    getPopulate = async (id) => {
        let result = await this.getById(id)
        return result
    }
}
