export default{
    app:{
        DOMAIN:process.env.DOMAIN
    },
    mongo:{
        USER:process.env.MONGO_USER,
        PSW:process.env.MONGO_PSW,
        DB:process.env.MONGO_DB
    },
    jwt:{
        SECRET:process.env.JWT_SECRET,
        COOKIE:process.env.JWT_COOKIE
    },
    google:{
        CLIENT_ID:process.env.GOOGLE_CID,
        CLIENT_SECRET:process.env.GOOGLE_CSECRET
    }
}