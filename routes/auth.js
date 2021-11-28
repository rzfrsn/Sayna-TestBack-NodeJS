const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        //Create and assign a token
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET, { expiresIn: '1y' });
        res
        .status(201)
        .header('auth-token', token)
        .send({
            error: false,
            message: "L'utilisateur a bien été créé avec succès",
            token,
            refreshToken,
            createdAt: new Date()
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
    const refreshToken = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '1y' });
    res
        .status(200)
        .header('auth-token', token)
        .send({
            error: false,
            message: "L'utilisateur a été authentifié avec succès",
            token,
            refreshToken,
            createdAt: new Date()
        });
})

module.exports = router;