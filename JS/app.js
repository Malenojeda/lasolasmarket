
let carritoDeCompras = []
let stockProductos = []

//DOM

const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonTerminar = document.getElementById('terminar')
const precioTotal = document.getElementById('precioTotal');
const selecTipo = document.getElementById('selecTipo')
const finCompra = document.getElementById('fin-compra')
const contenedorProductos = document.getElementById('contenedor-productos');
const contadorCarrito = document.getElementById('contadorCarrito');


//EVENTOS
selecTipo.addEventListener('change',()=>{
    if(selecTipo.value == 'all'){
        mostrarProductos(stockProductos)
    }else{
        mostrarProductos(stockProductos.filter(el => el.tipo == selecTipo.value))
    }
})



//FUNCIONES

function mostrarProductos(array){
    $('#contenedor-productos').empty();
    for (const producto of array) {
        let div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML += `<div class="card">
                            <div class="card-image">
                                <img id="prueba" src=${producto.img}>
                                <span class="card-title">${producto.nombre}</span>
                                <a id="boton${producto.id}" class="btn-floating halfway-fab waves-effect waves-light grey"><i class="material-icons">+</i></a>
                            </div>
                            <div class="card-content">
                                <p> $${producto.precio}</p>
                            </div>
                        </div> `
        contenedorProductos.appendChild(div);
        let boton = document.getElementById(`boton${producto.id}`)

        boton.addEventListener('click', ()=>{
            agregarAlCarrito(producto.id)

            Toastify({
                text: "Agregado al carrito ❤",
                duration: 1000, 
                className: "info",
                style: {
                background: "grey",
                }
            }).showToast();
        })
    }
}


function agregarAlCarrito(id) {
    let repetido = carritoDeCompras.find(prodR => prodR.id == id);
    if(repetido){
        repetido.cantidad = repetido.cantidad + 1;
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id="cantidad${repetido.id}">cantidad: ${repetido.cantidad}</p>`
        actualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(prod => prod.id == id);

        carritoDeCompras.push(productoAgregar);
        actualizarCarrito()
        mostrarCarrito(productoAgregar)
    }
    localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
}

function mostrarCarrito(productoAgregar) {
    let div = document.createElement('div')
        div.classList.add('productoEnCarrito')
        div.innerHTML = `<p>${productoAgregar.nombre}</p>
                        <p>Precio:$ ${productoAgregar.precio}</p>
                        <p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>
                        <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`
        contenedorCarrito.appendChild(div)
        
        


        let botonEliminar = document.getElementById(`eliminar${productoAgregar.id}`)

        botonEliminar.addEventListener('click', ()=>{
            if(productoAgregar.cantidad > 1){
                productoAgregar.cantidad = productoAgregar.cantidad - 1
                document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `<p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>`
                localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
                actualizarCarrito()
            }else{
                botonEliminar.parentElement.remove()
                carritoDeCompras = carritoDeCompras.filter(prodE => prodE.id != productoAgregar.id)
                localStorage.setItem('carrito',JSON.stringify(carritoDeCompras))
                actualizarCarrito()  
            }
            
        }) 
}


function  actualizarCarrito (){
    
    if(carritoDeCompras.length > 0){
        document.getElementById('finalizar').style.display= 'inline-block'
        document.getElementById('pagar').innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
    }else{
        document.getElementById('finalizar').style.display= 'none'
    }
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el)=> acc + el.cantidad, 0);
    precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
    
}

//Finalizar  la compra

botonTerminar.innerHTML= '<a id="finalizar" class="waves-effect  btn modal-trigger" href="#modal1">Comprar productos</a>'

finCompra.addEventListener('click',()=>{

    if($('.number').val()== '' || $('.inputname').val() == ''||$('.expire').val()== ''||$('.ccv').val()== ''){
        $('input').css('border', 'solid 1px red')
    }else if(($('.number').val()!= '') && ($('.inputname').val()!= '') && ($('.expire').val() != '') && ($('.ccv').val()!= '')){
        $('input').css('border', 'none')

        $.post("https://jsonplaceholder.typicode.com/posts",JSON.stringify(carritoDeCompras),function(respuesta,estado) {
        if(estado){
            $('#modal1').closeModal();
            contenedorCarrito.innerHTML= `<h6> Las piezas son tuyas! Nos comunicaremos por mail :)`;
            carritoDeCompras= []
            localStorage.clear()
            actualizarCarrito()
        }
    }) 
    }
})

//Ejecucion del programa

$.getJSON('/data/stock.json', function(data){
    data.forEach(elemento => {
        stockProductos.push(elemento)
    })
    
    mostrarProductos(stockProductos)
    recuperar()
    
})

$(()=>{
    $('.modal-trigger').leanModal();
});

