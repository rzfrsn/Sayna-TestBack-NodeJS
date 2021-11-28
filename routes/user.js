const router = require('express').Router();
const User = require('../models/User');
const tokenGuard = require('./tokenGuard');
const bcrypt = require('bcryptjs');

//get all users
router.get('/users', tokenGuard, (req, res) => {
    User.find({}, (e, users) => {
        if(e) return res.status(400).send(e.message);
        res.status(200).send({
            error: false,
            users
        });
    }).select({
        _id: 0,
        password: 0,
        createdAt: 0,
        __v: 0
    });    
});

//get user profile
router.get('/user', tokenGuard, (req, res) => {
    const userId = req.user._id;
    User.findById(userId, (e, user) => {
        if(e) return res.status(400).send(e.message);
        res.status(200).send(user)
    }).select({
        _id: 0,
        password: 0,
        __v: 0
    });
});

//set user profile
router.put('/user', tokenGuard, async (req, res) => {
    const userId = req.user._id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const birthday = req.body.birthday;
    const gender = req.body.gender;

    if(!firstname && !lastname && !birthday && !gender) return res.status(401).send({
        error: true,
        message: "Aucune donnée n'a été envoyée"
    });

    const user = await User.findById(userId);
    if(firstname) user.firstname = firstname;
    if(lastname) user.lastname = lastname;
    if(birthday) user.birthday = birthday;
    if(gender) user.gender = gender;

    try {
        const updatedUser = await user.save();
        res.status(200).send({
            error: false,
            message: "L'utilisateur a été modifié avec succès"
        })
    } catch (e) {
        res.status(400).send(e);
    }
})

//set user password
router.put('/user/password', tokenGuard, async (req, res) => {
    const userId = req.user._id;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    
    if(newPassword.length < 6) return res.status(400).send({
        error: true,
        message: "La longueur du mot de passe doit être >= 6"
    })

    const user = await User.findById(userId);
    //check if the old password is correct
    const validPass = await  bcrypt.compare(currentPassword, user.password);
    if(!validPass) return res.status(401).send({error: true, message: "Mot de passe eronné"});

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedNewPassword;
    try {
        await user.save();
        res.status(200).send({
            error: false,
            message: "Mot de passe changé avec succès"
        })
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;