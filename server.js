const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nimisha.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running on " + PORT));