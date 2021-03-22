/**
 * Ruta /api/medicos
 */


 const { Router } = require('express');
 const { check } = require('express-validator');
 
 const { getMedicos, addMedico, updMedico, delMedico } = require('../controllers/medicos');
 
 const { validarCampos } = require('../middlewares/validar-campos');
 const { validarJWT } = require('../middlewares/validat-jwt');
 
 
 const router = Router();
 
 
 router.get( '/', validarJWT, getMedicos );
 
 router.post( '/', 
     [
        validarJWT,
        check('nombre').notEmpty().withMessage('El nombre es requerido'),
        check('hospital').notEmpty().withMessage('El hospital es requerido')
                        .isMongoId().withMessage('El hospital id debe ser válido'),
        validarCampos
     ],
     addMedico );
 
 router.put( '/:id' , 
     [] ,
     updMedico);
 
 router.delete( '/:id', 
     validarJWT,
     delMedico)
 
 module.exports = router;