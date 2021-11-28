const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports =  async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send({
        error: true,
        message: "Le token envoyer n'existe pas ou n'est pas conforme"
    });

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        const user = await User.findById(req.user._id);
        if(user.tokens.token == '') throw "Le token n'existe pas"
        next();
    }catch(e){
        res.status(401).send(e);
    }
}