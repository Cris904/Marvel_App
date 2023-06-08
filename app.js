const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ejs = require('ejs');

// Conecta con la base de datos MongoDB
const uri = 'mongodb+srv://cristianflo7:Zhongkui24@atlascluster.lxduy2m.mongodb.net/?retryWrites=true&w=majority'; // URI de conexión de MongoDB, modificar según la configuración
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.set('view engine', 'ejs');

// Ruta para mostrar la lista de comics
app.get('/', async (req, res) => {
  try {
    await client.connect();

    const db = client.db('marvel'); // Nombre de la base de datos
    const comicsCollection = db.collection('comics'); // Nombre de la colección

    // Consulta los registros de comics ordenados alfabéticamente por título
    const comics = await comicsCollection.find().sort({ title: 1 }).toArray();

    res.render('index', { comics });
  } catch (error) {
    console.error('Ha ocurrido un error:', error);
    res.status(500).send('Error al obtener los datos de la base de datos.');
  } finally {
    await client.close();
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
