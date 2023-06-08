const express = require('express');
const { MongoClient } = require('mongodb');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI || 'mongodb+srv://cristianflo7:Zhongkui24@atlascluster.lxduy2m.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

app.set('view engine', 'ejs');

// Ruta para mostrar la lista de comics
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

// Ruta para obtener la dirección IP de la aplicación en Render
app.get('/app-ip', (req, res) => {
  const appIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.send(`App IP: ${appIp}`);
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
