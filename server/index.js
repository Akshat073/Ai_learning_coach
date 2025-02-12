import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import userRouter from './routes/user.route.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
// app.use(cors({
//   origin: ['https://kid-tutor-5etq.vercel.app', process.env.FRONTEND_URL, 'http://localhost:3000'],
//   credentials: true
// }));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/user', userRouter);

// Start server
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
