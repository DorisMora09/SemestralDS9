require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let dbInstance = null;

async function conect() {
    if (!dbInstance) {
        await client.connect();
        dbInstance = client.db(process.env.DB_NAME);
        console.log("✅ Conectado a MongoDB");
    }
    return dbInstance;
}

async function getCollection(nombre) {
    const db = await conect();
    return db.collection(nombre);
}

module.exports = { getCollection };
