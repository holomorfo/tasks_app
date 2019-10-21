const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();
router.get('/test', (req, res) => {
  res.send('From a new file');
});

router.post('/users', async function(req, res) {
  console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async function(req, res) {
  res.send(req.user);
});

router.post('/users/logoutALL', auth, async (req, res) => {
  try {
    console.log(req.user);
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send('Logged out from all sessions');
  } catch (e) {
    res.status(500).send();
  }
});
router.get('/users/me', auth, async function(req, res) {
  res.send(req.user);
});

router.get('/users/:name', async function(req, res) {
  console.log(req.params);
  try {
    const users = await User.find({ name: req.params.name });
    res.send(users);
  } catch (error) {
    res.send(400);
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOparation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOparation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const user = await User.findById(req.params.id);
    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    if (!user) res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
