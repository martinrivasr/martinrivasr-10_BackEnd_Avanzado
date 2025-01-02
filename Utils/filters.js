import Tag from "../models/tag.js";

export async function buildFilters(query){
    const filters = {};
    const { tag, 'min-price': minPrice, 'max-price': maxPrice, 'product-name': productName } = query;


    if (tag && tag !== 'todos') {
        const tagDoc = await Tag.findOne({ tagname: tag });
        if (tagDoc) {
            filters.tags = { $in: [tagDoc._id] };
        } else {
            console.warn(`El tag "${tag}" no se encontró en la base de datos.`);
        }
    }

    if (minPrice) filters.precio = { $gte: minPrice };

    if (maxPrice) filters.precio = { ...filters.precio, $lte: maxPrice };
   
    if (productName) filters.product = new RegExp('^' + productName, 'i');
    
    return filters;
}