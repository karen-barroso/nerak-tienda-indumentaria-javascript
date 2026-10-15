const nombre = prompt("Bienvenida a NERAK. ¿Cuál es tu nombre?");

class Producto {
    constructor(id, nombre, categoria, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
    }

    vender(cantidad) {
        if (cantidad > 0 && cantidad <= this.stock) {
            this.stock -= cantidad;
            return true;
        }

        return false;
    }

    aplicarDescuento(porcentaje) {
        return this.precio * (1 - porcentaje / 100);
    }
}

const productosObjetos = [
    new Producto(1, "Remera", "Remeras", 25000, 20),
    new Producto(2, "Blusa", "Blusas", 35000, 20),
    new Producto(3, "Camisa", "Camisas", 45000, 20),
    new Producto(4, "Jean", "Jeans", 65000, 20),
    new Producto(5, "Pantalón", "Pantalones", 55000, 20),
    new Producto(6, "Vestido", "Vestidos", 55000, 20),
    new Producto(7, "Pollera", "Polleras", 45000, 20),
    new Producto(8, "Sweater", "Sweaters", 50000, 20),
    new Producto(9, "Campera", "Camperas", 75000, 20)
];

const mostrarCatalogo = (lista) => {
    if (lista.length === 0) {
        return "El catálogo está vacío.";
    }

    let catalogo = "Catálogo de NERAK:\n\n";

    for (const producto of lista) {
        catalogo +=
            producto.id + ". " +
            producto.nombre + " - $" +
            producto.precio.toLocaleString("es-AR") +
            " - Stock: " + producto.stock + "\n";
    }

    return catalogo;
};

const buscarProducto = (nombreProducto) => {
    return productosObjetos.find(
        producto =>
            producto.nombre.toLowerCase() === nombreProducto.trim().toLowerCase()
    );
};

const filtrarPorPrecio = (precioMaximo) => {
    return productosObjetos.filter(
        producto => producto.precio <= precioMaximo
    );
};

const hayStockDisponible = () => {
    return productosObjetos.some(
        producto => producto.stock > 0
    );
};

const mostrarPreciosConDescuento = (porcentaje) => {
    return productosObjetos.map(producto => ({
        nombre: producto.nombre,
        precioOriginal: producto.precio,
        precioConDescuento: producto.aplicarDescuento(porcentaje)
    }));
};

const calcularValorStock = () => {
    return productosObjetos.reduce(
        (total, producto) => total + producto.precio * producto.stock,
        0
    );
};

const aplicarDescuentoCompra = (total) => {
    return total >= 150000 ? total * 0.90 : total;
};

const mostrarMenu = () => {
    return prompt(
        "Bienvenida a NERAK, " + nombre + ".\n\n" +
        "¿Qué querés hacer?\n\n" +
        "1. Ver catálogo\n" +
        "2. Buscar una prenda\n" +
        "3. Filtrar prendas por precio máximo\n" +
        "4. Consultar disponibilidad de stock\n" +
        "5. Ver precios con 10% de descuento\n" +
        "6. Consultar el valor total del stock\n" +
        "7. Comprar prendas\n" +
        "8. Agregar una prenda al catálogo\n" +
        "9. Eliminar la última prenda del catálogo\n" +
        "10. Salir"
    );
};

