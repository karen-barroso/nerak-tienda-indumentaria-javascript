const CLAVE_CARRITO = "nerak-carrito";

let carrito = [];

const contenedorCarrito = document.querySelector("#contenedor-carrito");
const subtotalCarrito = document.querySelector("#subtotal-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const botonVaciarCarrito = document.querySelector("#vaciar-carrito");
const botonConfirmarCompra = document.querySelector("#confirmar-compra");
const mensajeCarrito = document.querySelector("#mensaje-carrito");

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

    if (carritoGuardado === null) {
        carrito = [];
        return;
    }

    try {
        const datosCarrito = JSON.parse(carritoGuardado);

        carrito = Array.isArray(datosCarrito)
            ? datosCarrito.filter(
                ({ id, cantidad }) =>
                    Number.isInteger(Number(id)) &&
                    Number.isInteger(Number(cantidad)) &&
                    Number(cantidad) > 0
            ).map(({ id, cantidad }) => ({
                id: Number(id),
                cantidad: Number(cantidad)
            }))
            : [];
    } catch {
        carrito = [];
    }
}

function guardarCarrito() {
    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );
}

function mostrarMensajeCarrito(texto, tipo = "exito") {
    mensajeCarrito.textContent = texto;
    mensajeCarrito.className = "feedback " + tipo;
}

function obtenerSubtotal() {
    const productos = window.NERAK.obtenerProductos();

    return carrito.reduce((total, item) => {
        const producto = productos.find(
            productoActual => productoActual.id === item.id
        );

        return producto
            ? total + producto.precio * item.cantidad
            : total;
    }, 0);
}

function actualizarTotales() {
    const subtotal = obtenerSubtotal();

    subtotalCarrito.textContent =
        window.NERAK.formatearPrecio(subtotal);

    totalCarrito.textContent =
        window.NERAK.formatearPrecio(subtotal);
}

