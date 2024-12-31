import assert from 'node:assert';
import mongoose from 'mongoose';
import Product from '../models/products.js';
import User from '../models/users.js';
import Tag from '../models/tag.js';

export async function index(req, res, next) {
  try {
      const ObjectId = mongoose.Types.ObjectId;
      
      const userId = req.session.userID;
      const products = await Product.find({ owner: new ObjectId(userId) }).populate('owner tags');
      res.locals.session = req.session;
      
      
      const recordsPerPage = 25;
      const sort = 'product';
      const direction = 'asc';

      res.render('useritems', { products, recordsPerPage, sort, direction });
  } catch (error) {
      console.error('Error obteniendo productos:', error);
      res.status(500).send('Error obteniendo productos');
  }
}


export async function deleteProduct(req, res, next) {
 
    const userId = req.session.userID
    
    const productId = req.params.productId
    

    const product = await Product.findOne ({ _id: productId })
    console.log('dato de producto encontrado: ', product)
  
   
    if (!product) {
      console.warn(`WARNING - el usuario ${userId} está intentando eliminar un agente inexistente`)
      return next(createError(404, 'Not found'))
    }
  
    if (product.owner.toString() !== userId) {
      console.warn(`WARNING - el usuario ${userId} está intentando eliminar un agente de otro usuario`)
      return next(createError(401, 'Not authorized'))
    }
  
    await product.deleteOne({ _id: productId })
  
    res.redirect('/user-items')
  
  }