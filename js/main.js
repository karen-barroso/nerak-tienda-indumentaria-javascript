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

const formulario = document.querySelector("#formulario-producto");
const inputNombre = document.querySelector("#nombre-producto");
const inputCategoria = document.querySelector("#categoria-producto");
const inputPrecio = document.querySelector("#precio-producto");
const inputStock = document.querySelector("#stock-producto");
const buscador = document.querySelector("#buscador-productos");
const contenedorProductos = document.querySelector("#contenedor-productos");
const mensajeFeedback = document.querySelector("#mensaje-feedback");
const totalProductos = document.querySelector("#total-productos");
const unidadesStock = document.querySelector("#unidades-stock");
const valorStock = document.querySelector("#valor-stock");

let siguienteId = 10;

const formatearPrecio = (precio) => {
    return "$" + precio.toLocaleString("es-AR");
};

const buscarProductos = function (termino) {
    return productosObjetos.filter(producto =>
        producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(termino.toLowerCase())
    );
};

function mostrarMensaje(texto, tipo) {
    mensajeFeedback.textContent = texto;
    mensajeFeedback.className = "feedback " + tipo;
}

function actualizarResumen() {
    const cantidadUnidades = productosObjetos.reduce(
        (total, producto) => total + producto.stock,
        0
    );

    const valorTotal = productosObjetos.reduce(
        (total, producto) => total + producto.precio * producto.stock,
        0
    );

    totalProductos.textContent = productosObjetos.length;
    unidadesStock.textContent = cantidadUnidades;
    valorStock.textContent = formatearPrecio(valorTotal);
}

function renderizarProductos(lista) {
    contenedorProductos.innerHTML = "";

    if (lista.length === 0) {
        contenedorProductos.innerHTML = `
            <p class="mensaje-vacio">
                No encontramos prendas que coincidan con tu búsqueda.
            </p>
        `;

        actualizarResumen();
        return;
    }

    let contenido = "";

    for (const producto of lista) {
        contenido += `
            <article class="tarjeta-producto">
                <p class="categoria-producto">${producto.categoria}</p>

                <h3>${producto.nombre}</h3>

                <p class="precio-producto">
                    ${formatearPrecio(producto.precio)}
                </p>

                <p class="stock-producto">
                    Stock disponible: ${producto.stock}
                </p>

                <div class="botones-producto">

                    <button
                        class="boton-accion boton-comprar"
                        data-accion="comprar"
                        data-id="${producto.id}"
                        ${producto.stock === 0 ? "disabled" : ""}
                    >
                        Comprar
                    </button>

                    <button
                        class="boton-accion boton-eliminar"
                        data-accion="eliminar"
                        data-id="${producto.id}"
                    >
                        Eliminar
                    </button>

                </div>
            </article>
        `;
    }

    contenedorProductos.innerHTML = contenido;

    actualizarResumen();
}

function agregarProducto(evento) {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const categoria = inputCategoria.value.trim();
    const precio = Number(inputPrecio.value);
    const stock = Number(inputStock.value);

    if (nombre === "" || categoria === "") {
        mostrarMensaje("Completá todos los campos.", "error");
        return;
    }

    if (productosObjetos.some(producto =>
        producto.nombre.toLowerCase() === nombre.toLowerCase()
    )) {
        mostrarMensaje("Ya existe una prenda con ese nombre.", "error");
        return;
    }

    if (isNaN(precio) || precio <= 0) {
        mostrarMensaje("Ingresá un precio válido mayor que cero.", "error");
        return;
    }

    if (isNaN(stock) || stock < 0 || stock % 1 !== 0) {
        mostrarMensaje("Ingresá una cantidad de stock válida.", "error");
        return;
    }

    const nuevoProducto = new Producto(
        siguienteId,
        nombre,
        categoria,
        precio,
        stock
    );

    productosObjetos.push(nuevoProducto);
    siguienteId++;

    formulario.reset();

    renderizarProductos(buscarProductos(buscador.value));

    mostrarMensaje("La prenda se agregó correctamente al catálogo.", "exito");
}

function eliminarProducto(id) {
    const indiceProducto = productosObjetos.findIndex(
        producto => producto.id === id
    );

    if (indiceProducto === -1) {
        return;
    }

    const productoEliminado = productosObjetos.splice(indiceProducto, 1);

    renderizarProductos(buscarProductos(buscador.value));

    mostrarMensaje(
        "Se eliminó " + productoEliminado[0].nombre + " del catálogo.",
        "exito"
    );
}

function comprarProducto(id) {
    const producto = productosObjetos.find(
        producto => producto.id === id
    );

    if (!producto) {
        return;
    }

    if (producto.vender(1)) {
        renderizarProductos(buscarProductos(buscador.value));

        mostrarMensaje(
            "¡Compra realizada! Stock actualizado para " + producto.nombre + ".",
            "exito"
        );
    } else {
        mostrarMensaje("No hay stock disponible de esta prenda.", "error");
    }
}

function manejarAcciones(evento) {
    const boton = evento.target;

    if (!boton.classList.contains("boton-accion")) {
        return;
    }

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accion;

    if (accion === "comprar") {
        comprarProducto(id);
    }

    if (accion === "eliminar") {
        eliminarProducto(id);
    }
}

function filtrarProductos() {
    const termino = buscador.value.trim();

    const productosFiltrados = buscarProductos(termino);

    renderizarProductos(productosFiltrados);
}

formulario.addEventListener("submit", agregarProducto);

contenedorProductos.addEventListener("click", manejarAcciones);

buscador.addEventListener("keyup", filtrarProductos);

renderizarProductos(productosObjetos);

const slides = document.querySelectorAll(".slide");
const indicadores = document.querySelectorAll(".indicador");
const botonAnterior = document.querySelector(".carrusel-flecha.anterior");
const botonSiguiente = document.querySelector(".carrusel-flecha.siguiente");

let slideActual = 0;
let intervaloCarrusel;

function mostrarSlide(indice) {
    if (slides.length === 0 || indicadores.length !== slides.length) {
        return;
    }

    slides[slideActual].classList.remove("activo");
    indicadores[slideActual].classList.remove("activo");

    slideActual = (indice + slides.length) % slides.length;

    slides[slideActual].classList.add("activo");
    indicadores[slideActual].classList.add("activo");
}

function iniciarCarrusel() {
    if (slides.length <= 1) {
        return;
    }

    intervaloCarrusel = setInterval(() => {
        mostrarSlide(slideActual + 1);
    }, 5000);
}

function reiniciarCarrusel() {
    clearInterval(intervaloCarrusel);
    iniciarCarrusel();
}

if (slides.length > 0 && indicadores.length === slides.length) {
    if (botonAnterior) {
        botonAnterior.addEventListener("click", () => {
            mostrarSlide(slideActual - 1);
            reiniciarCarrusel();
        });
    }

    if (botonSiguiente) {
        botonSiguiente.addEventListener("click", () => {
            mostrarSlide(slideActual + 1);
            reiniciarCarrusel();
        });
    }

    indicadores.forEach((indicador, indice) => {
        indicador.addEventListener("click", () => {
            mostrarSlide(indice);
            reiniciarCarrusel();
        });
    });

    iniciarCarrusel();
}