function renderizarCarrito() {
    const productos = window.NERAK.obtenerProductos();

    carrito = carrito.filter(item =>
        productos.some(producto => producto.id === item.id)
    );

    guardarCarrito();

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <p class="mensaje-vacio">
                Tu carrito está vacío. Agregá tus prendas favoritas.
            </p>
        `;

        actualizarTotales();
        return;
    }

    contenedorCarrito.innerHTML = carrito.map(item => {
        const producto = productos.find(
            productoActual => productoActual.id === item.id
        );

        if (!producto) {
            return "";
        }

        return `
            <article class="producto-carrito">
                <div class="informacion-carrito">
                    <p class="categoria-producto">${producto.categoria}</p>
                    <h3>${producto.nombre}</h3>
                    <p>${window.NERAK.formatearPrecio(producto.precio)} c/u</p>
                    <strong>
                        Subtotal:
                        ${window.NERAK.formatearPrecio(producto.precio * item.cantidad)}
                    </strong>
                </div>

                <div class="controles-cantidad">
                    <button
                        type="button"
                        class="boton-cantidad"
                        data-accion-carrito="disminuir"
                        data-id="${item.id}"
                        aria-label="Disminuir cantidad"
                    >
                        −
                    </button>

                    <span>${item.cantidad}</span>

                    <button
                        type="button"
                        class="boton-cantidad"
                        data-accion-carrito="aumentar"
                        data-id="${item.id}"
                        aria-label="Aumentar cantidad"
                        ${item.cantidad >= producto.stock ? "disabled" : ""}
                    >
                        +
                    </button>

                    <button
                        type="button"
                        class="boton-accion boton-eliminar"
                        data-accion-carrito="eliminar"
                        data-id="${item.id}"
                    >
                        Eliminar
                    </button>
                </div>
            </article>
        `;
    }).join("");

    actualizarTotales();
}

function agregarAlCarrito(id) {
    const productos = window.NERAK.obtenerProductos();

    const producto = productos.find(
        productoActual => productoActual.id === id
    );

    if (!producto) {
        return;
    }

    if (producto.stock <= 0) {
        window.NERAK.mostrarNotificacion(
            "No hay stock disponible de esta prenda.",
            "error"
        );
        return;
    }

    const productoEnCarrito = carrito.find(
        item => item.id === id
    );

    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad >= producto.stock) {
            window.NERAK.mostrarNotificacion(
                "No podés agregar más unidades de esta prenda.",
                "error"
            );
            return;
        }

        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: id,
            cantidad: 1
        });
    }

    guardarCarrito();
    renderizarCarrito();

    window.NERAK.mostrarNotificacion(
        producto.nombre + " se agregó al carrito."
    );
}

function modificarCantidad(id, cambio) {
    const productos = window.NERAK.obtenerProductos();

    const item = carrito.find(
        producto => producto.id === id
    );

    const producto = productos.find(
        productoActual => productoActual.id === id
    );

    if (!item || !producto) {
        return;
    }

    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    if (nuevaCantidad > producto.stock) {
        window.NERAK.mostrarNotificacion(
            "No hay suficiente stock disponible.",
            "error"
        );
        return;
    }

    item.cantidad = nuevaCantidad;

    guardarCarrito();
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(
        item => item.id !== id
    );

    guardarCarrito();
    renderizarCarrito();

    window.NERAK.mostrarNotificacion(
        "La prenda se eliminó del carrito."
    );
}

function vaciarCarrito(mostrarAviso = true) {
    carrito = [];

    guardarCarrito();
    renderizarCarrito();

    if (mostrarAviso) {
        window.NERAK.mostrarNotificacion(
            "El carrito se vació correctamente."
        );
    }
}

function manejarAccionesCarrito(evento) {
    const boton = evento.target.closest("[data-accion-carrito]");

    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accionCarrito;

    if (accion === "aumentar") {
        modificarCantidad(id, 1);
    }

    if (accion === "disminuir") {
        modificarCantidad(id, -1);
    }

    if (accion === "eliminar") {
        eliminarDelCarrito(id);
    }
}

function confirmarCompra() {
    if (carrito.length === 0) {
        mostrarMensajeCarrito(
            "Tu carrito está vacío. Agregá prendas antes de confirmar el pedido.",
            "error"
        );
        return;
    }

    const productos = window.NERAK.obtenerProductos();

    const compraValida = carrito.every(item => {
        const producto = productos.find(
            productoActual => productoActual.id === item.id
        );

        return producto && item.cantidad <= producto.stock;
    });

    if (!compraValida) {
        mostrarMensajeCarrito(
            "No hay stock suficiente para completar el pedido. Revisá las cantidades.",
            "error"
        );

        window.NERAK.mostrarNotificacion(
            "No se pudo confirmar el pedido por falta de stock.",
            "error"
        );

        return;
    }

    const totalCompra = obtenerSubtotal();

    carrito.forEach(item => {
        const producto = productos.find(
            productoActual => productoActual.id === item.id
        );

        producto.vender(item.cantidad);
    });

    window.NERAK.guardarProductos();

    vaciarCarrito(false);

    window.NERAK.renderizarProductosActuales();
    window.NERAK.actualizarResumen();

    mostrarMensajeCarrito(
        "¡Tu pedido fue confirmado correctamente! Total: " +
        window.NERAK.formatearPrecio(totalCompra),
        "exito"
    );

    window.NERAK.mostrarNotificacion(
        "¡Gracias por elegir NERAK! Tu pedido fue confirmado."
    );
}

function iniciarCarrito() {
    cargarCarrito();
    renderizarCarrito();

    contenedorCarrito.addEventListener(
        "click",
        manejarAccionesCarrito
    );

    botonVaciarCarrito.addEventListener(
        "click",
        () => vaciarCarrito()
    );

    botonConfirmarCompra.addEventListener(
        "click",
        confirmarCompra
    );

    document.addEventListener(
        "catalogoActualizado",
        renderizarCarrito
    );
}

window.NERAK.agregarAlCarrito = agregarAlCarrito;

document.addEventListener(
    "DOMContentLoaded",
    iniciarCarrito
);