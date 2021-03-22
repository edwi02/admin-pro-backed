/*
    Ruta: /api/busqueda
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { getTodo, getDocumentosCollecion } = require('../controllers/busquedas');

const { validarJWT } = require('../middlewares/validat-jwt');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();


router.get( '/:busqueda', validarJWT, getTodo );

router.get( '/coleccion/:tabla/:busqueda', validarJWT, getDocumentosCollecion );

module.exports = router;