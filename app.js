const express = require('express');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;

// Conecta con la base de datos MongoDB
const uri = process.env.MONGODB_URI; // La URL de conexión a MongoDB se configurará en Render
const client = new MongoClient(uri);

app.set('view engine', 'ejs');

// Ruta para mostrar la lista de cómics
app.get('/', async (req, res) => {
  try {
    await client.connect();

    const db = client.db(); // No es necesario especificar el nombre de la base de datos
    const comicsCollection = db.collection('comics'); // Nombre de la colección

    // Consulta los registros de cómics ordenados alfabéticamente por título
    const comics = await comicsCollection.find().sort({ title: 1 }).toArray();

    res.render('index', { comics });
  } catch (error) {
    console.error('Ha ocurrido un error:', error);
    res.status(500).send('Error al obtener los datos de la base de datos.');
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
