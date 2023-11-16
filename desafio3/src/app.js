// Servidor con express
//Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.
//Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos. 
// Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.
// El servidor debe contar con los siguientes endpoints:
// ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
// Si no se recibe query de límite, se devolverán todos los productos
// Si se recibe un límite, sólo devolver el número de productos solicitados
//ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos. 

import express from "express";
import ProductManager from '../../desafio2/ProductManager.js';

const app = express ();
const PORT = 8080;

const productManager = new ProductManager('desafio3/src/productos.json');


app.use(express.urlencoded({ extended: true }));


app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    let products = await productManager.getProducts();
    if (limit) {
        products = products.slice(0, limit);
    }
    res.json(products);
});

app.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid;
    const product = await productManager.getProductById(Number(pid));
    if (product) {
        res.json(product);
    } else {
        res.json({ error: "Product not found" });
    }
});


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));