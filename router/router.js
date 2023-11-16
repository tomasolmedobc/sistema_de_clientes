const express = require('express');
const router = express.Router();

// Esta ruta se encarga de verificar la autenticación antes de mostrar la tabla
router.get('/tabla', (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
    } else {
        next();
    }
}, (req, res) => {
    // Aquí iría el código para renderizar la vista 'tabla'
    res.render('tabla');
});

module.exports = router;
