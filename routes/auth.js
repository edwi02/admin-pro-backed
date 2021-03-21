/* 
    Ruta: /api/login
*/

const { Router }  = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/', 
    [
        check('password').not().isEmpty().withMessage('Falta la contraseña'),
        check('email').notEmpty().withMessage('Falta el correo')
                      .isEmail().withMessage('El correo no es valido'),
        validarCampos
    ], login);

module.exports = router;