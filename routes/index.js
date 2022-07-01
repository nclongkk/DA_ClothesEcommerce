const express = require('express');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

app.use('/auth', require('./auth'));
app.use('/users', require('./users'));
app.use('/address', require('./address'));
app.use('/shops', require('./shops'));
app.use('/shipping-units', require('./shippingUnits'));
app.use('/products', require('./products'));
// app.use('/feedbacks', require('./feedbacks'));
app.use('/categories', require('./categories'));
app.use('/cart-items', require('./cartItems'));
app.use('/wishlist', require('./wishlist'));
app.use('/orders', require('./orders'));
app.use('/notifications', require('./notifications'));
app.use('/dashboard', require('./dashboard'));
app.use('/admin', require('./admin'));

// Handle error
app.use(errorHandler);

module.exports = app;
