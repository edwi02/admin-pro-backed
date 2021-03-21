require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() );

// Lectura y parseo del Body
app.use( express.json() );


// Base de datos
dbConnection();

// Rutas
// const { router } = require('./routes/usuarios');
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/auth', require('./routes/auth') );


app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});