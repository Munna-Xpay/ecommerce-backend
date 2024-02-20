import Category from "../../models/categoryModel.js";


//add Category
export const addCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(200).json(newCategory);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get all Category or by query
export const getAllCategory = async (req, res) => {
    try {
        const category = await Category.find();
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get Category by type
export const getCategoryByType = async (req, res) => {
    try {
        const category = await Category.find({ type: req.params.type });
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json(err)
    }
}

//update Category
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json(err)
    }
}

//delete Category
export const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json(err)
    }
}
