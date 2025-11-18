import mongoose from "mongoose";

export const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('✅ Conectado a mongoDB');
  } catch (err) {
    console.log('❌ Error al conectar a mongoDB:', err);
    throw err;
  }
};

export default connectDB;