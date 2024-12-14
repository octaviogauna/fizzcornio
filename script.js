const productos = [
    { id: 1, nombre: "buzo", precio: 26000, imagen: "./img/buzo-coca.jpg", stock: 5 },
    { id: 2, nombre: "camisa", precio: 20000, imagen: "./img/camisa-coca.jpg", stock: 7 },
    { id: 3, nombre: "gorra", precio: 15000, imagen: "./img/gorraa.jpg", stock: 10 },
    { id: 4, nombre: "boxer", precio: 11000, imagen: "./img/boxer.jpg", stock: 8 },
    { id: 5, nombre: "balsamo labial", precio: 20000, imagen: "./img/balsamos.png", stock: 6 },
    { id: 6, nombre: "vaso", precio: 15000, imagen: "./img/vaso-coca.png", stock: 8 },
    { id: 7, nombre: "porta lata coke-diet", precio: 25000, imagen: "./img/porta.lata.diet.jpg", stock: 6 },
    { id: 8, nombre: "heladera osito cocacola", precio: 46000, imagen: "./img/heladerita-osito-coca.png", stock: 5 },
    { id: 9, nombre: "peluches", precio: 11000, imagen: "./img/peluches.png", stock: 7 },
    { id: 10, nombre: "rompecabezas", precio: 20000, imagen: "./img/otro-juego-coca.jpg", stock: 5 },
    { id: 11, nombre: "vasos plasticos", precio: 17000, imagen: "./img/vaso-coquitas.jpg", stock: 5 },
    { id: 12, nombre: "hielera con parlante", precio: 20000, imagen: "./img/hielera-parlantes.png", stock: 5 },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.querySelector(".grid-productos");
const contenedorCarrito = document.querySelector(".carrito-productos");
const totalCarrito = document.querySelector("#total-carrito");
const botonVaciarCarrito = document.querySelector("#vaciar-carrito");
const botonFinalizarCompra = document.querySelector("#finalizar-compra");


document.addEventListener("DOMContentLoaded", async () => {
    await cargarProductosDesdeJSON(); 
    cargarProductos();
    actualizarCarrito();
});

async function cargarProductosDesdeJSON() {
    try {
        const response = await fetch("./productos.json");
        const data = await response.json();
        productos.length = 0; 
        data.forEach((producto) => productos.push(producto)); 
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function cargarProductos() {
    productos.forEach((producto) => {
        const divProducto = document.createElement("div");
        divProducto.classList.add("producto");
        divProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: <span id="stock-${producto.id}">${producto.stock}</span></p>
            <button data-id="${producto.id}" ${producto.stock === 0 ? "disabled" : ""}>
                Añadir al carrito
            </button>
        `;
        contenedorProductos.appendChild(divProducto);
    });

    document.querySelectorAll(".producto button").forEach((btn) =>
        btn.addEventListener("click", agregarAlCarrito)
    );


    gsap.from(".producto", {
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.2,
    });
}

function agregarAlCarrito(evento) {
    const id = parseInt(evento.target.getAttribute("data-id"));
    const producto = productos.find((prod) => prod.id === id);

    if (producto.stock > 0) {
        const productoEnCarrito = carrito.find((item) => item.id === id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        producto.stock--;
        document.querySelector(`#stock-${producto.id}`).textContent = producto.stock;

        if (producto.stock === 0) {
            evento.target.disabled = true;
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();

        gsap.fromTo(
            ".carrito",
            { scale: 1 },
            { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
        );
    } else {
        Swal.fire("Error", "No hay suficiente stock disponible.", "error");
    }
}

function actualizarCarrito() {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((producto, index) => {
        const div = document.createElement("div");
        div.classList.add("carrito-item");
        div.innerHTML = `
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad}</p>
            <button data-index="${index}">Eliminar</button>
        `;
        div.querySelector("button").addEventListener("click", () => eliminarProducto(index));
        contenedorCarrito.appendChild(div);
    });

    const total = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    totalCarrito.textContent = `$${total}`;
}

function eliminarProducto(index) {
    const producto = carrito[index];

    const productoEnInventario = productos.find((prod) => prod.id === producto.id);
    productoEnInventario.stock += carrito[index].cantidad;
    document.querySelector(`#stock-${producto.id}`).textContent = productoEnInventario.stock;

    const botonAgregar = document.querySelector(`button[data-id="${producto.id}"]`);
    if (botonAgregar) botonAgregar.disabled = false;

    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    gsap.to(`.carrito-item[data-index="${index}"]`, {
        x: -200,
        opacity: 0,
        duration: 0.5,
        onComplete: () => actualizarCarrito(),
    });
}

botonVaciarCarrito.addEventListener("click", () => {
    if (carrito.length === 0) {
        return Swal.fire("Carrito vacío", "No hay productos para eliminar.", "warning");
    }

    Swal.fire({
        title: "¿Estás seguro?",
        text: "Se vaciará todo el carrito.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.forEach((productoCarrito) => {
                const productoEnInventario = productos.find((prod) => prod.id === productoCarrito.id);
                productoEnInventario.stock += productoCarrito.cantidad;
                document.querySelector(`#stock-${productoEnInventario.id}`).textContent =
                    productoEnInventario.stock;

                const botonAgregar = document.querySelector(`button[data-id="${productoEnInventario.id}"]`);
                if (botonAgregar) botonAgregar.disabled = false;
            });

            carrito = [];
            localStorage.removeItem("carrito");
            actualizarCarrito();

            Swal.fire("Carrito vaciado", "Todos los productos han sido eliminados.", "success");
        }
    });
});

botonFinalizarCompra.addEventListener("click", async () => {
    if (carrito.length === 0) {
        return Swal.fire("Carrito vacío", "Agrega productos antes de finalizar la compra.", "warning");
    }

    const { value: datos } = await Swal.fire({
        title: "Finalizar Compra",
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
            <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico">
        `,
        confirmButtonText: "Confirmar",
        showCancelButton: true,
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector("#nombre").value;
            const email = Swal.getPopup().querySelector("#email").value;
            if (!nombre || !email) {
                Swal.showValidationMessage("Por favor completa ambos campos");
            }
            return { nombre, email };
        },
    });

    if (datos) {
        Swal.fire(
            "¡Gracias por tu compra!",
            `Se enviará un resumen a ${datos.email}`,
            "success"
        );
        carrito = [];
        localStorage.removeItem("carrito");
        actualizarCarrito();
    }
});