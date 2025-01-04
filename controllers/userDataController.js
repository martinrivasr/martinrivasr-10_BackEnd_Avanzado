import User from "../models/users.js";

export function index(req, res, next) {
    res.render('createUser');
}

export async function createUser(req, res, next) {
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



export async function showUserData(req, res, next){
    try {
        
        const userId = req.session.userID;
        const userData = await User.findById (userId)
        
        res.locals.session = req.session;
    
        res.render('userData', { userData })

    } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        res.status(500).send('Error obteniendo dtos de usuario');
    }
}

export async function updateUserData(req, res, next){
    try {

        const { username, name, country  } = req.body;
        res.locals.session = req.session;
        console.log("Usuario de la sesion: ",  res.locals.session)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(username)) {
            console.log('Correo inválido:', username);
            res.render('userdata', { userData: req.body, error: 'Correo electrónico no válido.' });
            throw new Error('Correo electrónico no válido.');
        }

        const findUser =  await User.findOne ({ email: req.session.userEmail });

        if(!findUser){
            console.log('Usuario encontrado:', username);
            res.render('userdata', { userData: req.body, error: 'Usuario no encontrado.' });
            throw new Error('Usuario encontrado.');
        }

        const userId = findUser._id;

        if (username && req.session.userEmail !== username){
            const userExists = await User.findOne({ email: username })
        
            if (userExists){
                console.log('Usuario ya existe:', username);
                res.render('userdata', { userData: req.body, error: 'El usuario especificado ya existe.' });
                throw new Error('El usuario especificado ya existe.');
            }
        }
        

        const userData = {};
        if (username) userData.email = username
        if (name) userData.name = name;
        if (country) userData.country = country;
        
        const updateUser = await User.findByIdAndUpdate(userId, userData, {
            new: true
        })
        
        return res.render('userdata', { userData: updateUser, success: 'Usuario actualizado correctamente.' });
    
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.render('userdata', { userData: req.body, error: 'Error al actualizar el usuario.' });
    }

}


export async function showchgpass(req, res, next){
    try {
        
        const userId = req.session.userID;
        const userData = await User.findById (userId)
        
        res.locals.session = req.session;
    
        res.render('changepass', { userData })

    } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        res.status(500).send('Error obteniendo dtos de usuario');
    }
}

export async function changePassword(req, res, next){
    try {
        
        const { currentPassword, newPassword, confirmedNewPassword } = req.body;
        
        console.log(currentPassword, newPassword, confirmedNewPassword )

        if (newPassword !== confirmedNewPassword){
            return res.render('changepass', { 
                userData: req.body, 
                error: 'Las contraseñas nuevas no coinciden.' 
            });
        }
        
        console.log("usuario a buscar: ", req.session.userEmai)
        const findUser =  await User.findOne ({ email: req.session.userEmail });
        if (!findUser){
            return res.render('changepass', { 
                userData: req.body, 
                error: 'Usuario no encontrado.' 
            });
        }

        const isMatch = await findUser.comparePassword(currentPassword)
        if (!isMatch){
            return res.render('changepass', { 
                userData: req.body, 
                error: 'La contraseña actual es incorrecta.' 
            });
        }


        findUser.password = newPassword;
        await findUser.save();


        return res.render('changepass', { 
            userData: req.body, 
            success: 'Contraseña actualizada exitosamente.' 
        });

    } catch (error) {
        console.error('Error al cambiar el password:', error);
        return res.status(500).render('changepass', { 
            userData: req.body, 
            error: 'Ocurrió un error al actualizar la contraseña.' 
        });
    }
}