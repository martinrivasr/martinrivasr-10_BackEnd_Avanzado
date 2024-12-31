import Chance from 'chance';
import bcrypt from 'bcrypt';
import readline from 'node:readline'
import connectMoongose from './lib/DBConection.js'
import User from './models/users.js'
import Product from './models/products.js'
import Tag from './models/tag.js'

const chance = new Chance();

const connection = await connectMoongose()
console.log('Connected to MongoDB: ', connection.name)

const questionResponse = await ask('Are you sure you wnat to empty the database and create inistial data?')

if (questionResponse.toLowerCase() !== 'yes'){
    console.log('Operation aborted.')
    process.exit()
}


const initializeDB = async () => {
    try { 

        //delete all users
        const deleteUsers = await User.deleteMany();
        const deleteProducts = await Product.deleteMany()
        const deleteTags = await Tag.deleteMany()
        
        console.log(`Deleted ${deleteUsers.deletedCount} users`)
        console.log(`Deleted ${deleteProducts.deletedCount} products`)
        console.log(`Deleted ${deleteTags.deletedCount} Tags`)


        // Create the inital data for Tag table
        const tags = await Tag.insertMany([
            { tagname: 'work' },
            { tagname: 'lifestyle' },
            { tagname: 'motor' },
            { tagname: 'mobile'},
        ]);

         // Create random users with hashed passwords
        const users = await Promise.all(
            Array.from({ length: 10 }).map(async () => ({
                email: chance.email(),
                name: chance.name(),
                password: await bcrypt.hash('password123', 10), // Hashing password
                country: chance.country({ full: true }),
            }))
        );


        const insertedUsers = await User.insertMany(users)

        const insertResult = await User.insertMany([
            {email: 'admin@example.com', name: 'admin', password: await bcrypt.hash('password123', 10), country: 'test'},
            {email: 'user1@example.com', name: 'user1', password: await bcrypt.hash('password123', 10), country: 'test'},
            {email: 'user2@example.com', name: 'user2', password: await bcrypt.hash('password123', 10), country: 'test'},
            {email: 'user3@example.com', name: 'user3', password: await bcrypt.hash('password123', 10), country: 'test'},
        ])
        
    
        const products = [];
        const productosEjemplo = [
            'Laptop', 'TV', 'Mobile', 'Cama', 'Tablet', 'Escritorio', 'Silla', 'Lámpara', 'Monitor', 'Reloj', 
            'Bicicleta', 'Mochila', 'Teléfono', 'Cámara', 'Impresora', 'Auriculares', 'Ventilador', 'Microondas', 'Cafetera', 
            'Tostadora', 'Plancha', 'Horno', 'Estufa', 'Refrigerador', 'Congelador', 'Calefactor', 'Proyector', 'Router', 
            'Consola', 'Videocámara', 'Bocina', 'Teclado', 'Mouse', 'Cargador', 'Disco Duro', 'Memoria USB', 'Drone', 
            'Smartwatch', 'Pulsera de Actividad', 'Ebook Reader', 'Impresora 3D', 'Smart Home Hub', 'Purificador de Aire', 
            'Termostato Inteligente', 'Humidificador', 'Cortadora de Césped', 'Lavadora', 'Secadora', 'Lavavajillas', 'Batidora', 
            'Extractor de Jugo'
        ];
        

         // Users with 1-3 products
        for (let i = 0; i < 5; i++) {
            const numProducts = Math.floor(Math.random() * 3) + 1; 
            for (let j = 0; j < numProducts; j++) {
                const numTags = Math.floor(Math.random() * 4) + 1; 
                const selectedTags = [];
                for (let k = 0; k < numTags; k++) {
                    selectedTags.push(tags[Math.floor(Math.random() * tags.length)]._id);
                }
                products.push({
                    product: chance.pickone(productosEjemplo), // Asigna un nombre específico y aleatorio
                    precio: Math.floor(Math.random() * 2000) + 1, 
                    picture: `https://example.com/producto${i}-${j}.jpg`,
                    tags: selectedTags,
                    owner: insertedUsers[i]._id,
                });
                
            }
        }

         // Users with 14-20 products
        for (let i = 5; i < 8; i++) {
            const numProducts = Math.floor(Math.random() * 7) + 14; 
            for (let j = 0; j < numProducts; j++) {
                const numTags = Math.floor(Math.random() * 4) + 1; 
                const selectedTags = [];
                for (let k = 0; k < numTags; k++) {
                    selectedTags.push(tags[Math.floor(Math.random() * tags.length)]._id);
                }
                products.push({
                    product: `Producto ${i}-${j}`,
                    precio: Math.floor(Math.random() * 2000) + 1, 
                    picture: `https://example.com/producto${i}-${j}.jpg`,
                    tags: selectedTags,
                    owner: insertedUsers[i]._id,
                });
            }
        }

         // Users with 30 products
        for (let i = 8; i < 10; i++) {
            for (let j = 0; j < 30; j++) {
                const numTags = Math.floor(Math.random() * 4) + 1; 
                const selectedTags = [];
                for (let k = 0; k < numTags; k++) {
                    selectedTags.push(tags[Math.floor(Math.random() * tags.length)]._id);
                }
                products.push({
                    product: `Producto ${i}-${j}`,
                    precio: Math.floor(Math.random() * 2000) + 1, 
                    picture: `https://example.com/producto${i}-${j}.jpg`,
                    tags: selectedTags,
                    owner: insertedUsers[i]._id,
                });
            }
        }

        await Product.insertMany(products);
        
        console.log('DB created successfuly.')
        console.log(`Created ${tags.length} Tags`)
        console.log(`Created ${users.length} Users`)
        console.log(`Created ${products.length} Products`)
        connection.close()

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error)
        connection.close()
    }
};

function ask(questionText){
    return new Promise((resolve,reject)=>{
        const consoleinter = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        }) 
        consoleinter.question(questionText, answer =>{
            consoleinter.close()
            resolve(answer)
        })
    })
}


initializeDB();