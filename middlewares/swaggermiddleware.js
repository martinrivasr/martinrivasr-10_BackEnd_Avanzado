    import swaggerJSDoc from "swagger-jsdoc";
    import swaggerUI from 'swagger-ui-express'

    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Nodepop API',
                version: '1.0',
                description: `
                        Nodepop is an API designed to manage products, users, and tags in a commerce platform.
                        This API provides CRUD operations for products, supports image handling, applies filters,
                        and allows queries by user.

                        **Features**:
                        - Advanced filters to search products by price, name, and tags.
                        - Pagination and sorting for large datasets.
                        - User management with associated products.
                        - Image upload support for products.

                        **Example Usage**:
                        - Get filtered products: \`/api/products?tag=lifestyle&min-price=100&max-price=900\`.
                        - Create a new product by sending data in the request body.
                    `,
            }
        },
        apis:['APIDoc.yaml']
        //apis:['controllers/apicontrollers/**/*js']
    };

    const specification = swaggerJSDoc(options);

    export default [swaggerUI.serve, swaggerUI.setup(specification)];