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

const CLAVE_STORAGE = "nerak-productos";

const productosIniciales = [
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

function cargarProductos() {
    const productosGuardados = localStorage.getItem(CLAVE_STORAGE);

    if (productosGuardados === null) {
        return productosIniciales;
    }

    try {
        const productosParseados = JSON.parse(productosGuardados) ?? [];

        if (!Array.isArray(productosParseados)) {
            return productosIniciales;
        }

        return productosParseados.map(({ id, nombre, categoria, precio, stock }) =>
            new Producto(id, nombre, categoria, precio, stock)
        );
    } catch {
        return productosIniciales;
    }
}

let productosObjetos = cargarProductos();

let siguienteId = productosObjetos.reduce(
    (idMayor, { id }) => Math.max(idMayor, Number(id) || 0),
    0
) + 1;

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

const formatearPrecio = (precio) => "$" + precio.toLocaleString("es-AR");

function guardarProductos() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productosObjetos));
}

function buscarProductos(termino) {
    const busqueda = termino.toLowerCase();

    return productosObjetos.filter(({ nombre, categoria }) =>
        nombre.toLowerCase().includes(busqueda) ||
        categoria.toLowerCase().includes(busqueda)
    );
}

function mostrarMensaje(texto, tipo) {
    mensajeFeedback.textContent = texto;
    mensajeFeedback.className = "feedback " + tipo;
}

function actualizarResumen() {
    const cantidadUnidades = productosObjetos.reduce(
        (total, { stock }) => total + stock,
        0
    );

    const valorTotal = productosObjetos.reduce(
        (total, { precio, stock }) => total + precio * stock,
        0
    );

    totalProductos.textContent = productosObjetos.length;
    unidadesStock.textContent = cantidadUnidades;
    valorStock.textContent = formatearPrecio(valorTotal);
}

function renderizarProductos(lista) {
    if (lista.length === 0) {
        contenedorProductos.innerHTML = `
            <p class="mensaje-vacio">
                No encontramos prendas que coincidan con tu búsqueda.
            </p>
        `;
        actualizarResumen();
        return;
    }

    contenedorProductos.innerHTML = lista.map(
        ({ id, nombre, categoria, precio, stock }) => `
            <article class="tarjeta-producto">
                <p class="categoria-producto">${categoria}</p>
                <h3>${nombre}</h3>
                <p class="precio-producto">${formatearPrecio(precio)}</p>
                <p class="stock-producto">Stock disponible: ${stock}</p>

                <div class="botones-producto">
                    <button
                        class="boton-accion boton-comprar"
                        data-accion="comprar"
                        data-id="${id}"
                        ${stock === 0 ? "disabled" : ""}
                    >
                        Comprar
                    </button>

                    <button
                        class="boton-accion boton-eliminar"
                        data-id="${id}"
                        data-accion="eliminar"
                    >
                        Eliminar
                    </button>
                </div>
            </article>
        `
    ).join("");

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

    const productoExiste = productosObjetos.some(
        ({ nombre: nombreExistente }) =>
            nombreExistente.toLowerCase() === nombre.toLowerCase()
    );

    if (productoExiste) {
        mostrarMensaje("Ya existe una prenda con ese nombre.", "error");
        return;
    }

    if (Number.isNaN(precio) || precio <= 0) {
        mostrarMensaje("Ingresá un precio válido mayor que cero.", "error");
        return;
    }

    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
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

    guardarProductos();
    formulario.reset();

    renderizarProductos(buscarProductos(buscador.value));
    mostrarMensaje("La prenda se agregó correctamente al catálogo.", "exito");
}

function eliminarProducto(id) {
    const indiceProducto = productosObjetos.findIndex(
        (producto) => producto.id === id
    );

    if (indiceProducto === -1) {
        return;
    }

    const [productoEliminado] = productosObjetos.splice(indiceProducto, 1);

    guardarProductos();
    renderizarProductos(buscarProductos(buscador.value));

    mostrarMensaje(
        "Se eliminó " + productoEliminado.nombre + " del catálogo.",
        "exito"
    );
}

function comprarProducto(id) {
    const producto = productosObjetos.find(
        (productoActual) => productoActual.id === id
    );

    if (!producto) {
        return;
    }

    const compraRealizada = producto.vender?.(1) ?? false;

    if (compraRealizada) {
        guardarProductos();
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
    const boton = evento.target.closest(".boton-accion");

    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accion;

    accion === "comprar"
        ? comprarProducto(id)
        : accion === "eliminar"
            ? eliminarProducto(id)
            : undefined;
}

function filtrarProductos() {
    const termino = buscador.value.trim();
    renderizarProductos(buscarProductos(termino));
}

formulario.addEventListener("submit", agregarProducto);
contenedorProductos.addEventListener("click", manejarAcciones);
buscador.addEventListener("keyup", filtrarProductos);

// Guarda el catálogo inicial la primera vez que se abre la página.
guardarProductos();
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