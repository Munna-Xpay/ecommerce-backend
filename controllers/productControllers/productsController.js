import Product from '../../models/productsModel.js';

//add product
export const addProduct = async (req, res) => {
    //add validations here
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(200).json(newProduct);
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getAllProducts = async (req, res) => {
    const query = {};
    if (req.query.category) {
        query.category = req.query.category;
    } else if (req.query.brand) {
        query.manufacturer = req.query.brand;
    } else if (req.query.min && req.query.max) {
        query.price = { $gte: req.query.min, $lte: req.query.max };
    } else if (req.query.shipping) {
        query.shipping = req.query.shipping;
    } else if (req.query.inStock) {
        query.inStock = req.query.inStock;
    }
    try {
        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
}

//get one product
export const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err)
    }
}

//update product
export const updateProduct = async (req, res) => {
    //add validations
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err)
    }
}

//delete product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'product deleted successfully' });
    } catch (err) {
        res.status(500).json(err)
    }
}
