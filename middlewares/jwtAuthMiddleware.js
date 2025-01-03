import jwt from 'jsonwebtoken'
import createError from 'http-errors'

export function authenticateJWT(req, res, next){

    const tokenJWT = req.get('Authorization')?.replace('Bearer ', '') || req.body.jwt || req.query.jwt;

    
    if(!tokenJWT){
        next(createError(401, "No token provided"))
        return
    }

    jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, paylod) =>{
        if (err){
            next(createError(401, 'Invalid token'))
            return;
        }
        
        console.log(paylod)
        //console.log(req)
        req.apiUserId = paylod._id

        next()
    })
}