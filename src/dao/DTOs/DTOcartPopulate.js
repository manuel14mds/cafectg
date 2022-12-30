import persistenceFactory from "../Factory.js"
export default class CartPopulateDTO {
    constructor(id, cart) {
        this.id = id;
        this.products = cart.products;
        this.total = cart.total
    }
    async populate() {
        const dataProducts = await persistenceFactory.ProductService.getAll();
        let productList = []
        for (const item of this.products) {
            productList.push({
                product: dataProducts.find((el) => el.id == item.product),
                qty: item.qty
            })
        }
        this.products = productList
    }
}