import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/public/images/users")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
export const uploader = multer({ storage: storage })

export const emailTransport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'manuel14mds@gmail.com',
        pass: 'lbfbmnkbwlmjmbzu'
    }
});

// create a email purchase structure
export const emailHTMLmaker = (purchase, user) => {
    try {
        let str = `
    <div style="background-color: DCD7C9; border: 2px solid black; padding:20px;">
        `
        str += `
        <h1>Café Cartagena - Purchase - ${user.name} ${user.last_name}</h1>
        <h2>Order Code: ${purchase.id}</h2>
        <h2>products:</h2>
    `
        purchase.products.forEach(element => {
            str += `
            <div style="border: 2px solid black; padding:15px;">
                <p><samp>Name: </samp>${element.product.name}</p>
                <p><samp>Price: </samp>${element.product.price} USD</p>
                <p><samp>Quantity: </samp>${element.qty}</p>
            </div>
            <hr>`
        });
        str += `
        <h2>Total: ${purchase.total} USD</h2>
        <h2>Order Code: ${purchase.id}</h2>
    </div>
    `
        return str
    } catch (error) {
        return "<h1> purchase successfully, display purchase error</h1>"
    }
}

export default __dirname