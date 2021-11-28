const router = require('express').Router();
const path = require('path');

//DEFAULT PAGE
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/index.html'));
})

module.exports = router;