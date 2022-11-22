export default class UserDTO {
    constructor (user) {
        this.id = user._id
        this.name = user.name
        this.last_name = user.last_name
        this.role = user.role
        this.age = user.age
        this.address = user.address
        this.picture = user.picture
        this.phone = user.phone
        this.email = user.email
        this.cartId = user.cartId
        this.wishlistId = user.wishlistId
        this.purchases = user.purchases
        this.cards = user.cards
    }
}