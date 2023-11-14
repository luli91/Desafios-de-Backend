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
import fs from 'fs';

export default class ProductManager{
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

        product.id = this.currentId++;
        this.products.push(product);
        const respuesta = await this.saveFile(this.products);
        return respuesta;
    }
//Obtengo todos los productos con el método getProducts, que devuelve el array de productos de la linea 23
    getProducts() {
        // console.log(this.products);
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

async updateProduct(id, newProduct) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
        console.error("Producto no encontrado");
        return;
    }

    //newProdut verifica si el nuevo producto tiene un codigo ( que no sea null, undefined, nan o false). le metodo some this.products.some(...) lo que hace es recorrer cada elemento del array y aplicarle una función que le paso como argumento. Luego la funcion que pase por parametro toma un producto existente como argumento (existingProduct) y comprueba si el código de este producto es igual al código del nuevo producto (existingProduct.code === newProduct.code) y si el id de este producto es diferente al id proporcionado (existingProduct.id !== id). Si ambas condiciones son verdaderas, la función devuelve true entonces despues lo reemplaza
    
    if (newProduct.code && this.products.some(existingProduct => existingProduct.code === newProduct.code && existingProduct.id !== id)) {
        console.error("El código del producto ya existe");
        return;
    }

    // Reemplaza el producto existente en el array this.products con el nuevo producto, pero mantiene el id y el code del producto original.
    this.products[productIndex] = { //es como si estuviera copiando todas las propiedades del producto existente en un nuevo objeto.
        ...this.products[productIndex],
        ...newProduct, // lo mismo que el anterior, pero con el nuevo producto
        id: this.products[productIndex].id, //se asegura que el id quede igual 
        code: this.products[productIndex].code // lo mismo que el id
    };
    
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

// // Llamo a getProducts, debe devolver un arreglo vacío
// console.log(productManager.getProducts()); //[]

//La palabra clave await solo puede usarse dentro de una función asíncrona porque si no me tira error!!!
(async () => { 
    // Llamo a addProduct
    await productManager.addProduct({
        title: "El duque y yo",
        description: "libro Julia Quinn",
        price: 11115,
        thumbnail: "https://http2.mlstatic.com/D_NQ_NP_766649-MLA44209854761_112020-O.webp",
        code: "abcd123",
        stock: 5
    });

    await productManager.addProduct({
        title: "Forastera de Diana Gabaldon",
        description: "libro saga 1",
        price: 11699,
        thumbnail: "https://www.penguinlibros.com/ar/2133507-thickbox_default/forastera-saga-claire-randall-1.jpg",
        code: "abc123",
        stock: 5
    });

    await productManager.addProduct({
        title: "Atrapada en el tiempo",
        description: "libro saga 2",
        price: 17.699,
        thumbnail: "https://www.penguinlibros.com/ar/2133493-thickbox_default/atrapada-en-el-tiempo-saga-claire-randall-2.jpg",
        code: "abc1234",
        stock: 10
    });

    await productManager.addProduct({
        title: "Viajera",
        description: "libro saga 3",
        price: 22.599,
        thumbnail: "https://www.penguinlibros.com/ar/2133494-thickbox_default/viajera-saga-claire-randall-3.jpg",
        code: "abc12345",
        stock: 8
    });
    await productManager.addProduct({
        title: "Tambores de otoño",
        description: "libro saga 4",
        price: 20.599,
        thumbnail: "https://www.penguinlibros.com/ar/2133487-home_default/tambores-de-otono-saga-claire-randall-4.webp",
        code: "ab123",
        stock: 10
    });

    
    await productManager.addProduct({
        title: "La cruz ardiente",
        description: "libro saga 5",
        price: 23.599,
        thumbnail: "https://www.penguinlibros.com/ar/2133484-home_default/la-cruz-ardiente-saga-outlander-5.webp",
        code: "ab1234",
        stock: 8
    });

    await productManager.addProduct({
        title: "Viento y ceniza",
        description: "libro saga 6",
        price: 21.899,
        thumbnail: "https://www.penguinlibros.com/ar/2133501-home_default/viento-y-ceniza-saga-claire-randall-6.webp",
        code: "ab12345",
        stock: 6
    });

    await productManager.addProduct({
        title: "Ecos del pasado",
        description: "libro saga 7",
        price: 19.399,
        thumbnail: "https://www.penguinlibros.com/ar/2133502-home_default/ecos-del-pasado-saga-claire-randall-7.webp",
        code: "a1234",
        stock: 2
    });

    await productManager.addProduct({
        title: "50 sombras de grey",
        description: "saga 1",
        price: 26784,
        thumbnail: "https://www.penguinlibros.com/ar/2131763-thickbox_default/cincuenta-sombras-de-grey-cincuenta-sombras-1.jpg",
        code: "def123",
        stock: 2
    });

    await productManager.addProduct({
        title: "Cincuenta sombras liberadas",
        description: "saga 2",
        price: 15648,
        thumbnail: "https://www.penguinlibros.com/ar/1648981-large_default/cincuenta-sombras-liberadas.webp",
        code: "de123",
        stock: 2
    });

    await productManager.addProduct({
        title: "Harry Potter y el legado maldito",
        description: "libro saga 8",
        price: 22.099,
        thumbnail: "https://www.penguinlibros.com/ar/2126891-thickbox_default/harry-potter-y-el-legado-maldito-harry-potter-8.jpg",
        code: "a123",
        stock: 7
    });
    // Llamo a getProducts nuevamente, debe mostrar el producto recién agregado
    // console.log(productManager.getProducts());

    // Llamo a getProductById
    // console.log(productManager.getProductById(8));

    // Llamo a updateProduct
    await productManager.updateProduct(8, {
        title: "Escrito con la sangre de mi corazon",
        description: "libro saga 8",
        price: 22.899,
        thumbnail: "https://www.penguinlibros.com/ar/2133513-home_default/escrito-con-la-sangre-de-mi-corazon-saga-outlander-8.webp",
        code: "a12345",
        stock: 3
    });

    // Llamo a getProducts para verificar que el producto se haya actualizado
    // console.log(productManager.getProducts());

    // Llamo a deleteProduct
    await productManager.deleteProduct(1);

    // Llamo a getProducts para verificar que el producto se haya eliminado
    // console.log(productManager.getProducts());
})();
