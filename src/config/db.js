import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conexión a MongoDB exitosa");
    } catch (error) {
        console.error("Error conectando a MongoDB", error);
        process.exit(1); // Detener la aplicación si hay un error de conexión
    }
};

export default connectDB;

