const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Middleware
app.use(bodyParser.json());

app.use(cors({
  origin: ['https://3b17-197-248-111-39.ngrok-free.app', 'http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'gigateam',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisedb = pool.promise();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dtl8iygo0',
  api_key: '135698412873236',
  api_secret: 'QlzxDGV3Dr1s8ODD4izK9ePRoa8'
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    format: async (req, file) => 'jpeg',
    public_id: (req, file) => file.originalname.split('.')[0]
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, '../public')));

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

// Authorization
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM admin WHERE name = ? AND password = ?';

  pool.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', token: 'jwt-token' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// Endpoint to get all products
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await promisedb.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Endpoint to add a new product
app.post('/api/products', async (req, res) => {
  try {
    const { id, name, imageUrl, price, oldprice, category, onoffer, bestselling, description } = req.body;

    const [result] = await promisedb.query(
      'INSERT INTO products (id, name, image, price, oldprice, category, onoffer, bestselling, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, imageUrl, price, oldprice, category, onoffer, bestselling, description]
    );

    res.json({
      id: result.insertId,
      name,
      imageUrl,
      price,
      oldprice,
      category,
      onoffer,
      bestselling
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Endpoint to update a product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const updatedProductData = req.body;

  try {
    const [rows] = await promisedb.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = rows[0];
    const oldPrice = product.price;
    const isOnOffer = updatedProductData.price < oldPrice * 0.95;

    await promisedb.query(
      'UPDATE products SET name = ?, price = ?, onOffer = ?, bestselling = ?, description = ?, oldPrice = ? WHERE id = ?',
      [updatedProductData.name || product.name, updatedProductData.price, isOnOffer, updatedProductData.bestselling, updatedProductData.description, oldPrice, id]
    );

    const [updatedRows] = await promisedb.query('SELECT * FROM products WHERE id = ?', [id]);

    res.status(200).json(updatedRows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;

  const deleteQuery = 'DELETE FROM products WHERE id = ?';

  pool.query(deleteQuery, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).send('Error deleting product');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Product not found');
    } else {
      res.status(200).json({ message: `Product with ID ${productId} deleted successfully.` });
    }
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
