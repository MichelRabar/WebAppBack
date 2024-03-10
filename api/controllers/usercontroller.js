const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { use } = require("../route/userroute");

exports.register = async (req, res) => {
    console.log(req.body);
    const newUser = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    });

    try {
        await newUser.save();
        return res.status(200).json({
            title: 'signup success'
        });
    } catch (error) {
        return res.status(400).json({
            title: 'error',
            error: error
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //provjera postojanja korisnka
        const user = await User.findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({
                title: 'prijava je neuspješna',
                error: 'invalid credentials',
            });
        }

        //generiranje tokena ako email i lozinka ispravni
        const token = jwt.sign({ userId: user._id }, 'secretkey');
        res.status(200).json({
            title: 'Login successful!',
            token: token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            title: 'server error',
            error: err.message,
        });
    }
};

exports.logout = (req, res) => {
    // logika odjave,  deautorizacija tokena 
    res.status(200).json({ message: 'Odjava uspješna' });
};