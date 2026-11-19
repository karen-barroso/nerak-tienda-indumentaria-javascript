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
const URL_PRODUCTOS = "./data.json";

let productosIniciales = [];
let productosObjetos = [];
let siguienteId = 1;

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
const botonRestablecer = document.querySelector("#restablecer-catalogo");

const formatearPrecio = (precio) => "$" + precio.toLocaleString("es-AR");

function mostrarNotificacion(texto, tipo = "exito") {
    if (typeof Toastify === "undefined") {
        mostrarMensaje(texto, tipo);
        return;
    }

    Toastify({
        text: texto,
        duration: 3500,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: tipo === "error"
                ? "linear-gradient(to right, #9C4D4D, #765766)"
                : "linear-gradient(to right, #536B55, #765766)",
            borderRadius: "4px",
            fontFamily: "Manrope, sans-serif",
            fontSize: "13px"
        }
    }).showToast();
}

function cargarLibreriaToastify() {
    return new Promise((resolve, reject) => {
        const estilos = document.createElement("link");

        estilos.rel = "stylesheet";
        estilos.href = "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";

        document.head.appendChild(estilos);

        const script = document.createElement("script");

        script.src = "https://cdn.jsdelivr.net/npm/toastify-js";
        script.onload = resolve;
        script.onerror = () => reject(
            new Error("No se pudo cargar la librería de notificaciones.")
        );

        document.head.appendChild(script);
    });
}

function crearCatalogoInicial() {
    return productosIniciales.map(
        ({ id, nombre, categoria, precio, stock }) =>
            new Producto(id, nombre, categoria, precio, stock)
    );
}

function cargarProductosGuardados() {
    const productosGuardados = localStorage.getItem(CLAVE_STORAGE);

    if (productosGuardados === null) {
        return null;
    }

    try {
        const productosParseados = JSON.parse(productosGuardados);

        if (!Array.isArray(productosParseados)) {
            return null;
        }

        return productosParseados.map(
            ({ id, nombre, categoria, precio, stock }) =>
                new Producto(id, nombre, categoria, precio, stock)
        );
    } catch {
        return null;
    }
}

function guardarProductos() {
    localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify(productosObjetos)
    );
}

