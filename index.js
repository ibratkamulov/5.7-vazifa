const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authorRouter = require('./router/author.routes');
const bookRouter = require('./router/book.routes');
const authRouter = require('./router/auth.routes');
const citationRouter = require('./router/citation.routes');

const errorMiddleware = require('./middleware/error.middleware');

require('dotenv').config();
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;
const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ✅ API ROUTES
app.use('/api/auth', authRouter);
app.use('/api/authors', authorRouter);
app.use('/api/books', bookRouter);
app.use('/api/citations', citationRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server ${PORT} portida ishga tushdi`);
});