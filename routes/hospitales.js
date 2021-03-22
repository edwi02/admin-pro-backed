/*
    Ruta: /api/hospitales
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { getHospitales, addHospitales, updHospitales, delHospitales } = require('../controllers/hospitales');

const { validarJWT } = require('../middlewares/validat-jwt');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();


router.get( '/', validarJWT, getHospitales );

router.post( '/', 
    [
        validarJWT,
        check('nombre').notEmpty().withMessage('El nombre es requerido'),
        validarCampos
    ],
    addHospitales );

router.put( '/:id' , 
    [] ,
    updHospitales);

router.delete( '/:id', 
    validarJWT,
    delHospitales)

module.exports = router;