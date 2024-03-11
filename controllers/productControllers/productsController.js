import Product from '../../models/productsModel.js';

//add product
export const addProduct = async (req, res) => {

    // const thumbnail = req.files.thumbnail[0].filename;
    // const images = req.files.images.map((img) => img.filename)
    // // console.log(thumbnail)
    // // console.log(images)
    try {
        const newProduct = new Product(req.body);
        // const newProduct = new Product({ ...req.body, thumbnail, images });
        await newProduct.save();
        res.status(200).json(newProduct);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all products or by query
export const getAllProducts = async (req, res) => {
    // console.log(req.query)
    const query = {
        isActive: true
    };
    if (req.query.category) {
        query.category = req.query.category;
    }
    if (req.query.brand) {
        query.manufacturer = req.query.brand;
    }
    if (req.query.min && req.query.max) {
        query.discounted_price = { $gte: req.query.min, $lte: req.query.max };
    }
    if (req.query.shipping) {
        query.shipping = req.query.shipping;
    }
    if (req.query.inStock) {
        query.inStock = req.query.inStock == 'true' ? true : false;
    }
    if (req.query.review) {
        query.review_star = { $gte: req.query.review };
    }
    // console.log(query)
    try {
        if (req.query.sort == 'oldest') {
            const products = await Product.find(query).populate("seller");
            res.status(200).json(products);
        } else if (req.query.sort == "popular") {
            const products = await Product.find(query).populate("seller").sort({ review_star: -1 });
            res.status(200).json(products);
        } else {
            const products = await Product.find(query).populate("seller").sort({ createdAt: -1 });
            res.status(200).json(products);
        }
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

//get all brands from all document

export const getBrands = async (req, res) => {
    try {
        const allBrands = await Product.aggregate([
            {
                $group: {
                    _id: "$manufacturer"
                }
            }
        ])
        res.status(200).json(allBrands);
    } catch (err) {
        res.status(500).json(err)
    }
}

//products total price by category
export const getPriceByCategory=async (req,res)=>{
    try{
  const categoryData=await Product.aggregate([
    {
        $group:{
            _id:"$category",
            total_price:{$sum:"$discounted_price"}
        }
    }
  ])
  res.status(200).json(categoryData)
    }
    catch(err){
        res.status(500).json(err)
    }
}

//products by category
export const getProductsByCategory=async(req,res)=>{
    try{
const products=await Product.aggregate([
    {
        $match:{
            category: { $in: ["Electronics", "Fashion"] }
        }
    }
  
     
])
res.status(200).json(products)
    }
    catch(err){
        res.status(500).json(err)
    }
}

