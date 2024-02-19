import jwt from 'jsonwebtoken'

export const jwtMiddleware=(req,res,next)=>{

    //access token
    const token=req.headers['user_token'].split(" ")[1]

    //verification
    try{
        const JWTresponse=jwt.verify(token,'m17')

        req.payload=JWTresponse._id
        next()
    }
    catch{
        res.status(401).json("Authorization failed! Please login to continue! ")
    }
}