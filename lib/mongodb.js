// Pierwsza wersja jest dobra do prostych skryptów Node.js uruchamianych jednorazowo.
// Druga wersja jest lepsza w aplikacjach Next.js / serverless, ponieważ zapobiega wielokrotnemu łączeniu z bazą MongoDB i zwiększa wydajność.

export async function connectToMongoDB() {
  const { MongoClient } = require('mongodb');
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Dodaj MONGODB_URI do .env');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Połączono z MongoDB');
    return client;
  } catch (error) {
    console.error('Błąd połączenia z MongoDB:', error);
    throw error;
  }
}

// // export default connectMongoDB;
// import { MongoClient } from 'mongodb';

// const uri = process.env.MONGODB_URI;
// if (!uri) {
//   throw new Error('Dodaj MONGODB_URI do .env');
// }

// let client;
// let clientPromise;

// if (!global._mongoClientPromise) {
//   client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   global._mongoClientPromise = client.connect();
// }

// clientPromise = global._mongoClientPromise;

// export async function connectMongoDB() {
//   return clientPromise;
// }

// export default connectMongoDB;
