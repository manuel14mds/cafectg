import * as fs from 'fs'
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
    getByEmail = async(email) => {
        let list = await this.getAll()
        let result = list.find((element) => element.email == email)
        return result
    }
    createUser = async(element) => {
        let data = await this.getAll()

        if (data.length === 0) {
            element.id = 1
            element.time_stamp = Date.now().toLocaleString()
        }else{
            element.id = data[data.length - 1].id + 1
            element.time_stamp = Date.now().toLocaleString()
        }

        if(!element.last_name) element.last_name = ''
        element.role = 'user'
        element.age = -1
        element.address = ''
        element.picture = ''
        element.phone = ''
        element.active = true
        element.purchases = []
        element.cards=['MSC','AEX','DIN','VIS']

        data.push(element)
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t'))
        return element
    }
}