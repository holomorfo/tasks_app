const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../email/account');
const router = new express.Router();

const upload = multer({
  // dest: 'avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error('Please upload an image file.'));

    // This is send when correct
    cb(undefined, true);
  }
});

router.post('/users', async function(req, res) {
  console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
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

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOparation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOparation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize({ width: 250, height: 250 })
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  '/users/me/avatar',
  auth,
  async function(req, res) {
    try {
      // question why it was removed
      req.user.avatar = undefined;
      console.log(req.user.avatar);
      await req.user.save();
      res.status(200).send('Avatar image deleted');
    } catch (error) {
      res.status(500).send();
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();
    res.set('Content-Type', 'image/png');
    res.status(200).send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
