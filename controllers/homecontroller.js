import mongoose from 'mongoose';
import assert from 'node:assert';
import Product from '../models/products.js';
import User from '../models/users.js';
import Tag from '../models/tag.js';

export async function index(req, res, next) {
    try {
        const filters = {};
        
        const tag = req.query.tag || 'todos';
        const minPrice = req.query['min-price'] || '';
        const maxPrice = req.query['max-price'] || '';
        const productName = req.query['product-name'] || '';

        if (tag && tag !== 'todos') {
            const tagDoc = await Tag.findOne({ tagname: tag });
            if (tagDoc) {
                filters.tags = { $in: [tagDoc._id] };
            }
        }
        if (minPrice) {
            filters.precio = { $gte: minPrice };
        }
        if (maxPrice) {
            filters.precio = filters.precio || {};
            filters.precio.$lte = maxPrice;
        }
        if (productName) {
            filters.product = new RegExp('^' + productName, 'i');
        }

        const recordsPerPage = parseInt(req.query.limit) || 25;
        const skip = parseInt(req.query.page || 1) - 1;
        
        // Sorting
        const sort = req.query.sort || 'product';
        const direction = req.query.direction === 'desc' ? -1 : 1;

        // sortin options
        let sortCriteria = {};
        if (sort === 'owner') {
            sortCriteria = { 'owner.name': direction };
        } else if (sort === 'tags') {
            sortCriteria = { 'tags.tagname': direction };
        } else {
            sortCriteria = { [sort]: direction };
        }


        // total record count
        const totalRecords = await Product.countDocuments(filters);
        
        // tptal pages
        const totalPages = Math.ceil(totalRecords / recordsPerPage);

        // data filter with filters, pages and sorting
        const products = await Product.find(filters)
            .populate('owner tags')
            .sort(sortCriteria)  
            .skip(skip * recordsPerPage)
            .limit(recordsPerPage);

        

        products.forEach((product, index) => {
            if (!product.picture) {
                product.picture = '/imagen.jpg'; 
            }
            console.log(`Producto ${index + 1}: Imagen - ${product.picture}`);
        });

        res.locals.session = req.session;
        res.render('home', { 
            products, 
            tag, 
            minPrice, 
            maxPrice, 
            productName, 
            totalRecords, 
            recordsPerPage,
            currentPage: skip + 1,
            totalPages,
            sort,
            direction: req.query.direction || 'asc'
        });
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).send('Error obteniendo productos');
    }
}
