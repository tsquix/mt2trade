export async function connectMongoDB() {
  const { MongoClient } = require("mongodb");
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Dodaj MONGODB_URI do .env");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Połączono z MongoDB");
    return client;
  } catch (error) {
    console.error("Błąd połączenia z MongoDB:", error);
    throw error;
  }
}

export default connectMongoDB;
