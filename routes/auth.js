const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const tokenGuard = require('./tokenGuard');
const { registerValidation, loginValidation } = require('../validations');

//REGISTER
router.post('/register', async (req, res) => {
    //Validate data
    const { error } = registerValidation(req.body);
    if(error) return res.status(401).send({
        error: true,
        message: error.details[0].message
    });

    //Check user duplicate
    const emailDuplicated = await User.findOne({email: req.body.email}); 
    if(emailDuplicated) return res.status(400).send({
        error: true,
        message: 'Email already exists'
    });
    
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        birthday: req.body.birthday,
        gender: req.body.gender,
        email: req.body.email,
        password: hashedPassword,
        tokens: {
            token: '',
            refreshToken: '',
            createdAt: null
        }
    });

    try {
        const savedUser = await user.save();
        //Create and assign a token
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET, { expiresIn: '30d' });

        savedUser.tokens.token = token;
        savedUser.tokens.refreshToken = refreshToken;
        savedUser.tokens.createdAt = new Date();
        await savedUser.save();

        res
        .status(201)
        .header('auth-token', token)
        .send({
            error: false,
            message: "L'utilisateur a bien été créé avec succès",
            tokens: {
                token: savedUser.tokens.token,
                refreshToken: savedUser.tokens.refreshToken,
                createdAt: savedUser.tokens.createdAt
            }
        });
    } catch (e) {
        res.status(400).send(e);
    }
})


//LOGIN
router.post('/login', async (req, res) => {
    //Validate data
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send({
        error: true,
        message: error.details[0].message
    });

    //Check if the email exists
    const user = await User.findOne({email: req.body.email});
    const error401 = { error: true, message: "Votre email ou password est erronné"}; 
    if(!user) return res.status(401).send(error401);
    //check if the password is correct
    const validPass = await  bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(401).send(error401);

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '30d' });

    user.tokens = {
        token,
        refreshToken,
        createdAt: new Date()
    }
    try {
        await user.save()
        res
        .status(200)
        .header('auth-token', token)
        .send({
            error: false,
            message: "L'utilisateur a été authentifié avec succès",
            tokens: {
                token: user.tokens.token,
                refreshToken: user.tokens.refreshToken,
                createdAt: user.tokens.createdAt
            }
        });

    } catch (e) {
        res.status(400).send(e);
    }
})

//LOGOUT
router.delete('/logout', tokenGuard, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    user.tokens = {
        token: '',
        refreshToken: '',
        createdAt: null
    }
    
    try {
        await user.save();
        res.status(200).send({
            error: false,
            message: "L'utilisateur a été déconnecté avec succès"
        });
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;