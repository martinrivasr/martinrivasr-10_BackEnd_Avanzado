import mongoose from 'mongoose';
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

export async function productListOne(req, res, next){
    const productId = req.params.productId
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'Invalid product ID format' });
    }

    console.log("product id : ", productId)

    const product = await Product.findById(productId)

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json ({
        result: product
    })
}

export async function productCreation(req, res, next) {
    try {
     //const userId = req.session.userID
     const  userId=  '6730e5270cc9c61c0e489375'
     console.log('req.body:', req.body); // Logs del cuerpo de la petición
     console.log('User ID:', userId); // Logs del cuerpo de la petición
     console.log('req.file:', req.file); // Logs del archivo subido (si existe)
     console.log('req.headers:', req.headers); // Logs de los encabezados
     console.log('req.contentType:', req.headers['content-type']);
      const { product, precio, picture, tags,  } = req.body;
      if (tags.length === 0) {
        return res.status(400).json({ error: 'Al menos un tag proporcionado no es válido.' });
    }    

      const tagObjectIds = (await Tag.find({ tagname: { $in: tags.split(',') } }).select('_id')).map(tag => tag._id);
      const picturePath = req.file ? req.file.filename : 'imagen.jpg'
      const newProduct  = new Product({
        product,
        precio,
        picture: req.file.filename, 
        tags: tagObjectIds,
        owner: userId
      })

      const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(400).json({ error: 'El usuario especificado no existe.' });
        }
        console.log('Owner ID:', userId);
        console.log('Tags:', tagObjectIds);
        console.log('Picture:', picturePath);
        console.log('newProduct', newProduct)
      
      const ProductSaved = await newProduct .save()

      console.log('ya grabe')
      res.status(201).json({ result: ProductSaved})

    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.status(500).json({ error: 'Error al crear el producto', details: err.message });
    }
  }