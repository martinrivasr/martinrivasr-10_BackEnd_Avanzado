import mongoose from 'mongoose';
import createError from 'http-errors'
import Product from '../../models/products.js'
import Tag from '../../models/tag.js';
import User from '../../models/users.js';
import { buildFilters } from '../../Utils/filters.js';
import { buildSortCriteria } from '../../Utils/sortCriteria.js';


export async function productList(req, res, next) {
    try {
        // query template : http://localhost:3000/api/products/?tag=todos&min-price=&max-price=&product-name=Lap
        //http://localhost:3000/api/products/?tag=lifestyle&min-price=100&max-price=900&product-name=producto&sort=precio&direction=desc&page=1

        const filters = await buildFilters(req.query) || {};
        const sortCriteria = buildSortCriteria(req.query);

        const limitPerPage = parseInt(req.query.limit) || 25;
        const skip = parseInt(req.query.page || 1) - 1;
        const fields = req.query.fields ? req.query.fields.split(',').join(' ') : [];


        // total record count
        const totalRecords = await Product.countDocuments(filters);
        
        // tptal pages
        const totalPages = Math.ceil(totalRecords / limitPerPage);

        // data filter with filters, pages and sorting
        const products = await Product.find(filters)
            .populate('owner tags')
            .sort(sortCriteria)  
            .skip(skip * limitPerPage)
            .limit(limitPerPage)
            .select(fields)
            .lean();

        

        products.forEach((product, index) => {
            if (!product.picture) {
                product.picture = '/imagen.jpg'; 
            }
            console.log(`Producto ${index + 1}: Imagen - ${product.picture}`);
        });

       res.json({
        results: products,
        totalRecords,
        totalPages,
        currentPage: skip + 1
       })

        
    } catch (error) {
        console.error(`Error in productList: ${error.message}`, { query: req.query, error });
        if (!res.headersSent) {
            res.status(500).send('Error obteniendo productos');
            console.error(`Error in productList: ${error.message}`, { query: req.query, error });
        }
    }
}

export async function productListbyProductID(req, res, next){
    const productId = req.params.productId
    const fields = req.query.fields ? req.query.fields.split(',').join(' ') : [];

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID format' });
    }

    console.log("Búsqueda de product id : ", productId)

    const product = await Product.findById(productId)
        .select(fields)
        .lean();

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json ({
        result: product
    })
}

export async function productListbyUserID(req, res, next){
    const userId = req.params.userId
    const fields = req.query.fields ? req.query.fields.split(',').join(' ') : [];

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const ProductByUser = await Product.find({ owner: userId})
        .select(fields)
        .lean();

    // total record count
    const totalRecords = ProductByUser.length;


    
    if (!ProductByUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json ({
        result: ProductByUser,
        totalRecords,
    })
}

export async function productCreation(req, res, next) {
    try {
     //const userId = req.session.userID
     //const  userId=  '6730e5270cc9c61c0e489375'
     console.log('El usuario logado es: ', req.apiUserId)
     const userId = req.apiUserId
      
     const { product, precio, picture, tags,  } = req.body;
      if (!tags || tags.length === 0) {
        return res.status(400).json({ error: 'Al menos un tag proporcionado no es válido.' });
        }    
      const tagObjectIds = (await Tag.find({ tagname: { $in: tags.split(',') } }).select('_id')).map(tag => tag._id);
      const picturePath = req.file ? req.file.filename : 'imagen.jpg'

      const newProduct  = new Product({
        product,
        precio,
        picture: picturePath,
        tags: tagObjectIds,
        owner: userId
      })

      const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(400).json({ error: 'El usuario especificado no existe.' });
        }
      
      const ProductSaved = await newProduct .save()

      res.status(201).json({ result: ProductSaved})

    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.status(500).json({ error: 'Error al crear el producto', details: err.message });
    }
  }

export async function productUpdate(req, res, next){
    try {
        const productId = req.params.productId
        const { product, precio, picture, tags,  } = req.body;

      
        //  if (!tags || tags.length === 0) {
         // return res.status(400).json({ error: 'Al menos un tag proporcionado no es válido.' });
        //  }    
        let productData = {}

          if (tags) {
            const tagObjectIds = (await Tag.find({ tagname: { $in: Array.isArray(tags) ? tags : tags.split(',') } })
            .select('_id')).map(tag => tag._id);
            productData.tags = tagObjectIds;
          }
        
          if (req.file) productData.picture = req.file.filename;
          if (product) productData.product = product;
          if (precio) productData.precio = precio;
        

        const updateProduct = await Product.findByIdAndUpdate(productId, productData, {
            new: true
        })

        if (!updateProduct) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json({ result: updateProduct })
       

    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error al actualizar el producto', details: err.message });
    }
}

export async function productDelete(req, res, next){
    try {
        const userId = req.apiUserId
        const productId = req.params.productId
        
        const product = await Product.findOne({  _id: productId })
        
        if(!product){
            console.warn(`WARNING - el usuario ${userId} esta intentando borrar un producto inexistente`)
            return next(createError(404))
        }
        
        if (product.owner.toString() !== userId){
        console.warn(`WARNING - el usuario ${userId} esta intentando borrar un producto de otro usuario`)
            return next(createError(401))
        }
        await Product.deleteOne({ _id: productId })
        
        res.json()
    } catch (error) {
        next(error)
    }
    
}