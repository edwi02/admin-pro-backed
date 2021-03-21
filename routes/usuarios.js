/*
    Ruta: /api/usuarios 
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validat-jwt');

const { getUsuarios, addUsuario, updUsuario, delUsuario } = require('../controllers/usuarios');

const router = Router();


router.get( '/', validarJWT, getUsuarios );

router.post( '/', 
    [
        validarJWT,
        check('nombre', 'El nombre es requerido').notEmpty() ,
        check('password').not().isEmpty().withMessage('Falta la contraseña'),
        check('email').notEmpty().withMessage('Falta el correo')
                      .isEmail().withMessage('El correo no es valido'),
        validarCampos
    ],
    addUsuario );

router.put( '/:id' , 
    [
        validarJWT,
        check('nombre', 'El nombre es requerido').notEmpty() ,
        check('email').notEmpty().withMessage('Falta el correo')
                      .isEmail().withMessage('El correo no es valido'),
        check('role').notEmpty().withMessage('Falta el role'),
        validarCampos
    ] ,
    updUsuario);

router.delete( '/:id', 
    validarJWT,
    delUsuario)

module.exports = router;