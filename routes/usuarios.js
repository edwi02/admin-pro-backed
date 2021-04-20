/*
    Ruta: /api/usuarios 
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, 
        validarADMIN_ROLE,
        validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validat-jwt');

const { getUsuarios, addUsuario, updUsuario, delUsuario } = require('../controllers/usuarios');

const router = Router();


router.get( '/', validarJWT, getUsuarios );

router.post( '/', 
    [
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
        validarADMIN_ROLE_o_MismoUsuario,
        check('nombre', 'El nombre es requerido').notEmpty() ,
        check('email').notEmpty().withMessage('Falta el correo')
                      .isEmail().withMessage('El correo no es valido'),
        check('role').notEmpty().withMessage('Falta el role'),
        validarCampos
    ] ,
    updUsuario);

router.delete( '/:id', 
    [validarJWT, validarADMIN_ROLE],
    delUsuario)

module.exports = router;