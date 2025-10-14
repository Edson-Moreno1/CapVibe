const mongoose = require('mongoose');

// Importamos AMBOS modelos, porque los necesitamos a los dos.
const Product = require('./models/product.js'); // Asegúrate que la ruta sea correcta
const Category = require('./models/category.js'); // Asegúrate que la ruta sea correcta

// ¡MUY IMPORTANTE! Reemplaza esta URL con la URL de conexión a TU base de datos.
const dbUrl = 'mongodb://localhost:27017/tuBaseDeDatos';

mongoose.connect(dbUrl)
  .then(() => {
    console.log("✅ ¡Conexión a la base de datos establecida para el seeder!");
    seedDB(); // Llamamos a la función principal después de conectar
  })
  .catch(err => {
    console.error("❌ ERROR de conexión a la base de datos:", err);
  });

const seedDB = async () => {
  try {
    // --- FASE 1: BORRAR Y CREAR CATEGORÍAS ---
    console.log('🗑️  Borrando datos antiguos...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('🌱 Creando nuevas categorías...');
    const categories = [
      { name: 'MLB', description: 'Gorras de las Ligas Mayores de Béisbol.' },
      { name: 'NBA', description: 'Gorras de la Asociación Nacional de Baloncesto.' },
      { name: 'LMB', description: 'Gorras de la Liga Mexicana de Béisbol.' },
      { name: 'Liga MX', description: 'Gorras de la primera división de fútbol mexicano.' },
      { name: 'F1', description: 'Gorras de las escuderías de Fórmula 1.' },
      { name: 'NFL', description: 'Gorras de la Liga Nacional de Fútbol Americano.' }
    ];
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Categorías creadas con éxito.');

    // Creamos un mapa para encontrar fácilmente el ID de cada categoría por su nombre
    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});


    // --- FASE 2: ENRIQUECER Y CREAR PRODUCTOS ---
    console.log('🌱 Creando nuevos productos...');
    
    // Tomamos tu lista y la enriquecemos con los campos que faltan
    const productsToCreate = [
        {
            name: "Colorado Rockies", price: 799, stock: 15,
            description: "Gorra de los Colorado Rockies MLB, Presenta el logotipo de los Rockies con un detalle floral bordado en los paneles frontales.",
            images: ["assets/img1.png"], brand: "New Era", color: "Negro",
            category: categoryMap['MLB'] // Asignamos el ID de la categoría correcta
        },
        {
            name: "Chicago Cubs", price: 799, stock: 20,
            description: "Gorra de los Chicago Cubs MLB, Presenta el logotipo de los Cubs bordado en los paneles frontales.",
            images: ["assets/img2.png"], brand: "New Era", color: "Azul",
            category: categoryMap['MLB']
        },
        {
            name: "Golden state Warriors", price: 899, stock: 10,
            description: "Gorra de los Golden state Warrios NBA, Presenta el logotipo de los Warrios bordado en los paneles frontales.",
            images: ["assets/img7.png"], brand: "Mitchell & Ness", color: "Azul/Amarillo",
            category: categoryMap['NBA']
        },
        {
            name: "Club America", price: 799, stock: 25,
            description: "Gorra de el Club America Liga MX, Presenta escudo del Club America bordado en los paneles frontales.",
            images: ["assets/img13.png"], brand: "Nike", color: "Amarillo",
            category: categoryMap['Liga MX']
        },
        {
            name: "Red Bull", price: 799, stock: 12,
            description: "Gorra de Red Bull, Presenta el logotipo de Red Bull bordado en los paneles frontales.",
            images: ["assets/img16.png"], brand: "Puma", color: "Azul Marino",
            category: categoryMap['F1']
        }
        // ... Puedes seguir añadiendo el resto de tus productos aquí, ya enriquecidos ...
    ];

    await Product.insertMany(productsToCreate);
    console.log('✅ Productos creados con éxito.');

  } catch (error) {
    console.error('❌ Error durante el proceso de siembra:', error);
  } finally {
    // Cerramos la conexión al final, tanto si hubo éxito como si hubo error
    console.log('🏁 Seeder finalizado. Cerrando conexión.');
    mongoose.connection.close();
  }
};