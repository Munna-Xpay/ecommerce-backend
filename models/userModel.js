import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNum:{
        type:String,
    },
    birthday:{
        type:Date,
    },
    gender:{
        type:String,
    },
    address:{
        type:String,
    },
    zipCode:{
        type:String,
    },
    city:{
        type:String,
    },
    country:{
        type:String,
    },
    profileImage:{
        type:String
    }

})
const Users=mongoose.model("Users",userSchema)
export default Users;
