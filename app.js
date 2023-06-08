const express = require('express');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI; // La URL de conexión de MongoDB se configurará en Render
const client = new MongoClient(uri);

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    await client.connect();

    const db = client.db('marvel');
    const comicsCollection = db.collection('comics');

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
