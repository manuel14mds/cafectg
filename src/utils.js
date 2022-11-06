import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer';
import bcrypt from 'bcrypt';

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (user,password ) => bcrypt.compareSync(password,user.password);


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,__dirname+"/public/images/users")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname)
    }
})
export const uploader = multer({storage:storage})

export default __dirname