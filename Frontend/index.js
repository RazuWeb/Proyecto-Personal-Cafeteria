///Variables Globales

let carrito = {}

const allProductos = document.querySelector('.productos');

const templateCarrito = document.getElementById('templateCarrito').content;
const templateFooterCarrito = document.getElementById('templateCarritoFooter').content;
const templateMipedido = document.getElementById('templateMiPedido').content
const fragmentCarrito = document.createDocumentFragment() 

const itemsCar = document.getElementById('itemsCar')
const footerTable = document.getElementById('footerTable');
const miPedido = document.getElementById('carrito')

const btnComprar = document.getElementById('btnComprar')
/////////////////////////////////////////////// Eventos addEventListener click/////////////////////////////

allProductos.addEventListener('click', e =>{
  addCarrito(e)
})

itemsCar.addEventListener('click', e =>{
  btnAccion(e)
})

btnComprar.addEventListener('click' ,e=>{ 
 
  
   localStorage.setItem('carrito', JSON.stringify(carrito))

})


/* document.addEventListener("click", e=>{
  console.log(e);
  if(e.target.matches("#carrito"))
  {
    console.log("abriste carrito");
  }
}) */





////////////////////////////////////////////////////FUNCIONES////////////////////////////////////////////////////

///GET Productos
const getAll = async()=>{
  try {
    let res = await axios.get('http://localhost:4000/products'),
        json = await res.data
        console.log(json);

      
      const template = document.getElementById('templateProductosUser').content,
      fragment = document.createDocumentFragment() 
      json.forEach(element => {
        switch(element.categoria){
          case 'Bebida Caliente': 
            template.querySelector(".headProducto").querySelectorAll("img")[0].setAttribute("src",'Administracion/public/img/caliente.png');
            template.querySelector(".headProducto").querySelectorAll("img")[1].setAttribute("src",'Administracion/public/img/caliente.png');
            break;
           
          case 'Postre':
            template.querySelector(".headProducto").querySelectorAll("img")[0].setAttribute("src",'Administracion/public/img/postre.png');
            template.querySelector(".headProducto").querySelectorAll("img")[1].setAttribute("src",'Administracion/public/img/postre.png');          break;

          case 'Bebida Fria':
            template.querySelector(".headProducto").querySelectorAll("img")[0].setAttribute("src",'Administracion/public/img/frio.png');
            template.querySelector(".headProducto").querySelectorAll("img")[1].setAttribute("src",'Administracion/public/img/frio.png');          break;

          case 'Comida':
            template.querySelector(".headProducto").querySelectorAll("img")[0].setAttribute("src",'Administracion/public/img/comida.png');
            template.querySelector(".headProducto").querySelectorAll("img")[1].setAttribute("src",'Administracion/public/img/comida.png');          break;

        }

        template.querySelector(".headProducto").querySelector("h6").textContent = element.nombreProducto;
        template.querySelector(".imgProducto").querySelector("img").setAttribute("src", element.urlImagen);
        template.querySelector(".bodyProducto").querySelectorAll("p")[0].textContent = element.descripcion;
        template.querySelector(".bodyProducto").querySelectorAll("p")[1].textContent = element.precio;
        template.querySelector("button").dataset.idProducto = element.idProducto;

        let clone = document.importNode(template, true);
        fragment.appendChild(clone);
      });
      
      allProductos.appendChild(fragment)

  } catch (error) {
    console.log(error);
  }
}


///////////////////////////////////////////////////Funciones Carrito//////////////////////////////////////
const addCarrito = e =>{
  if(e.target.classList.contains('btnAgregarCarrito')){
    setCarrito(e.target.parentElement)
  }
  e.stopPropagation()
}

const setCarrito = objeto =>{
  const producto = {
  
    id: objeto.querySelector("button").dataset.idProducto,
    nombre: objeto.querySelector(".headProducto").querySelector("h6").textContent,
    descripcion: objeto.querySelector(".bodyProducto").querySelectorAll("p")[0].textContent,
    precio: objeto.querySelector(".bodyProducto").querySelectorAll("p")[1].textContent,
    cantidad: 1
  }

  if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1
  }

  carrito[producto.id] =  {...producto}
  pintarCarrito()

}

