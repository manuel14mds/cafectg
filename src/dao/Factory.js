import config from '../config/config.js'

const persistence = config.app.PERSISTENCE
let UserService
let ProductService
let CartService
let PurchaseService

switch (persistence) {
    case 'MEMORY':
        const {default:MemoryUser} = await import('./MemoryDAO/Users.js') 
        const {default:MemoryProduct} = await import('./MemoryDAO/Products.js') 
        const {default:MemoryCarts} = await import('./MemoryDAO/Carts.js') 
        const {default:MemoryPurchases} = await import('./MemoryDAO/Purchases.js') 
        UserService = new MemoryUser()
        ProductService = new MemoryProduct()
        CartService = new MemoryCarts()
        PurchaseService = new MemoryPurchases()
        break
    case 'FILESYSTEM':
        const {default:FileSUser} = await import('./fileSystemDAO/Users.js')
        const {default:FileSProduct} = await import('./fileSystemDAO/Products.js') 
        const {default:FileSCarts} = await import('./fileSystemDAO/Carts.js')
        const {default:FileSPurchases} = await import('./fileSystemDAO/Purchases.js') 
        UserService = new FileSUser()
        ProductService = new FileSProduct()
        CartService = new FileSCarts()
        PurchaseService = new FileSPurchases()
        break
    case 'MONGODB':
        const {default:MongoUser} = await import('./mongoDAO/Users.js')
        const {default:MongoProduct} = await import('./mongoDAO/Products.js') 
        const {default:MongoCarts} = await import('./mongoDAO/Carts.js') 
        const {default:MongoPurchase} = await import('./mongoDAO/purchases.js')
        UserService = new MongoUser()
        ProductService = new MongoProduct()
        CartService = new MongoCarts()
        PurchaseService = new MongoPurchase()
        break
}

const persistenceFactory = {
    UserService,
    ProductService,
    CartService,
    PurchaseService,
}

export default persistenceFactory