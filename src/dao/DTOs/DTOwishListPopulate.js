import persistenceFactory from "../Factory.js"
export default class WishListPopulateDTO {
    constructor (id, data) {
        this.id = id;
        this.products = data.products
    }
    async populate(){
        const dataProducts = await persistenceFactory.ProductService.getAll();
        let productList = []
        for(const item of this.products){
            productList.push({
                product:  dataProducts.find((el) => item.product == el.id),
            })
        }
        this.products = productList
    }
}