const pintarCarrito = ()=>{
  itemsCar.innerHTML = ''
  Object.values(carrito).forEach(producto =>{
    templateCarrito.querySelector('th').textContent = producto.id
    templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
    templateCarrito.querySelector('.btnSumar').dataset.id = producto.id
    templateCarrito.querySelector('.btnRestar').dataset.id = producto.id
    templateCarrito.querySelectorAll('td')[3].textContent = producto.cantidad * producto.precio

    const clone = templateCarrito.cloneNode(true)
    fragmentCarrito.appendChild(clone)
  })
  itemsCar.appendChild(fragmentCarrito)

  pintarFooter();
  pintarMiPedido();
  //localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarMiPedido = e =>{
  miPedido.innerHTML = '';
  if(Object.keys(carrito).length === 0 ){
    miPedido.innerHTML = `<p>Mi pedido:</p>
    <img src="Administracion/public/img/pedido.png" alt="">
    <div>0</div>` 
    return
  }
  console.log(miPedido);
  const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad,0)
  templateMipedido.querySelector('div').textContent = nCantidad
  const clone =  templateMipedido.cloneNode(true)
  fragmentCarrito.appendChild(clone);
  miPedido.appendChild(fragmentCarrito)
}

const pintarFooter = e =>{
  footerTable.innerHTML = '';
  console.log(carrito); 
  if(Object.keys(carrito).length === 0 ){
    footerTable.innerHTML = `<th colspan="5">El pedido se encuentra vacio</th>` 
    return
  }

  const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad,0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio})=> acc + cantidad * precio,0)

  templateFooterCarrito.querySelectorAll('td')[0].textContent = nCantidad
  templateFooterCarrito.querySelectorAll('td')[2].textContent = nPrecio

  const clone = templateFooterCarrito.cloneNode(true)
  fragmentCarrito.appendChild(clone)
  footerTable.appendChild(fragmentCarrito)
  console.log(nPrecio);

  const btnVaciarCarrito = document.getElementById('btnVaciarCarrito')
  btnVaciarCarrito.addEventListener('click', e=>{
    carrito = {}
    pintarCarrito()
  })

}

const  btnAccion = e =>{
  //Accion de aumentar
  if(e.target.classList.contains('btnSumar'))
  {
    console.log(carrito[e.target.dataset.id]);
    const producto = carrito[e.target.dataset.id]
    //otra opcion seria producto.cantidad++
    producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
    carrito[e.target.dataset.id] = {...producto}
    pintarCarrito()
  }

  if(e.target.classList.contains('btnRestar'))
  {
    const producto = carrito[e.target.dataset.id]
    producto.cantidad--
    if(producto.cantidad === 0){
      delete carrito[e.target.dataset.id]
    }
    pintarCarrito()
  }
  e.stopPropagation()
}



////////////////////////////////////////////////MODAL//////////////////////////////////////////////////////
let openModal = document.querySelector('#carrito')
let modalCar = document.querySelector('.modalCarrito')
let modalC = document.querySelector('#modalContainer')
let btncerrar = document.querySelector('#btnCerrar')

function disableScroll(e){  

  window.scrollTo(0, 600);
}

openModal.addEventListener("click", e =>{

  abrirModal()

})

function abrirModal(){
  modalC.style.opacity = "1";
  modalC.style.visibility = "visible";
  modalCar.classList.toggle("modalCarritoClose")
  let scrollPosition = window.scrollY;
  console.log(scrollPosition);
  window.addEventListener('scroll', disableScroll);
}

btncerrar.addEventListener("click", e =>{
  cerrarModal()
})


function cerrarModal(){
  modalCar.classList.toggle("modalCarritoClose");
  let scrollPosition = window.scrollY;
  console.log(scrollPosition);
  window.removeEventListener('scroll', disableScroll);  
  setTimeout(function(){
      modalC.style.opacity ="0";
      modalC.style.visibility ="hidden";
  },900)
}


document.addEventListener("DOMContentLoaded", ()=>{
  getAll()
  /* if(localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
  } */
});