function actualizarSiguienteId() {
    siguienteId = productosObjetos.reduce(
        (idMayor, { id }) => Math.max(idMayor, Number(id) || 0),
        0
    ) + 1;
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

function obtenerProductos() {
    return new Promise((resolve, reject) => {
        fetch(URL_PRODUCTOS)
            .then(response => {
                if (!response.ok) {
                    throw new Error(
                        "Error al solicitar los productos: " + response.status
                    );
                }

                return response.json();
            })
            .then(data => {
                setTimeout(() => {
                    if (Array.isArray(data) && data.length > 0) {
                        resolve(data);
                    } else {
                        reject(
                            new Error("El archivo de productos no contiene datos válidos.")
                        );
                    }
                }, 1500);
            })
            .catch(error => reject(error));
    });
}

async function iniciarCatalogo() {
    contenedorProductos.innerHTML = `
        <p class="mensaje-vacio">
            Cargando productos de NERAK...
        </p>
    `;

    try {
        const productosCargados = await obtenerProductos();

        productosIniciales = productosCargados.map(
            ({ id, nombre, categoria, precio, stock }) =>
                new Producto(id, nombre, categoria, precio, stock)
        );

        const productosGuardados = cargarProductosGuardados();

        productosObjetos = productosGuardados !== null
            ? productosGuardados
            : crearCatalogoInicial();

        actualizarSiguienteId();
        guardarProductos();
        renderizarProductos(buscarProductos(buscador.value));

        mostrarNotificacion(
            "El catálogo de NERAK se cargó correctamente.",
            "exito"
        );

    } catch (error) {
        contenedorProductos.innerHTML = `
            <p class="mensaje-vacio">
                No pudimos cargar el catálogo. Intentá nuevamente.
            </p>
        `;

        mostrarMensaje(
            "Ocurrió un error al cargar los productos: " + error.message,
            "error"
        );

        mostrarNotificacion(
            "No se pudo cargar el catálogo de NERAK.",
            "error"
        );

    } finally {
        console.log("Finalizó el proceso de carga del catálogo NERAK.");
    }
}

function agregarProducto(evento) {
    evento.preventDefault();

    const nombre = inputNombre.value.trim();
    const categoria = inputCategoria.value.trim();
    const precio = Number(inputPrecio.value);
    const stock = Number(inputStock.value);

    if (nombre === "" || categoria === "") {
        mostrarMensaje("Completá todos los campos.", "error");
        mostrarNotificacion("Completá todos los campos.", "error");
        return;
    }

    const productoExiste = productosObjetos.some(
        ({ nombre: nombreExistente }) =>
            nombreExistente.toLowerCase() === nombre.toLowerCase()
    );

    if (productoExiste) {
        mostrarMensaje("Ya existe una prenda con ese nombre.", "error");
        mostrarNotificacion("Esa prenda ya existe en el catálogo.", "error");
        return;
    }

    if (Number.isNaN(precio) || precio <= 0) {
        mostrarMensaje("Ingresá un precio válido mayor que cero.", "error");
        mostrarNotificacion("Ingresá un precio válido.", "error");
        return;
    }

    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        mostrarMensaje("Ingresá una cantidad de stock válida.", "error");
        mostrarNotificacion("Ingresá una cantidad de stock válida.", "error");
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

    mostrarMensaje(
        "La prenda se agregó correctamente al catálogo.",
        "exito"
    );

    mostrarNotificacion(
        "La prenda se agregó correctamente al catálogo."
    );
}

function eliminarProducto(id) {
    const indiceProducto = productosObjetos.findIndex(
        producto => producto.id === id
    );

    if (indiceProducto === -1) {
        return;
    }

    const [productoEliminado] = productosObjetos.splice(
        indiceProducto,
        1
    );

    guardarProductos();
    renderizarProductos(buscarProductos(buscador.value));

    mostrarMensaje(
        "Se eliminó " + productoEliminado.nombre + " del catálogo.",
        "exito"
    );

    mostrarNotificacion(
        productoEliminado.nombre + " se eliminó del catálogo."
    );
}

function restablecerCatalogo() {
    productosObjetos = crearCatalogoInicial();

    actualizarSiguienteId();
    buscador.value = "";

    guardarProductos();
    renderizarProductos(productosObjetos);

    mostrarMensaje(
        "El catálogo se restableció correctamente con las prendas iniciales.",
        "exito"
    );

    mostrarNotificacion(
        "El catálogo volvió a sus productos iniciales."
    );
}

function comprarProducto(id) {
    const producto = productosObjetos.find(
        productoActual => productoActual.id === id
    );

    if (!producto) {
        return;
    }

    const compraRealizada = producto.vender(1);

    if (compraRealizada) {
        guardarProductos();

        renderizarProductos(
            buscarProductos(buscador.value)
        );

        mostrarMensaje(
            "¡Compra realizada! Stock actualizado para " + producto.nombre + ".",
            "exito"
        );

        mostrarNotificacion(
            "¡Compra realizada! Stock actualizado para " + producto.nombre + "."
        );
    } else {
        mostrarMensaje(
            "No hay stock disponible de esta prenda.",
            "error"
        );

        mostrarNotificacion(
            "No hay stock disponible de esta prenda.",
            "error"
        );
    }
}

function manejarAcciones(evento) {
    const boton = evento.target.closest(".boton-accion");

    if (!boton) {
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

    renderizarProductos(buscarProductos(termino));
}

formulario.addEventListener("submit", agregarProducto);
contenedorProductos.addEventListener("click", manejarAcciones);
buscador.addEventListener("keyup", filtrarProductos);
botonRestablecer.addEventListener("click", restablecerCatalogo);

setTimeout(() => {
    mostrarNotificacion(
        "¡Bienvenida a NERAK! Descubrí nuestra colección y encontrá tu estilo."
    );
}, 4000);

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

async function iniciarNERAK() {
    try {
        await cargarLibreriaToastify();
    } catch (error) {
        console.error(error.message);
    }

    await iniciarCatalogo();
}

iniciarNERAK();