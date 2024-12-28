import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import auth from './routes/auth.js';
import user from './routes/user.js';
import course from './routes/course.js';
import grade from './routes/grade.js';
import enrollment from './routes/enrollment.js';
import assignments from './routes/assignment.js';
import db from './config/db.js';
import { Config } from './config/index.js';

const app = express();
const corsOptions = {
    origin: Config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

db()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan());
app.use(helmet());

app.use("/api/auth", auth);
app.use('/api/users', user);
app.use('/api/courses', course);
app.use('/api/grades', grade);
app.use('/api/enrollments', enrollment);
app.use('/api/assignments', assignments);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
