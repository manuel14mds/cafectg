
const persistence = 'MONGODB'
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
    case 'FILESYSTEM':
        const {default:FileSUser} = await import('./fileSystemDAO/Users.js')
        const {default:FileSProduct} = await import('./fileSystemDAO/Products.js') 
        const {default:FileSCarts} = await import('./fileSystemDAO/Carts.js') 
        UserService = new FileSUser()
        ProductService = new FileSProduct()
        CartService = new FileSCarts()
        break
    case 'MONGODB':
        const {default:MongoUser} = await import('./mongoDAO/Users.js')
        const {default:MongoProduct} = await import('./mongoDAO/Products.js') 
        const {default:MongoCarts} = await import('./mongoDAO/Carts.js') 
        UserService = new MongoUser()
        ProductService = new MongoProduct()
        CartService = new MongoCarts()
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