
    import swaggerUI from 'swagger-ui-express'
    import yaml from 'yamljs';
    
    const swaggerEn = yaml.load('./APIDoc-en.yaml');
    const swaggerEs = yaml.load('./APIDoc-es.yaml');

    function swaggermiddleware(req,res, next){
        const lang = req.cookies['nodepop-locale'] || 'es'
        const swaggerDocument = lang === 'en' ? swaggerEn : swaggerEs
        req.swaggerDoc = swaggerDocument;
        next();
    }
    
    export default [
        swaggermiddleware,
        swaggerUI.serve, 
        (req, res) => swaggerUI.setup(req.swaggerDoc)(req, res)
        ];
    /* 
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Nodepop API',
                version: '1.0',
            }
        },
        apis:['APIDoc.yaml']
        apis:['controllers/apicontrollers/**js']};

    const specification = swaggerJSDoc(options);

    export default [swaggerUI.serve, swaggerUI.setup(specification)];*/