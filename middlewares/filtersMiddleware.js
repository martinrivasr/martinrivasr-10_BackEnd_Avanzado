export function validateFilters(req, res, next) {
    const { tag, 'min-price': minPrice, 'max-price': maxPrice, 'product-name': productName } = req.query;

    //  minPrice validation
    if (minPrice) {
        const minPriceNumber = parseFloat(minPrice);
        if (isNaN(minPriceNumber) || minPriceNumber < 0) {
            return res.status(400).json({ error: 'El precio mínimo debe ser un número válido mayor o igual a 0.' });
        }
    }

    //  maxPrice validation
    if (maxPrice) {
        const maxPriceNumber = parseFloat(maxPrice);
        if (isNaN(maxPriceNumber) || maxPriceNumber < 0) {
            return res.status(400).json({ error: 'El precio máximo debe ser un número válido mayor o igual a 0.' });
        }

        //  maxPrice >= minPrice validation
        if (minPrice && parseFloat(maxPrice) < parseFloat(minPrice)) {
            return res.status(400).json({ error: 'El precio máximo debe ser mayor o igual al precio mínimo.' });
        }
    }

    //  tag validation
    if (tag && typeof tag !== 'string') {
        return res.status(400).json({ error: 'El tag debe ser un texto válido.' });
    }

    //  productName validation
    if (productName && typeof productName !== 'string') {
        return res.status(400).json({ error: 'El nombre del producto debe ser un texto válido.' });
    }

    next();
}
