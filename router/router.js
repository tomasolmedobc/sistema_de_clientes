const express = require('express');
const router = express.Router();

router.get('/tabla', (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
    } else {
        next();
    }
}, (req, res) => {
    res.render('tabla');
});

module.exports = router;
