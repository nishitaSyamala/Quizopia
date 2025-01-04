import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import courseRouter from './routes/course.routes.js';
import quizRouter from './routes/quizzes.routes.js';
import resultRouter from './routes/result.routes.js';
import notificationRouter from './routes/notification.routes.js';


const app = express();

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.CORS,
    credentials: true
}))

app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter)
app.use('/api/v1/quiz', quizRouter)
app.use('/api/v1/result', resultRouter)
app.use('/api/v1/notification', notificationRouter)





export default app;