const agregarProducto = () => {
    const nombreProducto = prompt("Ingresá el nombre de la nueva prenda.");

    if (nombreProducto === null) {
        return;
    }

    const nombreLimpio = nombreProducto.trim();

    if (nombreLimpio === "") {
        alert("El nombre de la prenda no puede estar vacío.");
        return;
    }

    const productoExistente = buscarProducto(nombreLimpio);

    if (productoExistente) {
        alert("Ya existe una prenda con ese nombre en el catálogo.");
        return;
    }

    const categoriaIngresada = prompt("Ingresá la categoría de la prenda.");

    if (categoriaIngresada === null) {
        return;
    }

    const categoriaLimpia = categoriaIngresada.trim();

    if (categoriaLimpia === "") {
        alert("La categoría no puede estar vacía.");
        return;
    }

    const precioIngresado = prompt("Ingresá el precio de la prenda.");

    if (precioIngresado === null) {
        return;
    }

    if (
        precioIngresado.trim() === "" ||
        !Number.isFinite(Number(precioIngresado)) ||
        Number(precioIngresado) <= 0
    ) {
        alert("Ingresá un precio válido mayor que cero.");
        return;
    }

    const stockIngresado = prompt("Ingresá la cantidad de unidades disponibles.");

    if (stockIngresado === null) {
        return;
    }

    if (
        stockIngresado.trim() === "" ||
        !Number.isInteger(Number(stockIngresado)) ||
        Number(stockIngresado) < 0
    ) {
        alert("Ingresá una cantidad entera igual o mayor que cero.");
        return;
    }

    const nuevoId = productosObjetos.reduce(
        (mayorId, producto) => Math.max(mayorId, producto.id),
        0
    ) + 1;

    const nuevoProducto = new Producto(
        nuevoId,
        nombreLimpio,
        categoriaLimpia,
        Number(precioIngresado),
        Number(stockIngresado)
    );

    productosObjetos.push(nuevoProducto);

    alert(
        "La prenda " + nuevoProducto.nombre +
        " se agregó correctamente al catálogo."
    );

    console.log("Producto agregado:", nuevoProducto);
    console.log("Catálogo actualizado:", productosObjetos);
};

const eliminarUltimoProducto = () => {
    if (productosObjetos.length === 0) {
        alert("No hay prendas para eliminar.");
        return;
    }

    const productoEliminado = productosObjetos.pop();

    alert(
        "Se eliminó la última prenda del catálogo: " +
        productoEliminado.nombre
    );

    console.log("Producto eliminado:", productoEliminado);
    console.log("Catálogo actualizado:", productosObjetos);
};

const comprarPrendas = () => {
    if (productosObjetos.length === 0) {
        alert("No hay prendas disponibles en el catálogo.");
        return;
    }

    alert(mostrarCatalogo(productosObjetos));
    console.log(mostrarCatalogo(productosObjetos));

    let cantidadPrendas;
    let cantidadValida = false;

    while (!cantidadValida) {
        const cantidadIngresada = prompt(
            "¿Cuántas prendas diferentes querés comprar? Ingresá un número entre 1 y 20."
        );

        if (cantidadIngresada === null) {
            alert("Cancelaste la compra.");
            return;
        }

        if (
            cantidadIngresada.trim() !== "" &&
            Number.isInteger(Number(cantidadIngresada)) &&
            Number(cantidadIngresada) >= 1 &&
            Number(cantidadIngresada) <= 20
        ) {
            cantidadPrendas = Number(cantidadIngresada);
            cantidadValida = true;
        } else {
            alert("Ingresá una cantidad entera entre 1 y 20.");
        }
    }

    let totalCompra = 0;
    let cantidadComprada = 0;

    for (let i = 1; i <= cantidadPrendas; i++) {
        const nombreElegido = prompt(
            "Prenda " + i + " de " + cantidadPrendas + "\n\n" +
            mostrarCatalogo(productosObjetos) +
            "\nEscribí el nombre de la prenda."
        );

        if (nombreElegido === null) {
            alert("Cancelaste el resto de la compra.");
            break;
        }

        if (nombreElegido.trim() === "") {
            alert("Ingresá el nombre de una prenda.");
            i--;
            continue;
        }

        const productoElegido = buscarProducto(nombreElegido);

        if (!productoElegido) {
            alert("Esa prenda no existe en el catálogo.");
            i--;
        } else if (!productoElegido.vender(1)) {
            alert("No hay stock disponible de esa prenda.");
            i--;
        } else {
            totalCompra += productoElegido.precio;
            cantidadComprada++;

            console.log(
                "Prenda comprada:", productoElegido.nombre,
                "- Precio: $" + productoElegido.precio,
                "- Stock restante: " + productoElegido.stock
            );
        }
    }

    if (cantidadComprada === 0) {
        alert("No se completó ninguna compra.");
        return;
    }

    const totalFinal = aplicarDescuentoCompra(totalCompra);

    let mensajeFinal =
        "Gracias por comprar en NERAK, " + nombre + ".\n\n" +
        "Prendas compradas: " + cantidadComprada + "\n" +
        "Total de tu compra: $" +
        totalCompra.toLocaleString("es-AR") + "\n";

    if (totalFinal < totalCompra) {
        mensajeFinal +=
            "¡Obtuviste un 10% de descuento!\n" +
            "Total final: $" +
            totalFinal.toLocaleString("es-AR");
    } else {
        mensajeFinal +=
            "Total final: $" +
            totalFinal.toLocaleString("es-AR");
    }

    alert(mensajeFinal);
    console.log(mensajeFinal);
};

