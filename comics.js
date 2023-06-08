const axios = require('axios');
const { MongoClient } = require('mongodb');

async function getDataAndSaveToMongoDB() {
  try {
    // Realiza la solicitud a la API de Marvel
    const ts = 1;
    const private_key = '90109acfcbf8e95ed83855ccfdc3537227a64757';
    const public_key = '42c8bab782fd9cce43750fcedbf0ea84';
    const hashed = 'e0c2665973311914ddabd2b51421778a';

    const url = `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${public_key}&hash=${hashed}`;

    const response = await axios.get(url);
    const data = response.data.data.results;

    // Conecta con la base de datos MongoDB
    const uri = 'mongodb+srv://cristianflo7:Zhongkui24@atlascluster.lxduy2m.mongodb.net/?retryWrites=true&w=majority'; // URI de conexión de MongoDB, modificar según la configuración
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db('marvel'); // Nombre de la base de datos
    const comicsCollection = db.collection('comics'); // Nombre de la colección

    // Guarda los datos en la colección "comics"
    await comicsCollection.insertMany(data);

    // Cierra la conexión con la base de datos
    await client.close();

    console.log('Los datos se han guardado en la base de datos MongoDB correctamente.');
  } catch (error) {
    console.error('Ha ocurrido un error:', error);
  }
}

// Ejecuta la función principal
getDataAndSaveToMongoDB();
