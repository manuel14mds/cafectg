import MemoryContainer from "./MemoryContainer.js";

export default class Purchases extends MemoryContainer{
    constructor(){
        super()
    }

    create = (cart) => {
        let data = this.getAll()
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
        const purchaseId =  this.save(newPurchase)
        return purchaseId
    }

    getPopulate = (id) => {
        let result = this.getById(id)
        return result
    }
}
