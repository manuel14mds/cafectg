import __dirname from '../../utils.js'
import FileSystemContainer from "./FileSystemContainer.js";
export default class Users extends FileSystemContainer{
    constructor(){
        super()
        this.path = __dirname + '/files/users.json'
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