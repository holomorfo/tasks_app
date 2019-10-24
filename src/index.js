// Udemy video 91
const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/users');
const tasksRouter = require('./routers/tasks');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

app.listen(port, function() {
  console.log('Server running on port ', port);
});
