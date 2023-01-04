export default class Cart {
    constructor(id, cart) {
        this.id = id;
        this.products = cart.products;
        this.total = cart.total
    }
    totalUpdate(prod, qty) {
        this.total += prod.price * qty
    }
    addProduct(pid, prod, qty) {
        this.products.push({ product: pid, qty })
        this.totalUpdate(prod, qty)
    }
    addQty(pid, prod, qty) {

        let auxProductId
        this.products.forEach(element => {
            auxProductId = element.product.toString()
            if (element.product == pid) {
                let value = element.qty + qty
                if (value <= 0) {
                    this.removeProduct(pid, prod)
                    return true
                } else {
                    if (element.qty == prod.stock){
                        return true
                    }else if (prod.stock < value) {
                        element.qty = prod.stock
                        this.totalUpdate(prod, qty)
                        return true
                    } else {
                        element.qty += qty
                        this.totalUpdate(prod, qty)
                        return true
                    }
                }
            }
        })
    }
    removeProduct(pid, prod) {
        this.products = this.products.filter((e) => {
            if (e.product == pid) {
                this.total -= e.qty * prod.price
            }
            return e.product != pid
        })
    }
    empty() {
        this.products = []
        this.total = 0
    }
}