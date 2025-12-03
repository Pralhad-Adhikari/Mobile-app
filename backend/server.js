const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', require('./routes/auth'));

const shoesRoutes = require('./routes/shoes');
app.use('/api/shoes', shoesRoutes);

const ratingRoutes = require('./routes/rating');
app.use('/api/rating', ratingRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);

const welcomeRoutes = require('./routes/welcome');
app.use('/api', welcomeRoutes);

const statusRoutes = require('./routes/status');
app.use('/api', statusRoutes);

const imageRoutes = require('./routes/images');
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));