let opcion = mostrarMenu();

while (opcion !== null && opcion !== "10") {
    switch (opcion) {
        case "1": {
            const catalogo = mostrarCatalogo(productosObjetos);
            alert(catalogo);
            console.log(catalogo);
            break;
        }

        case "2": {
            const nombreBuscado = prompt("¿Qué prenda querés buscar?");

            if (nombreBuscado !== null && nombreBuscado.trim() !== "") {
                const productoEncontrado = buscarProducto(nombreBuscado);

                if (productoEncontrado) {
                    alert(
                        "Encontramos " + productoEncontrado.nombre +
                        ".\nPrecio: $" +
                        productoEncontrado.precio.toLocaleString("es-AR") +
                        "\nStock: " + productoEncontrado.stock
                    );

                    console.log("Producto encontrado:", productoEncontrado);
                } else {
                    alert("No encontramos esa prenda en NERAK.");
                    console.log("No se encontró la prenda:", nombreBuscado);
                }
            } else if (nombreBuscado !== null) {
                alert("Ingresá el nombre de una prenda.");
            }

            break;
        }

        case "3": {
            const precioIngresado = prompt(
                "Ingresá el precio máximo que querés pagar."
            );

            if (
                precioIngresado !== null &&
                precioIngresado.trim() !== "" &&
                Number.isFinite(Number(precioIngresado)) &&
                Number(precioIngresado) >= 0
            ) {
                const productosFiltrados = filtrarPorPrecio(
                    Number(precioIngresado)
                );

                if (productosFiltrados.length > 0) {
                    alert(mostrarCatalogo(productosFiltrados));
                    console.log(
                        "Prendas dentro del precio elegido:",
                        productosFiltrados
                    );
                } else {
                    alert("No hay prendas que se ajusten a ese precio.");
                    console.log("No se encontraron prendas con ese precio máximo.");
                }
            } else if (precioIngresado !== null) {
                alert("Ingresá un precio válido.");
            }

            break;
        }

        case "4": {
            const disponibilidad = hayStockDisponible();

            console.log("¿Hay prendas disponibles?", disponibilidad);

            alert(
                disponibilidad
                    ? "¡Tenemos prendas disponibles para comprar!"
                    : "En este momento no hay prendas disponibles."
            );

            break;
        }

        case "5": {
            const productosConDescuento = mostrarPreciosConDescuento(10);

            console.log("Precios con 10% de descuento:", productosConDescuento);

            let mensaje = "PRECIOS NERAK CON 10% DE DESCUENTO\n\n";

            for (const producto of productosConDescuento) {
                mensaje +=
                    producto.nombre + ": $" +
                    producto.precioConDescuento.toLocaleString("es-AR") +
                    "\n";
            }

            alert(mensaje);
            break;
        }

        case "6": {
            const valorTotalStock = calcularValorStock();

            console.log("Valor total del stock: $" + valorTotalStock);

            alert(
                "El valor total del stock es de $" +
                valorTotalStock.toLocaleString("es-AR")
            );

            break;
        }

        case "7": {
            comprarPrendas();
            break;
        }

        case "8": {
            agregarProducto();
            break;
        }

        case "9": {
            eliminarUltimoProducto();
            break;
        }

        default: {
            alert("Opción no válida. Elegí un número del 0 al 9.");
        }
    }

    opcion = mostrarMenu();
}

alert("Gracias por visitar NERAK. ¡Hasta pronto!");