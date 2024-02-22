import jwt from "jsonwebtoken";
import Users from "../../models/userModel.js";
import bcrypt from "bcrypt";

//register
export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      res.status(400).json("Account already exists! Please login to continue..");
    } else {
      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = new Users({
        fullName,
        email,
        password: hashedPass,
      });
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (err) {
    res.status(401).json({error:err,message:'Register failed!'});
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loggedUser = await Users.findOne({ email })
    if (loggedUser) {
      bcrypt.compare(password,loggedUser.password, (err, result) => {
        if (err) {
          res.status(500).json({error:err,message:'Internal server error'})
        }
          if(result){
            //token
            const token = jwt.sign({ _id: loggedUser._id }, "m17");
            res.status(200).json({
              user: loggedUser,
              token,
            });
        }
        else{
          res.status(400).json('Wrong password!')
        }
      });
    } else {
      res.status(404).json("User not found!");
    }
  } catch (err) {
    res.status(401).json({error: err, message: "Login failed" });
  }
};

//userProfile(Edit)
export const userProfileUpdate = async (req, res) => {
  const {fullName,email,address,phoneNum,birthday,gender,zipCode,city,country,profileImage}=req.body
  const { _id } = req.params;
  

  const profileImg=req.file?req.file.filename:profileImage

  try {
    const currentUser = await Users.findOne({ _id });
    if (currentUser) {
      const update = await Users.findByIdAndUpdate({_id},{fullName,email,address,phoneNum,birthday,gender,zipCode,city,country,profileImage:profileImg},{
        new: true
      }).catch((e) => console.log(e));
      update && res.status(200).json(update);
    } else {
      res.status(404).json("User not found!");
    }
  } catch (err) {
    res.status(401).json({ error: err, message: `Profile Update Failed ` });
  }
};

//get all users
export const getAllUsers=async (req,res)=>{
  try{
    const allUsers=await Users.find()
    if(allUsers){
      res.status(200).json(allUsers)
    }
    else{
      res.status(404).json("Users empty")
    }
  }
  catch(err){
    res.status(401).json({ error: err, message: `All users access failed ` });

  }
}

//delete user
export const removeUser=async (req,res)=>{
  const {_id}=req.params
  try{
    const deletedUser=await Users.findByIdAndDelete({_id})
      res.status(200).json(deletedUser)
  }
  catch (err) {
    res.status(401).json({ error: err, message: `User delete failed ` });
  }
}