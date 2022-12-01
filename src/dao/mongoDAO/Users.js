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
        let result = await this.modelService.findOne({email}).lean()
        if(result){
            result.id=result._id
        }
        return result
    }
    createUser = async(element) => {
        let result = await this.modelService.create(element)
        if(!result){
            return null
        }else{
            let user = new UserDTO(result)
            return user
        }
    }
}