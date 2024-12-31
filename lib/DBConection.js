import mongoose from 'mongoose'


mongoose.connection.on('error', err =>{
    console.log('Error de conexion ', err)
})

export default function connectMoongose(){
    return mongoose.connect('mongodb://127.0.0.1:27017/nodepop')
    .then(mongoose => mongoose.connection)
}