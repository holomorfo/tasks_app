require('../src/db/mongoose');
const User = require('../src/models/users');

User.findByIdAndUpdate('5d969400d3b89b0dff33ec5b', { age: 1 })
  // Print users
  .then(function(user) {
    console.log(user);
    return User.countDocuments({ age: 1 });
  })
  .then(function(result) {
    console.log(result);
  })
  .catch(function(e) {
    console.log(e);
  });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });

  return count;
};

updateAgeAndCount('5d969400d3b89b0dff33ec5b', 2).then(count => {
  console.log(count);
});
