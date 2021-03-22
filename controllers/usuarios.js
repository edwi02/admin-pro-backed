const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;

    // const usuarios = await Usuario
    //                     .find({}, 'nombre email role google')
    //                     .skip( desde )
    //                     .limit( limite );

    // const total = await Usuario.count();

    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit( limite ),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true, 
        usuarios,
        uid: req.uid,
        total
    })
};

const addUsuario = async(req, res = response) => {

    const { nombre, email, password } = req.body;
    
    try {

        const existeEmail = await Usuario.findOne( { email });

        if( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }


        const usuario = new Usuario( req.body );

        // Cifrar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password , salt );
        
        await usuario.save();

        const token = await generarJWT( usuario.id );

        res.json({
            ok: true, 
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Error inesperado... rvevisar logs'
        });
    }

};

const updUsuario = async(req, res = response) => {


    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            res.status(400).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizar
        const { password, google, email, ... campos} = req.body;

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne( { email });
            if( ( existeEmail) ) {
                return res.status(400).json({
                    of: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Error inesperado'
        })
    }
};

const delUsuario = async( req, res = response) => {

    try {
        const uid = req.params.id;

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            res.status(400).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true, 
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Problema al borrar el usuario'
        })
    }
}


module.exports = {
    getUsuarios,
    addUsuario,
    updUsuario,
    delUsuario
}