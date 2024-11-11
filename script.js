const productos = [
    { id: 1, categoria: "ropa", nombre: "buzo", precio: 26000 , color: "rojo" },
    { id: 2, categoria: "ropa", nombre: "camisa", precio: 20000, color: "gris" },
    { id: 3, categoria: "accesorio", nombre: "gorra", precio: 15000, color: "gris-oscuro" },
    { id: 4, categoria: "ropa", nombre: "boxer", precio: 11000, color: "gris" },
    { id: 5, categoria: "accesorio", nombre: "balsamo labial", precio: 20000, color: "varios" },
    { id: 14, categoria: "hogar", nombre: "vaso metalico", precio: 17000, color: "rojo" },
    { id: 6, categoria: "hogar", nombre: "vasos plasticos", precio: 17000, color: "rojo" },
    { id: 7, categoria: "hogar", nombre: "hielera", precio: 30000, color: "rojo" },
    { id: 8, categoria: "hogar", nombre: "heladerita cocacola", precio: 100000, color: "rojo" },
    { id: 9, categoria: "hogar", nombre: "heladerita oso cocacola", precio: 110000, color: "rojo" },


    { id: 10, categoria: "accesorio", nombre: "Llavero", precio: 15000, color: "varios" },
    { id: 11, categoria: "accesorio", nombre: "cartera coke-diet", precio: 27000, color: "plateado" },
    { id: 12, categoria: "accesorio", nombre: "cartera cocacola", precio: 30000, color: "rojo" },
    { id: 13, categoria: "juguete", nombre: "cocacola opoly", precio: 35000, color: "varios" },
    { id: 15, categoria: "juguete", nombre: "rompecabezas", precio: 55000, color: "varios" }

];

function mostrarProductosCategoria(categoria) {
    let productosCategoria = productos.filter(item => item.categoria === categoria);
    if (productosCategoria.length > 0) {
        let mensaje = 'Productos en la categoría ${categoria}:\n';
        productosCategoria.forEach(item => {
            mensaje += 'ID: ${item.id}, Nombre: ${item.nombre}, Precio: $${item.precio}, Color: ${item.color}\n';
        });
        alert(mensaje);
        return productosCategoria;
    } else {
        alert("Categoría no encontrada.");
        return [];
    }
}

function calcularTotalCompra(productosSeleccionados) {
    let total = 0;
    productosSeleccionados.forEach(producto => {
        total += producto.precio;
    });
    return total;
}

function capturarEntrada() {
    let categoriaSeleccionada = prompt("Elige una categoría: ropa, vaso, heladerita, juguete, accesorio, objetos").toLowerCase();
    let productosCategoria = mostrarProductosCategoria(categoriaSeleccionada);
    
    if (productosCategoria.length > 0) {
        let idsSeleccionados = prompt("Ingresa los ID de los productos que deseas comprar, separados por comas:");
        let idsArray = idsSeleccionados.split(",").map(id => parseInt(id.trim()));
        
        let productosSeleccionados = productosCategoria.filter(item => idsArray.includes(item.id));
        if (productosSeleccionados.length > 0) {
            let total = calcularTotalCompra(productosSeleccionados);
            mostrarResultado(productosSeleccionados, total);
        } else {
            alert("No se seleccionaron productos válidos.");
        }
    }
}

function mostrarResultado(productosSeleccionados, total) {
    let mensaje = "Productos seleccionados:\n";
    productosSeleccionados.forEach(producto => {
        mensaje += `${producto.nombre} - $${producto.precio}\n`;
    });
    mensaje += `Total a pagar: $${total}`;
    alert(mensaje);
}

capturarEntrada();