const { response } = require("express");

const Medico = require('../models/medico');
const Hospital = require("../models/hospital");

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

const updMedico = async(req, res = response ) => {

    const uid = req.uid;
    const id = req.params.id;

    try {
    
        const medico = await Medico.findById( id );
        if( !medico ) {
            return res.status(400).json({
                ok: false, 
                msg: "No existe médico con el id"
            });
        }

        const campos = {
            ...req.body,
            usuario: uid
        };

        const hospital = await Hospital.findById( campos.hospital );
        if( !hospital ) {
            return res.status(400).json({
                ok: false, 
                msg: "No existe hospital con el id"
            });
        }


        const medicoActualizado = await Medico.findByIdAndUpdate( id, campos, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: "updMedico. Informar al administrador"
        })
    }
    
}

const delMedico = async(req, res = response ) => {

    const id = req.params.id;


    try {
        const medico = await Medico.findById( id );
        if( !medico ) {
            return res.status(400).json({
                ok: false, 
                msg: "No existe médico con el id"
            });
        }

        const medicoBorrado = await Medico.findByIdAndDelete( id );
        // console.log(medicoBorrado);
        
        res.json({
            ok: true,
            msg: 'Médico borrado'
        });
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "delMedico. Informar al administrador"
        })
    }

}

module.exports = {
    getMedicos,
    addMedico,
    updMedico,
    delMedico
}