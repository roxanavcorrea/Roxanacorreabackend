import express from 'express';
import passport from 'passport';
import { login, createUser } from '../controllers/sessionsController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', async (req, res) => {
    await createUser(req.body);
    res.json({ message: 'Usuario registrado' });
});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export default router;
