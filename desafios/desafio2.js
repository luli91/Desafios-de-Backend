// Manejo de archivos

// Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
// La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
// Debe guardar objetos con el siguiente formato:
// id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
// title (nombre del producto)
// description (descripción del producto)
// price (precio)
// thumbnail (ruta de imagen)
// code (código identificador)
// stock (número de piezas disponibles)
// Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
// Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
// Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto
// Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
// Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
const fs = require ('fs')

class ProductManager{
    constructor (path) {
        this.path = path;
        this.products = [];
        this.currentId = 1;
        if(fs.existsSync(path)){
            try{
                let products= fs.readFileSync(path, "utf8");
                this.products = JSON.parse(products); 
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
        }
    }

    async saveFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

//Este metodo addPorduct agrega un producto, también verifica si todos los campos necesarios están presentes y si el código del producto ya existe en el array.
    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }
        // Busca el producto en el array this.products
    const existingProduct = this.products.find(existingProduct => existingProduct.code === product.code);

    // Si el producto ya existe, no lo agregues
    if (existingProduct) {
        console.error("El producto ya existe");
        return;
    }

        this.currentId++;
        product.id = this.currentId;
        this.products.push(product);
        const respuesta = await this.saveFile(this.products);
        return respuesta;
    }
//Obtengo todos los productos con el método getProducts, que devuelve el array de productos de la linea 23
    getProducts() {
        console.log(this.products);
        return this.products;
    }
//getProductById, busca un producto con el id especificado en el array.
    getProductById(id) {
        for (let product of this.products) {
            if (product.id === id) {
                return product;
            }
        }
        console.error("Producto no encontrado");
    }
//Actualizo un producto con el método updateProduct, que busca un producto con el id especificado y reemplaza ese producto con el nuevo producto en el array.
    async updateProduct(id, newProduct) {
        //busca en el array this.products el índice del producto cuyo id coincide con el id proporcionado. Si no se encuentra ningún producto, findIndex devuelve -1
        const productIndex = this.products.findIndex(product => product.id === id);
        //si productIndex es -1, significa que no se encontró ningún producto con el id proporcionado, por lo que se muestra un mensaje de error
        if (productIndex === -1) {
            console.error("Producto no encontrado");
            return;
        }
        
        //reemplaza el producto existente en el array this.products con el nuevo producto.
        this.products[productIndex] = newProduct;
        //guarda el array actualizado
        const respuesta = await this.saveFile(this.products);
        return respuesta;
    }
    //elimino un producto con el método deleteProduct, que busca un producto con el id especificado y elimina ese producto del array.
    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.error("Producto no encontrado");
            return;
        }
        //Elimina el producto del array this.products. El método splice elimina elementos del array en el índice especificado.
        this.products.splice(productIndex, 1);
        //Guarda el array this.products actualizado (ahora sin el producto eliminado) en el archivo.
        const respuesta = await this.saveFile(this.products);
        return respuesta;
    }
    
}

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

// Creo una instancia de la clase ProductManager
const productManager = new ProductManager('./productos.json');

// Llamo a getProducts, debe devolver un arreglo vacío
console.log(productManager.getProducts()); //[]

// Llamo a addProduct
productManager.addProduct({
    title: "Forastera de Diana Gabaldon",
    description: "libro saga 1",
    price: 11699,
    thumbnail: "https://www.penguinlibros.com/ar/2133507-thickbox_default/forastera-saga-claire-randall-1.jpg",
    code: "abc123",
    stock: 5
});

// Llamo a getProducts nuevamente, debe mostrar el producto recién agregado
console.log(productManager.getProducts());

// Llamo a getProductById
console.log(productManager.getProductById(1));

// Llamo a updateProduct
productManager.updateProduct(1, {
    title: "Atrapada en el tiempo",
    description: "libro saga 2",
    price: 12349,
    thumbnail: "https://www.penguinlibros.com/ar/2133493-thickbox_default/atrapada-en-el-tiempo-saga-claire-randall-2.jpg",
    code: "abc1234",
    stock: 10
});

// Llamo a getProducts para verificar que el producto se haya actualizado
console.log(productManager.getProducts());

// Llamo a deleteProduct
productManager.deleteProduct(1);

// Llamo a getProducts para verificar que el producto se haya eliminado
console.log(productManager.getProducts());