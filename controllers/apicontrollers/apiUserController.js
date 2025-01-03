import bcrypt from 'bcrypt';
import User from '../../models/users.js';

export async function userList(req, res, next) {
    try {
        // query template : http://localhost:3000/api/products/?tag=todos&min-price=&max-price=&product-name=Lap
       // sort template : http://localhost:3000/api/users/?sort=name
        const filter = {};
        const filterUser = req.query.user
        const filterCountry = req.query.country

        if (filterUser) filter.user = filterUser
        if (filterCountry && typeof filterCountry === 'string') {
            filter.country = filterCountry.trim();
        }

        const validSortFields = ['name', 'email', 'country', 'createdAt']
        const sort = validSortFields.includes(req.query.sort) ? req.query.sort : 'name'
        
          
        if (!validSortFields.includes(sort) && sort !== null) {
            throw new Error(`El campo de ordenamiento "${sort}" no es válido.`)
        }

        const fields = req.query.fields ? req.query.fields.split(',').join(' ') : ''
        // data filter with filters, pages and sorting
        const users = await User.list(filter, sort, fields)

        const totalRecords = users.length;

       res.json({   
        results: users,
        totalRecords,
       })

        
    } catch (error) {
        console.error(`Error in userList: ${error.message}`, { query: req.query });
        res.status(500).json({ error: 'Error obteniendo los usuarios' });
    }
}


export async function userCreation(req, res, next) {
    try {
        
        const { username, password, name, country } = req.body;
        console.log(username, password, name, country )
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!username || !emailRegex.test(username)) {
            console.log(username)
            return res.status(400).json({ error: 'El correo electrónico no es válido.' });
        }

        const userExists =  await User.findOne ({ email: username});
        if (userExists) {
            return res.status(400).json({ error: 'El usuario especificado ya existe.' });
        }


        const newUser = new User({
            email: username, 
            password: password,
            name: name,
            country: country
        });

        const userSaved = await newUser.save();
        res.status(201).json({ result: userSaved})

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
}


export async function userUpdate(req, res, next){
    try {
        const userId = req.params.userId
        const { username, password, name, country  } = req.body;
        
        console.log(username, password, name, country )

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(username)) {
            console.log(username)
            return res.status(400).json({ error: 'El correo electrónico no es válido.' });
        }

        const findUser =  await User.findById (userId);
        if(!findUser){
            return res.status(404).json({ error: 'usuario no encontrado'})
        }

        if (username && username !== findUser.email){
            const userExists =  await User.findOne ({ email: username});
            if (userExists){
                return res.status(400).json({ error: 'El usuario especificado ya existe.' });
            }
        }

        const userData = {};
        if (username) userData.email = username
        if (name) userData.name = name;
        if (country) userData.country = country;
        
        const updateUser = await User.findByIdAndUpdate(userId, userData, {
            new: true
        })

        res.json({ result: updateUser })
       

    } catch (err) {
        console.error('Error al actualizar el usuario:', err);
        res.status(500).json({ error: 'Error al actualizar el Usuario', details: err.message });
    }
}

export async function changePassword(req, res, next){
    try {
        const userid = req.params.userId
        const { currenPassword, newPassword, confirmedNewPassword } = req.body;
        
        console.log(currenPassword, newPassword, confirmedNewPassword )
            
        if (newPassword !== confirmedNewPassword){
            return res.status(400).json({ Error: "Las contraseñas nuevas no coinciden"})
        }
        

        const findUser = await User.findById(userid)
        if (!findUser){
            return res.status(404).json({ error: "Usuario no encontrado"})
        }

        const isMatch = await findUser.comparePassword(currenPassword)
        if (!isMatch){
            return res.status(400).json({ error: "La contraseña actual es incorrecta"})
        }


        findUser.password = newPassword;
        await findUser.save();


        res.json({ result: "Contraseña actualizada exitosamente." });

    } catch (error) {
        console.error('Error al actualizar al cambiar el password:', error);
        res.status(500).json({ error: 'Error al actualizar el password', details: error.message });
    }
}