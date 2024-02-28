import Cart from '../../models/cartModel.js'

//addtocart
export const addToCart = async (req, res) => {

    //user id
    const userId = req.payload

    const { product, original_price } = req.body

    try {
        const existingProduct = await Cart.findOne({ product, userId })
        if (existingProduct) {
            res.status(503).json("Product already exists in cart!")
        }
        else {
            const newProduct = new Cart({ product, userId, original_price })
            await newProduct.save()
            const allCartProducts = await Cart.find({ userId }).populate('product')
            res.status(200).json(allCartProducts)
        }
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Add To Cart Failed' })
    }
}

//all cart products
export const cartProducts = async (req, res) => {
    const userId = req.payload
    try {
        const products = await Cart.find({ userId }).populate('product')
        if (products) {
            res.status(200).json(products)
        }
    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Cart product access failed' })
    }
}

//quantity increment
export const incrementCartQty = async (req, res) => {
    const { _id } = req.params
    const { original_price } = req.body
    try {
        await Cart.findByIdAndUpdate(_id, { $inc: { quantity: +1, original_price } })
        res.status(200).json('Quantity incremented')

    }
    catch (err) {
        res.status(401).json({ error: err, message: 'Quantity increment failed' })
    }
}

// //quantity decrement
export const decrementCartQty = async (req, res) => {
    const { _id } = req.params
    const { original_price } = req.body
    try {
        await Cart.findByIdAndUpdate(_id, { $inc: { quantity: -1, original_price: -original_price } })
        res.status(200).json('Decremented')
    }
    catch (err) {
        res.status(401).json({ eror: err, message: 'Quantity decrement failed' })
    }
}

//remove cart product
export const deleteCartProduct = async (req, res) => {
    const { _id } = req.params
    try {
        const removedProduct = await Cart.findByIdAndDelete({ _id })
        res.status(200).json(removedProduct)
    }
    catch (err) {
        res.status(401).json(err)
    }
}