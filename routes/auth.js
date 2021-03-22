/* 
    Ruta: /api/login
*/

const { Router }  = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renewToken } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validat-jwt');

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

router.get( '/renew',
            validarJWT,
            renewToken );

module.exports = router;
