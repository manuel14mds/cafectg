import usersModelService from '../../models/Users.model.js'
import MongoContainer from "./MongoContainer.js";
import UserDTO from '../DTOs/DTOuser.js';
export default class Users extends MongoContainer{
    constructor(){
        super()
        this.modelService = usersModelService
    }
    getAll = async () => {
        let data =  await this.modelService.find().lean()
        const users = data.map(user => new UserDTO(user))
        return users
    }
    changeStatus = async (uid, value) => {
        let data = await this.getAll()
        data = data.map((element)=>{
            if(element.id === uid){
                element.status = value
            }
        })
    }
    getByEmail = async(email) => {
        let user = await this.modelService.findOne({email}).lean()
        if(!user){
            return null
        }else{
            return user
        }
    }
}