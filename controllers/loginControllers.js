import User from '../models/users.js'

export function index(req, res, next){
    res.locals.error = ''
    res.locals.email = ''
    res.render('login')
}

export async function postLogin (req, res, next){
   
    const{ email, password } = req.body
    const user = await User.findOne({email: email.toLowerCase()})
    console.log('usuario a autenticar en login controller : ', user)
    
    
    if(!user || !(await user.comparePassword(password)) ){
        res.locals.error = 'invalid credentials'
        res.locals.email = email
        res.render('login')
        return
    }
    
        req.session.userID = user._id
        req.session.userEmail = user.email
        req.session.userName = user.name

        console.log('usuarioID autenticado', req.session.userID)
        console.log('usuarioID autenticado', req.session.userEmail)
        console.log('usuarioEMAIL autenticado', req.session.userName)
        
        req.session.regenerate(err => {
            if (err) {
                console.error("Error al regenerar la sesión:", err);
            } else {
                req.session.userID = user._id;
                req.session.userName = user.name;
                console.log("Sesión regenerada y datos guardados.");
            }
        });


    console.log('usuario autenticado')
    res.redirect('/')
}


