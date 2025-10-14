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
            images: ["assets/img7.png"], brand: "New Era", color: "Azul/Amarillo",
            category: categoryMap['NBA']
        },
        {
            name: "Club America", price: 799, stock: 25,
            description: "Gorra de el Club America Liga MX, Presenta escudo del Club America bordado en los paneles frontales.",
            images: ["assets/img13.png"], brand: "New Era", color: "Amarillo",
            category: categoryMap['Liga MX']
        },
        {
            name: "Red Bull", price: 799, stock: 12,
            description: "Gorra de Red Bull, Presenta el logotipo de Red Bull bordado en los paneles frontales.",
            images: ["assets/img16.png"], brand: "New Era", color: "Azul Marino",
            category: categoryMap['F1']
        },
      {
          name:"Los Angeles Dodgers",price:799, stock:5,
          description:"Gorra de los Angeles Dodgers MLB, presenta el logotipo de los Dodgers bordado en los paneles frontales.",
          images:["assets/img3.png"],brand: "New Era", color: "Gris/Azul",
          category: categoryMap['MLB']
      },
      {
          name:"New York Yankees",price:1099, stock:2,
          description:"Gorra de los New York Yankees MLB, presenta el logotipo de los Yankees bordado en los paneles frontales.",
          images:["assets/img4.png"],brand:"New Era",color:"Gris",
          category: categoryMap['MLB']
      },
      {
          name:"San Diego Padres",price:799, stock:20,
          description:"Gorra de los San Diego Padres MLB, presenta el logitpo de los Padres bordado en los paneles frontales.",
          images:["assets/img5.png"],brand:"New Era", color:"Cafe",
          category: categoryMap['MLB']
      },
      {
          name:"San Francisco Gigants",price:799,stock:20,
          description:"Gorra de los San Francisco Gigants MLB, Presenta el logotipo de los Giants bordado en los paneles frontales.",
          images:["assets/img6.png"],brand:"New Era", color:"Naranja",
          category: categoryMap['MLB']
      },
      {
          name:"Boston Celtics",price:1299,stock:20,
          description:"Gorra plana de Boton Celtics, Presenta el logotipo de los Celtics bordado y con flores bordadas en la corona.",
          images:["assets/img8.png"],brand:"New Era",color:"Beige/Naranja",
          category: categoryMap['NBA']
      },
      {
          name:"Los Angeles Lakers",price:79,stock:20,
          description:"Gorra de los angeles Lakers NBA, Presenta el logotipo de los Lakers bordado en los paneles frontales.",
          images:["assets/img9.png"], brand:"New Era", color:"Negro",
          category: categoryMap['NBA']
      },
      {
          name:"Charros de Jalisco",price:799,stock:20,
          description:"Gorra de los Charros de Jalisco LMB, Presenta el logotipo de los Charros de Jalisco bordado en los paneles frontales.",
          images:["assets/img10.png"],brand:"New Era", color:"Azul",
          category: categoryMap['LMB']
      },
      {
          name:"Diablos Rojos de México",price:799,stock:20,
          description:"Gorra de los Diablos Rojos de México LMB, Presenta el logotipo de los Diablos Rojos de México bordado en los paneles frontales.",
          images:["assets/img11.png"],brand:"New Era",color:"Rojo",
          category: categoryMap['LMB']
      },
      {
          name:"Rieleros de Aguascalientes",price:799,stock:5,
          description:"Gorra de los Rieleros de Aguascalientes LMB, Presenta el logotipo de los Rieleros de Aguascalientes bordado en los paneles frontales.",
          images:["assets/img12.png"],brand:"New Era", color:"Negro",
          category: categoryMap['LMB']
      },
      {
          name:"Club Chivas",price:799,stock:1,
          description:"Gorra de el Club Chivas Liga MX, Presenta escudo del Club Chivas bordado en los paneles frontales.",
          images:["assets/img14.png"],brand:"New Era",color:"Azul",
          category: categoryMap['Liga MX']
      },
      {
        name:"Club Cruz Azul",
        price:799,stock:5,
        description:"Gorra de el Club Cruz Azul Liga MX, Presenta escudo del Club Cruz Azul bordado en los paneles frontales.",
        images:["assets/img15.png"], brand:"New Era", color:"Azul",
        category: categoryMap['Liga MX']
      },
      {
         name:"Mclaren",
        price:799,stock:20,
        description:"Gorra de Mclaren, Presenta el logotipo de Mclaren bordado en los paneles frontales.",
        images:["assets/img17.png"],brand:"New Era", color:"Naranja",
        category: categoryMap['F1']
      },
      {
        name:"Pittsburgh Pirates",
        price:599,stock:20,
        description:"Gorra de los Pittsburgh Pirates MLB, Presenta el logotipo de los Pirates bordado en los paneles frontales.",
        images:["assets/img18.png"], brand:"New Era", color:"Negro",
        category: categoryMap['MLB']
      },
      {
       name:"Boston Red Sox",
        price:799,stock:20,
        description:"Gorra de los Boston Red Sox MLB, Presenta el logotipo de los Red Sox bordado en los paneles frontales.",
        images:["assets/img19.png"],brand:"New Era",color:"Negro",
        category: categoryMap['MLB']
      },
      {
         name:"San Francisco 49Ers",
        price:799,stock:20,
        description:"Gorra de los San Francisco 49Ers NFL, Presenta el logotipo de los 49Ers bordado en los paneles frontales.",
        images:["assets/img20.png"],brand:"New Era", color:"Beige/Rojo",
        category: categoryMap['NFL']
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
