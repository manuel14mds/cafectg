export default class WhishList {
    constructor (id, data) {
        this.id = id;
        this.products = data.products;
    }
    add(pid){
        if (this.products.length == 0){
            this.products.push({product:pid})
        }else{
            if(!this.products.some(item => item.product == pid)){
                this.products.push({product:pid})
            }
        }
    }
    delete(pid){
        if(!this.products.length == 0){
            if(this.products.some(item => item.product == pid)){
                const newList = this.products.filter(item=> item.product != pid)
                this.products = newList
            }
        }
    }
    empty(){
        this.products = []
    }
    
}