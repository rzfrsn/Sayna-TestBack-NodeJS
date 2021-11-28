const router = require('express').Router();
const User = require('../models/User');
const tokenGuard = require('./tokenGuard');

//get all users
router.get('/users', tokenGuard, (req, res) => {
    User.find({}, (e, users) => {
        if(e) return res.status(400).send(e.message);
        res.status(200).send(users);
    });
    
});

module.exports = router;