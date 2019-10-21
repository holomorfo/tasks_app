const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async function(req, res) {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();

    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async function(req, res) {
  try {
    // Option 1
    const tasks = await Task.find({ owner: req.user._id });
    res.status(201).send(tasks);
    // Option 2
    // await req.user.populate('tasks').execPopulate();
    // res.status(201).send(req.user.tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks/:id', auth, async function(req, res) {
  const _id = req.params.id;
  try {
    // const tasks = await Task.findById(_id);
    const tasks = await Task.findOne({ _id, owner: req.user._id });
    if (!tasks) return res.status(404).send();
    res.status(201).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOparation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOparation)
    return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    // const task = await Task.findById(req.params.id);
    if (!task) res.status(404).send('Task not found');
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) return res.status(404).send('Task not found');
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
