const {Router} = require('express');
const router = Router();
const {getProducts, createNewProducts, getProductById,deleteProductById, updateProductById } = require('../controllers/products.controller')


router.get('/products', getProducts)

router.post('/createProducts', createNewProducts)

router.get('/products/:id', getProductById)


router.delete('/products/:id', deleteProductById)

router.put('/UpdateProducts/:id', updateProductById) 


module.exports = router;