import mongoose from 'mongoose'
import Product from '../models/products.js'
import Tag from '../models/tag.js'; //


export function index(req, res, next){
    res.render('createItem')
}

export async function postNew(req, res, next) {
    try {
      const userId = req.session.userID

      const { product, precio, picture, tags } = req.body;
      const pictureUrl = `http://localhost:3000/uploads/${picture}`; 
      const tagIds = await Tag.find({ tagname: { $in: tags } }).select('_id'); 
      const tagObjectIds = tagIds.map(tag => tag._id);
      const newProduct  = new Product({
        product,
        precio,
        picture: pictureUrl, 
        tags: tagObjectIds,
        owner: userId
      })
      console.log('newProduct', newProduct)
      
      await newProduct .save()
      console.log('ya grabe')
      console.log('Redirigiendo a /user-items')
      return res.redirect('/user-items')
    } catch (err) {
      next(err)
    }
  }