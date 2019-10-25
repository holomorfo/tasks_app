const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');

const {
  userOne,
  userOneId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('should create a task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: 'From my test' })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('should not create a task for non autenticated user', async () => {
  const response = await request(app)
    .post('/tasks')
    .send({ description: '0rom my test' })
    .expect(401);
});

test('should show tasks of user ', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test('should not delete task from other user', async () => {
  const response = await request(app)
    .delete('/tasks/' + taskOne._id)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(401);
  const task = await Task.findById(taskOne._id);
  expect(task._id).not.toBeNull();
});

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated

//
// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks
