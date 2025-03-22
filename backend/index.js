import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import postRoutes from './src/posts/post/post.route.js';
import bodyParser from 'body-parser';
import faceRoutes from './src/Face_emotion/face.route.js';
import consultantRoutes from './src/Consultant/Consultant.route.js';
import userRoutes from './src/posts/User/user.route.js';
import botRoutes from './src/chatbot/bot.route.js';
import { verifyToken } from './utils/token.js';

const app=express();
const PORT=process.env.PORT || 5000;
//Middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());
app.use(cors({
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

//Routes
app.use('/posts', postRoutes);
app.use('/consultant', consultantRoutes);
app.use('/face', verifyToken, faceRoutes);
app.use('/user', userRoutes);
app.use('/chatbot', verifyToken, botRoutes);

//Connect to DB
async function main(){
  await mongoose.connect(process.env.DB_URL);
}
main().then(()=>console.log('Db Connected')).catch(err=>console.log(err));

app.listen(PORT,()=>{console.log('App is lisenning ')});
