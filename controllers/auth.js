const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');
const errorHendler = require('../utils/errorHendler');

module.exports.login = async (req, res) => {
    
    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {
        // Checking if this passwords is same 
        const passwordResult = await bcryptjs.compare(req.body.password, candidate.password);
        if (passwordResult) {
            // Generating token, passwords coincide

            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60});

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            // wrong password
            res.status(401).json({
                message: 'Не вірний пароль.'
            })
        }
    } else {
        res.status(404).json({
            message: `Користувач з таким емейлом не знайдений`
        })
    }

}

module.exports.register = async (req, res) => {
    try {
        // find email
        const candidate = await User.findOne({email: req.body.email});
        if (candidate) {
            // If user already exist with same email need send the error...
            res.status(409).json({
                message: 'Коритувач з таким email-ом уже зареєстрований.'
            })
        } else {
            // Need create user... 
            const hashPassword = await bcryptjs.hash(req.body.password, 10);

            const user = new User({
                email: req.body.email,
                password: hashPassword
            })
            await user.save();
            res.status(201).json(user);
        }
    } catch (error) {
        errorHendler(res, error);
    }
}