/*
    Ruta: /api/uploads
*/

const { Router } = require('express');
const { check }  = require('express-validator');
const expressFileUpload = require('express-fileupload');

const { fileUpload, retonarImagen } = require('../controllers/uploads');

const { validarJWT } = require('../middlewares/validat-jwt');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.use( expressFileUpload() );

router.put( '/:tipo/:id', validarJWT, fileUpload );

router.get( '/:tipo/:foto', retonarImagen );

module.exports = router;