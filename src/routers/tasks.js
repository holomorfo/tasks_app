const express = require('express');
const router = new express.Router();

const Task = require('../models/task');

router.post('/tasks', async function(req, res) {
  const task = new Task(req.body);
  try {
    await task.save();

    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', async function(req, res) {
  try {
    const tasks = await Task.find({});
    res.status(201).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks/:id', async function(req, res) {
  const _id = req.params.id;
  console.log(_id);
  try {
    const tasks = await Task.findById(_id);
    if (!tasks) return res.status(404).send();
    res.status(201).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOparation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOparation)
    return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const task = await Task.findById(req.params.id);
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    if (!task) res.status(404).send('Task not found');
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send('Task not found');
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
