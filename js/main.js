const solicitarNombre = function(mensaje) {
    return prompt(mensaje);
};

const validarCantidad = (cantidad) => {
    return cantidad >= 1 && cantidad <= 20 && !isNaN(cantidad);
};

function solicitarPrenda(numero) {
    return prompt(
        "Prenda número " + numero +
        "\n¿Qué querés comprar?" +
        "\n1. Remera" +
        "\n2. Blusa" +
        "\n3. Camisa" +
        "\n4. Jean" +
        "\n5. Pantalón" +
        "\n6. Vestido" +
        "\n7. Pollera" +
        "\n8. Sweater" +
        "\n9. Campera"
    );
}

function validarPrenda(tipoPrenda) {
    switch (tipoPrenda) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            return true;
        default:
            return false;
    }
}

function obtenerPrecio(tipoPrenda) {
    switch (tipoPrenda) {
        case "1":
            return 25000;
        case "2":
            return 35000;
        case "3":
            return 45000;
        case "4":
            return 65000;
        case "5":
            return 55000;
        case "6":
            return 55000;
        case "7":
            return 45000;
        case "8":
            return 50000;
        case "9":
            return 75000;
        default:
            return 0;
    }
}

function calcularTotal(totalActual, precio) {
    return totalActual + precio;
}

function mostrarEleccion(tipoPrenda, precio) {
    switch (tipoPrenda) {
        case "1":
            console.log("Elegiste una remera. Precio: $" + precio);
            break;
        case "2":
            console.log("Elegiste una blusa. Precio: $" + precio);
            break;
        case "3":
            console.log("Elegiste una camisa. Precio: $" + precio);
            break;
        case "4":
            console.log("Elegiste un jean. Precio: $" + precio);
            break;
        case "5":
            console.log("Elegiste un pantalón. Precio: $" + precio);
            break;
        case "6":
            console.log("Elegiste un vestido. Precio: $" + precio);
            break;
        case "7":
            console.log("Elegiste una pollera. Precio: $" + precio);
            break;
        case "8":
            console.log("Elegiste un sweater. Precio: $" + precio);
            break;
        case "9":
            console.log("Elegiste una campera. Precio: $" + precio);
            break;
    }
}

function mostrarResumen(nombre, total) {
    const mensajeFinal =
        "Gracias por comprar en NERAK, " +
        nombre +
        ". El total de tu compra es de $" +
        total +
        ".";

    alert(mensajeFinal);
    console.log(mensajeFinal);
}

const nombre = solicitarNombre("Bienvenida a NERAK. ¿Cuál es tu nombre?");

let cantidadPrendas = parseInt(prompt("¿Cuántas prendas querés comprar?"));

while (!validarCantidad(cantidadPrendas)) {
    alert("Por favor, ingresá una cantidad válida de prendas. Podés comprar entre 1 y 20 prendas.");
    cantidadPrendas = parseInt(prompt("¿Cuántas prendas querés comprar?"));
}

let totalCompra = 0;

for (let i = 1; i <= cantidadPrendas; i++) {
    let tipoPrenda = solicitarPrenda(i);

    while (!validarPrenda(tipoPrenda)) {
        alert("Opción no válida. Por favor, elegí una prenda del 1 al 9.");
        tipoPrenda = solicitarPrenda(i);
    }

    const precio = obtenerPrecio(tipoPrenda);

    totalCompra = calcularTotal(totalCompra, precio);

    mostrarEleccion(tipoPrenda, precio);
}

mostrarResumen(nombre, totalCompra);