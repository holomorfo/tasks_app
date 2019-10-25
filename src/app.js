const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/users');
const tasksRouter = require('./routers/tasks');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

module.exports = app;
