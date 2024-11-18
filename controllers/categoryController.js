const Category = require('../models/Category');

// Create new category
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;

    if(!name) {
        return res.status(400).json({ message: 'Category name is required!' });
    }

    try {
        const newCategory = new Category({ name, description });
        await newCategory.save();

        return res.status(201).json(newCategory);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Get all
exports.getCategories = async (req, res) => {
    try {
        const categries = await Category.find();

        return res.status(200).json(categries);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Get category
exports.getCategory = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const category = await Category.findById(categoryId);

        if(!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).message({ message: error });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true, runValidators: true }
        );

        if(!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if(!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};