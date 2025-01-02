import createError from 'http-errors'
import User from "../../models/users.js"
import jwt from 'jsonwebtoken'


export async function loginJWT(req, res, next){
    try {
        const { email, password } = req.body

        //User not find or wrong password
        const user = await User.findOne ({ email: email.toLowerCase() })
        if (!user || !(await user.comparePassword(password))){
           next(createError(401, 'invalid credentials'))
        return
        }

        //user find and data match 
        jwt.sign({ _id: user._id}, process.env.JWT_SECRET, {
            expiresIn:'2d'
        }, (err, tokenJWT) =>{
            if(err){
                next(err)
                return
            }
            res.json({ tokenJWT })
        })

    } catch (error) {
        next(error)
    }
}