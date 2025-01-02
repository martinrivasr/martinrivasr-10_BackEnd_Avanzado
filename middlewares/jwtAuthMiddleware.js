import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export function guard(req, res, next){

    const tokenJWT = req.get('Authorization')?.replace('Bearer ', '') || req.body.jwt || req.query.jwt;

    
    if(!tockenJWT){
        next(createError(401, "No tocken provided"))
        return
    }

    jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, paylod) =>{
        if (err){
            next(createError(401, 'Invalid token'))
            return;
        }
        console.log(paylod)
        req.apiUserId = paylod._id
        
        next()
    })
}