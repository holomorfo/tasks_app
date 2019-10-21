require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5d9780352c41fd71ee8fd108')
  // Print users
  .then(function(user) {
    console.log(user);
    return Task.countDocuments({ completed: false });
  })
  .then(function(result) {
    console.log(result);
  })
  .catch(function(e) {
    console.log(e);
  });

const deleteTaskAndCount = async id => {
  const taskDeleted = await Task.findByIdAndDelete(id);
  const counter = Task.countDocuments({ completed: false });
  return counter;
};

deleteTaskAndCount('5d9783f4f61a170392db2d69')
  .then(result => console.log(result))
  .catch(e => console.log(e));
