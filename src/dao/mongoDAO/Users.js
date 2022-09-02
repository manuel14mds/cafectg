import usersModelService from '../../models/Users.model.js'
import MongoContainer from "./MongoContainer.js";
export default class Users extends MongoContainer{
    constructor(){
        super()
        this.modelService = usersModelService
    }
    changeStatus = async (uid, value) => {
        let data = await this.getAll()
        data = data.map((element)=>{
            if(element.id === uid){
                element.status = value
            }
        })
    }
}