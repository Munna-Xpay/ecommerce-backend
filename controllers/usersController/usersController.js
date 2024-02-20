import jwt from 'jsonwebtoken'
import Users from '../../models/userModel.js'

//register
export const register=async (req,res)=>{
    const {fullName,email,password}=req.body

    try{
        const existingUser=await Users.findOne({email})
        if(existingUser){
            res.status(400).json("Account already exists! Please login to continue..")
        }
        else{
             // hash password here
            const newUser=new Users({
                fullName,email,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    }
    catch(err){
        res.status(401).json(`Register Api Failed ${err}`)
    }
}

//login
export const login=async(req,res)=>{
    const {email,password}=req.body

    try{
        const loggedUser=await Users.findOne({email,password})
        //bcrypt 
        if(loggedUser){
            //token
            const token =jwt.sign({_id:loggedUser._id},"m17")
            res.status(200).json({
                user:loggedUser,
                token
            })
        }
        else{
            res.status(401).json("Incorrect email or password")
        }
    }
    catch(err){
        res.status(401).json(`Login Api Failed ${err}`)
    }
}

//userProfile(Edit)
export const userProfileUpdate=async (req,res)=>{
    const {fullName,email,address,phoneNum,birthday,gender,zipCode,city,country,profileImage}=req.body
    const {_id}=req.params

    //image
    const data = req.body
    const profileImg=req.file?req.file.filename:profileImage

    try{
        const currentUser=await Users.findOne({_id})

        //validation


        const update = await Users.findByIdAndUpdate(id,data,{new:true}).catch(e=>console.log(e))
        update && res.status(200).json(update)

        // if(currentUser){
        //     currentUser.fullName=fullName
        //     currentUser.email=email
        //     currentUser.address=address
        //     currentUser.phoneNum=phoneNum
        //     currentUser.birthday=birthday
        //     currentUser.gender=gender
        //     currentUser.zipCode=zipCode
        //     currentUser.city=city
        //     currentUser.country=country
        //     currentUser.profileImage=profileImg
            
        //     await currentUser.save()
        //     res.status(200).json(currentUser)
        // }
    // }else{
    //         res.status(404).json(`${fullName} not present`)
    //     }
    }
    catch(err){
        res.status(401).json({error:err, message:`Profile Update Failed `})
    }
}