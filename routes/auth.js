/* 
    Ruta: /api/login
*/

const { Router }  = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/', 
    [
        check('password').not().isEmpty().withMessage('Falta la contraseña'),
        check('email').notEmpty().withMessage('Falta el correo')
                      .isEmail().withMessage('El correo no es valido'),
        validarCampos
    ], login
);

router.post( '/google', 
    [
        check('token').not().isEmpty().withMessage('Falta el Token'),
        validarCampos
    ], googleSignIn
);

module.exports = router;
