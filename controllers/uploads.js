const path = require('path');
const fs   = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = ( req, res = response)=> {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    // Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if( !tiposValidos.includes(tipo) ) {
        return res.status(400).json({
            ok: false, 
            msg: 'No es un médico, usuario y hospital'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    
    try {

        // Procesar la imagen
        const file = req.files.imagen;
        const nombreCortado = file.name.split('.');
        const extesionArchivo = nombreCortado[ nombreCortado.length - 1];
    
        // Validar extensión
        const extensionesValida = [ 'png', 'jpg', 'jpeg', 'gif' ];
        if ( !extensionesValida.includes(extesionArchivo) ) {
            return res.status(400).json({
                ok: false,
                msg: 'No es una extensión permitida'
            });
        }
    
        // Generar el nombre del archivo
        const nombreArchivo = `${ uuidv4() }.${ extesionArchivo }`;
    
        // Path para guardar la imagen
        const path = `./uploads/${ tipo }/${ nombreArchivo }`;
    
        // Mover la imagen
        file.mv( path, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover la imagen'
                });
            }

            // Actualizar base de datos
            actualizarImagen(tipo, id,  nombreArchivo);
    
            res.json({
                ok: true,
                msg: 'Archivo subido',
                nombreArchivo
            });
        
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'fileUpload. Informa al administrador'
        })
    }
}

const retonarImagen = ( req, res = response) => {
    
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    try {

        const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );    

        // Imagen por defecto
        if ( fs.existsSync(pathImg) ) {
            console.log('Existe la imagen!!');
            res.sendFile( pathImg );
        } else {
            console.log('Imagen no encontrada');
            const pathImg = path.join( __dirname, `../uploads/not-available.jpg` );    
            res.sendFile( pathImg );
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false, 
            msg: 'Retornar Imagen. Informar al administrador'
        })
    }

}

module.exports = {
    fileUpload,
    retonarImagen
}