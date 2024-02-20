import jwt from 'jsonwebtoken'

export const jwtMiddleware = (req, res, next) => {

    if (req.headers.user_token) {
        //access token
        const token = req.headers['user_token'].split(" ")[1]
        console.log(token)


        //verification
        try {
            const JWTresponse = jwt.verify(token, 'm17')

            req.payload = JWTresponse._id
            next()
        }
        catch {
            res.status(401).json("Authorization failed! Please login to continue! ")
        }
    } else {
        res.status(402).json({ error: 'Invalid token please login' })
    }
}