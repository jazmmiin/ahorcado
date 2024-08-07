//server.js
//conexion con la base de datos.
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configura la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'tu_usuario',
    password: 'tu_contraseña',
    database: 'nombre_de_tu_base_de_datos'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Ruta para guardar la puntuación
app.post('/guardar-puntuacion', (req, res) => {
    const { nombre, puntuacion, tiempo } = req.body;
    const fecha = new Date();

    const query = 'INSERT INTO puntuaciones (nombre, puntuacion, tiempo, fecha) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, puntuacion, tiempo, fecha], (err, result) => {
        if (err) {
            console.error('Error al guardar la puntuación:', err);
            res.status(500).send('Error al guardar la puntuación');
            return;
        }
        res.send('Puntuación guardada exitosamente');
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
