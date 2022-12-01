export default class Cart {
    constructor (id, cart) {
        this.id = id;
        this.products = cart.products;
        this.total = cart.total
    }
    totalUpdate = ()=>{
        let update
        cart.products.forEach(element => {
            update += element.product.price * element.qty
        })
        this.total = update
    }
    addProduct = (pid, qty) => {
        this.products.push({product:pid, qty})
        this.totalUpdate()
    }
    addQty = (pid, prod, qty) => {
        let auxProductId
        this.products.forEach(element => {
            auxProductId = element.product.toString()
            if(auxProductId === pid){
                let value = element.qty + qty
                if(value <= 0){
                    this.products = this.products.filter((e)=> e.product != auxProductId)
                    this.totalUpdate()
                    return true
                }else{
                    if(prod.stock<value){
                        element.qty = prod.stock
                        return true
                    }else{
                        element.qty += qty
                        return true
                    }
                }
            }
        })
        this.totalUpdate()
    }
}