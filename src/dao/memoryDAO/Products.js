import MemoryContainer from "./MemoryContainer.js";
export default class Products extends MemoryContainer{
    constructor(){
        super()
    }

    //generate a new product code
    codeGenerator = () => {
        let new_code = ''
        do {
            new_code = (Math.random() + 1).toString(36).substring(7)
        } while (this.data.some(e => e.code === new_code))
        return new_code
    }

    //Add a new product
    addProduct = (product) => {
        if (this.data.length === 0) {
            product.id = 1
            product.code = (Math.random() + 1).toString(36).substring(7) //create a random code
            product.enable = true
            product.time_stamp = Date.now().toLocaleString()
            this.save(product)
            return product.id
        } else {
            product.id = this.data[this.data.length - 1].id + 1
            product.code = this.codeGenerator()
            product.time_stamp = Date.now().toLocaleString()
            product.enable = true
            this.save(product)
            return product.id
        }
        
    }
}