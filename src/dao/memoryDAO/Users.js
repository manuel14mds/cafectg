import MemoryContainer from "./MemoryContainer.js";
export default class Users extends MemoryContainer{
    constructor(){
        super()
    }
    changeStatus = (uid, value) => {
        this.data = this.data.map((element)=>{
            if(element.id === uid){
                element.status = value
            }
        })
    }
    getByEmail = (email) => {
        let result = this.data.find((element) => element.email == email)
        return result
    }
    createUser = (element) => {
        if (this.data.length === 0) {
            element.id = 1
            element.time_stamp = Date.now().toLocaleString()
        }else{
            element.id = this.data[this.data.length - 1].id + 1
            element.time_stamp = Date.now().toLocaleString()
        }

        if(!element.last_name) element.last_name = ''
        element.role = 'user'
        element.age = -1
        element.address = ''
        element.picture = ''
        element.phone = ''
        element.active = true
        element.wishlistId = ''
        element.purchases = []
        element.cards=['MSC','AEX','DIN','VIS']

        this.data.push(element)
        return element
    }
}