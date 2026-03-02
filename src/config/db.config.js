import mongoose from 'mongoose';

const connectToDB = async () => {
  try {
    const connectionString = process.env.MONGO_URL || 'mongodb://localhost:27017/coderBackend2';

    await mongoose.connect(connectionString, {
      // Estas opciones ya no son obligatorias en mongoose >= 6.0, pero no duelen
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log('MongoDB conectado correctamente ✅');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1); // termina la app si falla la conexión (buena práctica en producción)
  }
};

export default connectToDB;
