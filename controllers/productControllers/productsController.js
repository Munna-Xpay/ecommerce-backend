import Product from '../../models/productsModel.js';

//add product
export const addProduct = async (req, res) => {

    const thumbnail = req.files.thumbnail[0].filename;
    const images = req.files.images.map((img) => img.filename)
    // console.log(thumbnail)
    // console.log(images)
    try {
        const newProduct = new Product({ ...req.body, thumbnail, images });
        await newProduct.save();
        res.status(200).json(newProduct);
    } catch (err) {
        res.status(500).json(err)
    }
    res.send("hey")
}

//get all products or by query
export const getAllProducts = async (req, res) => {
    const query = {
        isActive: true
    };
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
        const products = await Product.find(query).populate("seller");
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
}

//get one product
export const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate('seller');
        product && res.status(200).json(product);
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
        const disableProduct = await Product.findByIdAndUpdate(req.params.id, { $set: { isActive: false } }, { new: true });
        res.status(200).json({ message: 'product deleted successfully' });
    } catch (err) {
        res.status(500).json(err)
    }
}
