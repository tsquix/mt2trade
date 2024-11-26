import mongoose from "mongoose";

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Dodaj MONGODB_URI do .env");
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
      });
    }
    console.log("Połączono z MongoDB");
  } catch (error) {
    console.error("Błąd połączenia:", error);
    throw error;
  }
}

export default connectMongoDB;
