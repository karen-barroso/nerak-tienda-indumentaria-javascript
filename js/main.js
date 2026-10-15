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
        "¿Qué querés hacer?\n" +
        "1. Ver catálogo\n" +
        "2. Buscar una prenda\n" +
        "3. Filtrar prendas por precio máximo\n" +
        "4. Consultar disponibilidad de stock\n" +
        "5. Ver precios con 10% de descuento\n" +
        "6. Consultar el valor total del stock\n" +
        "7. Comprar prendas"
    );
};

let opcion = mostrarMenu();

while (
    opcion !== null &&
    !["1", "2", "3", "4", "5", "6", "7"].includes(opcion)
) {
    alert("Opción no válida.");
    opcion = mostrarMenu();
}

if (opcion === "1") {
    const catalogo = mostrarCatalogo(productosObjetos);
    alert(catalogo);
    console.log(catalogo);

} else if (opcion === "2") {
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
    }

} else if (opcion === "3") {
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

} else if (opcion === "4") {
    const disponibilidad = hayStockDisponible();

    console.log("¿Hay prendas disponibles?", disponibilidad);

    alert(
        disponibilidad
            ? "¡Tenemos prendas disponibles para comprar!"
            : "En este momento no hay prendas disponibles."
    );

} else if (opcion === "5") {
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

} else if (opcion === "6") {
    const valorTotalStock = calcularValorStock();

    console.log("Valor total del stock: $" + valorTotalStock);

    alert(
        "El valor total del stock es de $" +
        valorTotalStock.toLocaleString("es-AR")
    );

} else if (opcion === "7") {
    alert(mostrarCatalogo(productosObjetos));
    console.log(mostrarCatalogo(productosObjetos));

    let cantidadPrendas;
    let cantidadValida = false;
    let compraCancelada = false;

    while (!cantidadValida && !compraCancelada) {
        const cantidadIngresada = prompt(
            "¿Cuántas prendas querés comprar? Ingresá un número entre 1 y 20."
        );

        if (cantidadIngresada === null) {
            compraCancelada = true;
        } else if (
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

    if (compraCancelada) {
        alert("Cancelaste la compra.");
    }

    for (
        let i = 1;
        i <= cantidadPrendas && !compraCancelada;
        i++
    ) {
        const nombreElegido = prompt(
            "Prenda " + i + " de " + cantidadPrendas + "\n\n" +
            mostrarCatalogo(productosObjetos) +
            "\nEscribí el nombre de la prenda."
        );

        if (nombreElegido === null) {
            compraCancelada = true;
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

            console.log(
                "Prenda comprada:", productoElegido.nombre,
                "- Precio: $" + productoElegido.precio,
                "- Stock restante: " + productoElegido.stock
            );
        }
    }

    if (!compraCancelada) {
        const totalFinal = aplicarDescuentoCompra(totalCompra);

        let mensajeFinal =
            "Gracias por comprar en NERAK, " + nombre + ".\n\n" +
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
    }
}