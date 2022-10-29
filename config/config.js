export default{
    mongo:{
        USER:process.env.MONGO_USER,
        PSW:process.env.MONGO_PSW,
        DB:process.env.MONGO_DB
    },
    jwt:{
        SECRET:process.env.JWT_SECRET,
        COOKIE:process.env.JWT_COOKIE
    }
}