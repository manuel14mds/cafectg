export default class ProductDTO {
    constructor (id, product) {
        this.id = id
        this.name = product.name
        this.description = product.description
        this.thumbnail = product.thumbnail
        this.price = product.price
        this.stock = product.stock
        this.code = product.code
        this.enable = product.enable
        this.promote = product.promote
        this.brand = product.brand
        this.country = product.country
    }
}