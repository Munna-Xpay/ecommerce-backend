import Product from '../../models/productsModel.js';

//add product
export const addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(200).json(newProduct);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all product or by query
export const getAllProducts = async (req, res) => {
    const category = req.query.category;
    const brand = req.query.brand;
    const minPrice = req.query.min;
    const maxPrice = req.query.max;
    const shipping = req.query.shipping;
    const rating = req.query.rate;
    const inStock = req.query.inStock;
    try {
        let products;
        if (category) {
            products = await Product.find({ category });
        } else if (brand) {
            products = await Product.find({ manufacturer: brand });
        } else if (minPrice && maxPrice) {
            products = await Product.where("price").gte(minPrice).lte(maxPrice);
        } else if (minPrice && maxPrice) {
            products = await Product.find({ shipping });
        } else if (inStock) {
            products = await Product.find({ inStock });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err)
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
