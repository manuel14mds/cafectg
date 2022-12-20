import persistenceFactory from "../Factory.js"
export default class PurchasePopulateDTO {
    constructor (id, purchase) {
        this.id = id;
        this.products = purchase.products
        this.total = purchase.total
        this.time_stamp = purchase.time_stamp
    }
    async populate(){
        const dataProducts = await persistenceFactory.ProductService.getAll();
        let productList = []
        for(const item of this.products){
            productList.push({
                product:  dataProducts.find((el) => item.product == el.id),
                qty:item.qty
            })
        }
        this.products = productList
    }
}