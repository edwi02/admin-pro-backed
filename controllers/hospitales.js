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

const updHospitales = (req, res = response ) => {

    res.json({
        ok: true,
        msg: 'updHospitales'
    }) 
}

const delHospitales = (req, res = response ) => {

    res.json({
        ok: true,
        msg: 'delHospitales'
    }) 
}

module.exports = {
    getHospitales,
    addHospitales,
    updHospitales,
    delHospitales
}