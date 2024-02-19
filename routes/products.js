const { addProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct } = require('../controllers/productsController')

const router = require('express').Router()

//add product route
router.post('/add', addProduct);

//get products route
router.get('/get', getAllProducts);

//get one product route
router.get('/get/one/:id', getOneProduct);

//update product route
router.put('/update/:id', updateProduct);

//delete product route
router.delete('/delete/:id', deleteProduct);


module.exports = router