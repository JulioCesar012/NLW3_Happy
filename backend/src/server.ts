import express from 'express'
import cors from 'cors';
import path from 'path';
import 'express-async-errors';

import errorHandler from './error/handler';

import routes from './routes';

import './database/connection';

require('dotenv').config()
const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(errorHandler);

app.listen(3333);