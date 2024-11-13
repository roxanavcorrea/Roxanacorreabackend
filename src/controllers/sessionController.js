import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../data/models/user.js';

const saltRounds = 10;

const hashPassword = (password) => bcrypt.hashSync(password, saltRounds);

export const createUser = async (userData) => {
    const hashedPassword = hashPassword(userData.password);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true });
        return res.json({ message: 'Login exitoso', token });
    } else {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }
};
