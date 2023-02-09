const express = require('express');
const app = express();
const cors = require('cors');
const blogRouter = require('./routes/blog.routes');

app.use(cors());
app.use(express.json());

app.use('/', blogRouter);

module.exports = app;