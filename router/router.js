const express = require('express');
const router = express.Router();

// Esta ruta renderiza la vista 'tabla'
router.get('/tabla', (req, res) => {
    res.render('tabla');
});

// Esta ruta se encarga de verificar la autenticación antes de mostrar la tabla
router.get('/tabla', (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
    } else {
        next();
    }
});

module.exports = router;
