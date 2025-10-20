require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT;

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Server chạy tại http://localhost:${PORT}`)))
  .catch(err => console.error('Lỗi kết nối MongoDB', err));