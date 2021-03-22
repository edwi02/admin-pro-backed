const { response } = require("express");

const Medico = require('../models/medico');

const getMedicos = async ( req, res = response ) => {

    try {

        const medicos = await Medico.find()
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre');
        res.json({
            ok: true,
            medicos
        });    

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Obtener Medicos. Informar al administrador'
        })
    }
    
}

const addMedico = async( req, res = response ) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();
        
        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Crear médico. Informar al administrador'
        })
    }
    

}

const updMedico = (req, res = response ) => {

    res.json({
        ok: true,
        msg: 'updMedico'
    }) 
}

const delMedico = (req, res = response ) => {

    res.json({
        ok: true,
        msg: 'delMedico'
    }) 
}

module.exports = {
    getMedicos,
    addMedico,
    updMedico,
    delMedico
}