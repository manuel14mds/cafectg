export default class WishList {
    constructor(id, data) {
        this.id = id;
        this.products = data.products;
    }
    add(pid) {
        if (this.products.length == 0) {
            this.products.push({ product: pid })
        } else {
            let result = this.products.some(item => item.product.toString() == pid)
            if (!result) {
                this.products.push({ product: pid })
            }
        }
    }
    delete(pid) {
        let result
        if (!this.products.length == 0) {
            result = this.products.some(item => item.product.toString() == pid)
            if (result) {
                const newList = this.products.filter(item => item.product.toString() != pid)
                this.products = newList
            }
        }
    }
    empty() {
        this.products = []
    }

}