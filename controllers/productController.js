const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Create product
exports.createProduct = async (req, res) => {
    const { name, description, price, category } = req.body;

    if(!name || !price || !category) {
        return res.status(400).json({ message: 'Missing data!' });
    }

    const featuredImage = req.files?.featuredImage?.[0]?.path || '';
    const galleryImages = req.files?.galleryImages?.map(file => file.path) || [];

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            featuredImage,
            galleryImages,
        });

        await newProduct.save();

        return res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    const { name, category, minPrice, maxPrice } = req.body;

    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = category;
    if (minPrice) query.price = { ...query.price, $gte: minPrice };
    if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
    
    try {
        const products = await Product.find(query).populate('category');

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Get a single product
exports.getProduct = async (req, res) => {
    const productId = req.params.id;
    
    try {
        const product = await Product.findById(productId).populate('category');

        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    const { name, description, price, category } = req.body;
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({ message: 'Product nor found' });
        }

        if(!!name) {
            product.name = name;
        }
        if(!!description) {
            product.description = description;
        }
        if(!!price) {
            product.price = price;
        }
        if(!!category) {
            product.category = category;
        }

        if(req.file) {
            const oldImage = product.featuredImage;
            product.featuredImage = req.file.path;

            if(oldImage) {
                fs.unlink(path.resolve(oldImage), err => {
                    if(err) console.error(`Error deleting file: ${oldImage}`, err);
                });
            }
        }

        await product.save();

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByIdAndDelete(productId);

        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if(product.featuredImage) {
            fs.unlink(path.resolve(product.featuredImage), err => {
                if(err) console.error(`Error deleting file: ${product.featuredImage}`, err);
            });
        }

        if (product.galleryImages) {
            product.galleryImages.forEach(image => {
              fs.unlink(path.resolve(image), err => {
                if (err) console.error(`Error deleting file: ${image}`, err);
              });
            });
          }

          return res.status(200).json({ message: 'Success' });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

exports.addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.reviews.push({
            user: req.user._id,
            rating,
            comment
        });

        await product.save();
        
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};