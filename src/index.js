// Udemy video 91
const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/users');
const tasksRouter = require('./routers/tasks');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(tasksRouter);

app.listen(port, function() {
  console.log('Server running on port ', port);
});

const Task = require('./models/task');
const User = require('./models/user');
const main = async () => {
  // const task = await Task.findById('5dae1f6ee9364a38e3d6a25a');
  // await task.populate('owner').execPopulate();
  // console.log(task.owner);

  const user = await User.findById('5dae1edc3ceba57b19f65093');
  await user.populate('tasks').execPopulate();
  console.log(user.tasks);
};

main();
