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
}