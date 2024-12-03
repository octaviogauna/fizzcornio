const productos = [
    { id: 1, nombre: "buzo", precio: 26000, imagen: "./img/buzo-coca.jpg" },
    { id: 2, nombre: "camisa", precio: 20000, imagen: "./img/camisa-coca.jpg" },
    { id: 3, nombre: "gorra", precio: 15000, imagen: "./img/gorraa.jpg" },
    { id: 4, nombre: "boxer", precio: 11000, imagen: "./img/boxer.jpg" },
    { id: 5, nombre: "balsamo labial", precio: 20000, imagen: "./img/balsamos.png" },
    
    { id: 6, nombre: "vaso", precio: 15000, imagen: "./img/vaso-coca.png" },
    { id: 7, nombre: "porta lata coke-diet", precio: 25000, imagen: "./img/porta.lata.diet.jpg" },
    { id: 8, nombre: "heladera osito cocacola", precio: 46000, imagen: "./img/heladerita-osito-coca.png" },
    { id: 9, nombre: "peluches", precio: 11000, imagen: "./img/peluches.png" },
    { id: 10, nombre: "rompecabezas", precio: 20000, imagen: "./img/otro-juego-coca.jpg" },
    { id: 11, nombre: "vasos plasticos", precio: 17000, imagen: "./img/vaso-coquitas.jpg" },
    { id: 12, nombre: "hielera con parlante", precio: 20000, imagen: "./img/hielera-parlantes.png" },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.querySelector(".grid-productos");
const totalCarrito = document.querySelector("#total-carrito");
const botonVaciarCarrito = document.querySelector("#vaciar-carrito");

function cargarProductos() {
    productos.forEach(producto => {
        const divProducto = document.createElement("div");
        divProducto.classList.add("producto");
        divProducto.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <button data-id="${producto.id}">Añadir al carrito</button>
        `;
        contenedorProductos.appendChild(divProducto);
    });
    document.querySelectorAll(".producto button").forEach(btn =>
        btn.addEventListener("click", agregarAlCarrito)
    );
}

function agregarAlCarrito(evento) {
    const id = parseInt(evento.target.getAttribute("data-id"));
    const producto = productos.find(prod => prod.id === id);
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function actualizarCarrito() {
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    totalCarrito.textContent = total;
}

botonVaciarCarrito.addEventListener("click", () => {
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCarrito();
});

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarCarrito();
});

