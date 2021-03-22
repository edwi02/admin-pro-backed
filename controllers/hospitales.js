const { response } = require("express");


const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response ) => {

    try {

        const hospitales = await Hospital.find()
                                        .populate('usuario', 'nombre img');
        res.json({
            ok: true,
            hospitales
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Buscar Hospital. Informar al adminstrador.'
        })
    }
    
}

const addHospitales = async( req, res = response ) => {

    const uid = req.uid;
    const hospital = new Hospital( {
        usuario: uid,
        ...req.body
    });

    try {
        
        const hospitalDB = await hospital.save();
    
        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Crear Hospital. Informe al administrador'
        })
    }

}

const updHospitales = async(req, res = response ) => {

    const uid = req.uid;
    const id  = req.params.id;

    try {

        const hospital = await Hospital.findById( id );

        if ( !hospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }

        const campos = { 
            ...req.body,
            usuario: uid 
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, campos, { new: true } );

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });
        
    } catch (error) {
        console.log(error);   
        return res.status(500).json({
            ok: false, 
            msg: 'updHospitales. Informar al administrador'
        })
    }

}

const delHospitales = async(req, res = response ) => {

    const id = req.params.id;

    try {
     
        const hospital = await Hospital.findById( id );

        if ( !hospital ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }

        const hospitalActualizado = await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'delHospotales. Informar al administrador'
        });
    }
}

module.exports = {
    getHospitales,
    addHospitales,
    updHospitales,
    delHospitales
}