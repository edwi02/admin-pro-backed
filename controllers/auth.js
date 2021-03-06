const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

// Helpers
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async(req, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });
        
        // Verificar email
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false, 
                msg: 'Email/Password no son validos'
            });
        }


        // Verificar contraseña
        const validPassword  = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Email/Password no son validos'
            })
        }

        // Generar el token
        const token = await generarJWT( usuarioDB.id );
        
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuarioDB.role )
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Error: 15 - Conversar con el adminsitrador'
        })
    }
}

const googleSignIn = async( req, res = response ) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        
        // Si no existe el usuario
        if ( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = '@';
        }

        // Guardar en DB
        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: false,
            token,
            menu: getMenuFrontEnd( usuario.role )
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false, 
            msg: 'googleSignIn. Token no es correcto'
        })
    }
}


const renewToken = async (req, res = response ) => {

    const uid = req.uid;
    // console.log('ingresa',req);
    console.log('UID',uid);

    const usuarioDB = await Usuario.findById( uid );

    if ( !usuarioDB ) {
        return res.status(404).json({
            ok: false, 
            msg: 'Usuario no existe'
        });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    res.json({
        ok: true,
        usuario: usuarioDB,
        token,
        menu: getMenuFrontEnd( usuarioDB.role )
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}