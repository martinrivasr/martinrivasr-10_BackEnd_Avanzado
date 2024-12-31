import User from '../models/users.js';

export function index(req, res, next) {
    res.render('createUser');
}

export async function registerUser(req, res, next) {
    try {
        
        const { username, password, name, country } = req.body;

        
        const newUser = new User({
            email: username, 
            password: password,
            name: name,
            country: country
        });

        
        await newUser.save();

        
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
}
