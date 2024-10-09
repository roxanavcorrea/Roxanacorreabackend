import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
        description: "Nombre del producto.",
        example: "Cámara DSLR Canon EOS 90D"
    },
    description: {
        type: String,
        required: true, 
        description: "Descripción detallada del producto.",
        example: "Cámara digital con sensor APS-C y resolución de 32.5 megapíxeles."
    },
    code: {
        type: String,
        required: true, 
        unique: true,   
        description: "Un código único para identificar el producto",
        example: "CAN-90D-2024"
    },
    price: {
        type: Number,
        required: true, 
        min: 0,         
        description: "Precio del producto.",
        example: 1299.99
    },
    stock: {
        type: Number,
        required: true, 
        min: 0,      
        description: "Cantidad disponible en inventario.",
        example: 50
    },
    category: {
        type: String,
        required: true, 
        description: "Categoría a la que pertenece el producto.",
        example: "Cámaras" 
    },
    thumbnails: {
        type: [String], 
        default: [],    
        description: "Array de URLs que apuntan a imágenes del producto.",
        example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"]
    },
    status: {
        type: Boolean,
        default: true,  
        description: "Indica si el producto está disponible para la venta.",
        example: true 
    },
});



const Product = mongoose.model('Product', productSchema);

export default Product;


