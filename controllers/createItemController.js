import mongoose from 'mongoose'
import Product from '../models/products.js'
import Tag from '../models/tag.js'; //
import { sendToQueue } from '../lib/messageQueue.js';
import path from 'path';


export function index(req, res, next){
    res.render('createItem')
}

export async function postNew(req, res, next) {
    try {
      const userId = req.session.userID

      console.log(req.file)
      const { product, precio, picture, tags } = req.body;
     // const pictureUrl = `http://localhost:3000/uploads/${picture}`; 
      const tagIds = await Tag.find({ tagname: { $in: tags } }).select('_id'); 
      const tagObjectIds = tagIds.map(tag => tag._id);
      const newProduct  = new Product({
        product,
        precio,
        picture: req.file.filename, 
        tags: tagObjectIds,
        owner: userId
      })
      console.log('newProduct', newProduct)

      const queueName = 'imageQueue';

      const message = {
        filePath: path.resolve('./public/uploads', req.file.filename),
        fileName: req.file.filename
      };
      
  
      await sendToQueue(queueName, message);
  
      console.log(`Mensaje enviado a la cola ${queueName}:`, message);

      
      await newProduct .save()
      console.log('ya grabe')
      console.log('Redirigiendo a /user-items')
      return res.redirect('/user-items')
    } catch (err) {
      next(err)
    }
  }

  export async function testRabbitMQ(req, res, next) {
    try {
      const queueName = 'testQueue1';
      const message = { text: 'Hola, RabbitMQ nvo mensaje!' };
      
      await sendToQueue(queueName, message);
      res.send(`Mensaje enviado a la cola ${queueName}`);
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      next(err);
    }
  }
