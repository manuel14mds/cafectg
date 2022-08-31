
const persistence = 'MEMORY'
let UserService
let ProductService
let CartService

switch (persistence) {
    case 'MEMORY':
        const {default:MemoryUser} = await import('./MemoryDAO/Users.js') 
        const {default:MemoryProduct} = await import('./MemoryDAO/Products.js') 
        const {default:MemoryCarts} = await import('./MemoryDAO/Carts.js') 
        UserService = new MemoryUser()
        ProductService = new MemoryProduct()
        CartService = new MemoryCarts()
        break
}

const services = {
    UserService,
    ProductService,
    CartService
}
/* export default {

} */
export default services