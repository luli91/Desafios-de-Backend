//Clases con ECMAScript y ECMAScript avanzado- Primer Desafio
//Consigna

// Realizar una clase “ProductManager” que gestione un conjunto de productos.

// Aspectos a incluir

// Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.
// Cada producto que gestione debe contar con las propiedades:
// title (nombre del producto)
// description (descripción del producto)
// price (precio)
// thumbnail (ruta de imagen)
// code (código identificador)
// stock (número de piezas disponibles)
// Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
// Validar que no se repita el campo “code” y que todos los campos sean obligatorios. Método de array some () o find ()
// Al agregarlo, debe crearse con un id autoincrementable
// Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos los productos creados hasta ese momento
// Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida con el id
// En caso de no coincidir ningún id, mostrar en consola un error “Not found”




// la clase ProductManager se encarga de gestionar todos estos productos como si fuese el almacen

class ProductManager{
    constructor () {
        this.products = [];
        this.currentId = 1;
    }

    addProduct(product) {
        // // Verifico que todos los campos del producto estén definidos
        // if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        //     console.error("Todos los campos son obligatorios");
        //     return;
        // }
        // Una forma de evitar repetir la palabra product en cada validación de la linea 36 es utilizando la desestructuración de objetos de javascript
        // Desestructuramos el producto
        const { title, description, price, thumbnail, code, stock } = product;

        // Verifico que todos los campos del producto estén definidos sin repetir la palabra product
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }
        // Verifico que el código no se repita
        //some es un método de Array que recorre cada elemento del array this.products y aplica una función a él. Esta función toma un producto existente como argumento y verifica si su código coincide con el código del producto que estamos intentando agregar (product.code). Si los códigos coinciden, la función devuelve true con el error "El código del producto ya existe"; si no coinciden, devuelve false.
        if (this.products.some(existingProduct => existingProduct.code === product.code)) {
            console.error("El código del producto ya existe");
            return;
        }

        // Asigno un id al producto y lo agrego al arreglo
        product.id = this.currentId++;
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        //Recorro el arreglo products y devuelvo el producto que tenga el id especificado
        for (let product of this.products) {
            if (product.id === id) {
                return product;
            }
        }
        console.error("Producto no encontrado");
    }
}
//La clase Product representa un producto individual con sus propias propiedades
class Product{
    constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail= thumbnail;
    this.code =code;
    this.stock = stock;
    }
}
// creo las dos instancias de las dos clases

// Creo una nueva instancia de ProductManager
let myProductManager = new ProductManager();

// Verifico que su arreglo products esté vacío
console.log(myProductManager.getProducts()); 

// Creo un nuevo producto
let myProduct = new Product("Forastera de Diana Gabaldon", "libro saga 1", 11699, "https://www.penguinlibros.com/ar/2133507-thickbox_default/forastera-saga-claire-randall-1.jpg", "124541", 5);

// Agrego el producto al ProductManager
myProductManager.addProduct(myProduct);

// Verifico que el producto se haya agregado correctamente
console.log(myProductManager.getProducts());

// Intento agregar el mismo producto nuevamente
myProductManager.addProduct(myProduct); 

// Creo un nuevo producto con un código diferente
let anotherProduct = new Product("Atrapada en el tiempo", "libro saga 2", 12349, "https://www.penguinlibros.com/ar/2133493-thickbox_default/atrapada-en-el-tiempo-saga-claire-randall-2.jpg", "487416", 10);

// Agrego el nuevo producto al ProductManager
myProductManager.addProduct(anotherProduct);

// Verifico que el nuevo producto se haya agregado correctamente
console.log(myProductManager.getProducts());

// Llamo a getProductById con el id del primer producto
console.log(myProductManager.getProductById(1)); 

// Llamo a getProductById con un id que no existe
myProductManager.getProductById(999); 