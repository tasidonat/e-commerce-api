const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRouters = require('./routes/order');
const checkoutRoutes = require('./routes/checkout');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/aoi/products', productRoutes);
app.use('/api/orders', orderRouters);
app.use('/api/checkout', checkoutRoutes);

module.exports = app;